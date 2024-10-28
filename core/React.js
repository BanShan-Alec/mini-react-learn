export const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: [],
        },
    };
};

export const createElement = (type, props, ...children) => {
    const getChildren = () => {
        return children.flatMap((child) => {
            if (child === null || child === undefined) return [];
            if (Array.isArray(child)) return child;
            if (typeof child === 'object') return [child];
            return createTextElement(child);
        });
    };
    return {
        type,
        props: {
            ...props,
            children: getChildren(),
        },
    };
};

const createDomByType = (type) => {
    switch (type) {
        case 'TEXT_ELEMENT':
            return document.createTextNode('');
        default:
            return document.createElement(type);
    }
};

const handleDomProps = (dom, props, oldProps = {}) => {
    if (!props) return;
    // 如何更新props(新旧的fiber是同一个dom)
    // 1. old 有 new 无，删除
    Object.entries(oldProps).forEach(([key, value]) => {
        if (props[key]) return;
        if (key.startsWith('on') && typeof value === 'function') {
            const eventType = key.substring(2).toLowerCase();
            dom.removeEventListener(eventType, value);
        } else if (key === 'style') {
            dom.setAttribute('style', '');
        } else if (key !== 'children') {
            dom.removeAttribute(key);
        }
    });
    // 2. old 无 new 有，添加
    // 3. old 有 new 有，更新
    Object.entries(props).forEach(([key, value]) => {
        const oldValue = oldProps[key];
        if (oldValue === value) return;
        // 事件绑定，如onClick
        if (key.startsWith('on') && typeof value === 'function') {
            const eventType = key.substring(2).toLowerCase();
            if (oldValue) dom.removeEventListener(eventType, oldValue);
            dom.addEventListener(eventType, value);
        } else if (key === 'style' && value) {
            // [关于使用动态样式的信息 - Web API | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Object_Model/Using_dynamic_styling_information)
            const styleText = Object.entries(value)
                .map(([k, v]) => `${k}:${v}`)
                .join(';');
            dom.setAttribute('style', styleText);
        } else if (key !== 'children') {
            dom[key] = value;
        }
    });
};

const constructFiber = (el, options) => {
    const {
        dom = null,
        child = null,
        sibling = null,
        parent = null,
        effectTag = 'placement',
        alternate = null,
    } = options || {};
    return {
        el,
        dom,
        parent,
        child,
        sibling,
        effectTag, // 用于commitWork
        alternate, // 用于diff
    };
};

const handleFunctionComponent = (fiber) => {
    fiber.el.props.children = [
        fiber.el.type({
            ...fiber.el.props,
            children: fiber.el.props.children,
        }),
    ];
};
const handleNormalComponent = (fiber) => {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDomByType(fiber.el.type));
        handleDomProps(dom, fiber.el.props);
    }
};
const reconcileChildren = (fiber, children) => {
    let oldFiber = fiber.alternate?.child;
    let prevFiber = null;
    children.forEach((curEl) => {
        let newFiber = null;
        const isSameType = oldFiber ? curEl.type === oldFiber.el.type : false;

        if (isSameType) {
            // update
            newFiber = constructFiber(curEl, {
                dom: oldFiber.dom,
                parent: fiber,
                alternate: oldFiber,
                effectTag: 'update',
            });
        } else {
            // new
            newFiber = constructFiber(curEl, {
                parent: fiber,
                effectTag: 'placement',
            });
        }

        if (prevFiber) {
            prevFiber.sibling = newFiber;
        } else {
            fiber.child = newFiber;
        }
        // 保存上一个fiber，用于构建链表
        prevFiber = newFiber;

        // 正在遍历children，oldFiber也要跟着链表指针后移，指向兄弟节点
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
    });
};

const handleFiber = (fiber) => {
    console.log('handleFiber', fiber);
    const isFunctionComponent = typeof fiber.el.type === 'function';
    if (isFunctionComponent) {
        handleFunctionComponent(fiber);
    } else {
        handleNormalComponent(fiber);
    }

    reconcileChildren(fiber, fiber.el.props.children);

    // 返回下一个fiber
    // 返回undefined，表示渲染结束
    if (fiber.child) {
        return fiber.child;
    }

    let tmpFiber = fiber;
    while (tmpFiber) {
        if (tmpFiber.sibling) {
            return tmpFiber.sibling;
        }
        tmpFiber = tmpFiber.parent;
    }
};

let nextFiber = null;
let firstFiber = null;
let rootFiber = null;
function workLoop(deadline) {
    while (deadline.timeRemaining() > 16) {
        // 执行任务
        if (nextFiber) {
            console.log('workLoop: do work');
            if (!firstFiber) firstFiber = nextFiber;
            nextFiber = handleFiber(nextFiber);
        } else {
            // 等待链表构建完成，再渲染
            if (firstFiber) {
                console.log('render: start', firstFiber);
                commitWork(firstFiber);
                console.log('render: end');
                rootFiber = firstFiber;
                firstFiber = null;
            }
        }
    }
    requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function commitWork(fiber) {
    if (fiber.effectTag === 'placement') {
        if (fiber.dom) {
            let tmpFiber = fiber;
            while (tmpFiber) {
                if (tmpFiber.parent?.dom) {
                    tmpFiber.parent.dom.appendChild(fiber.dom);
                    break;
                }
                tmpFiber = tmpFiber.parent;
            }
        }
    } else if (fiber.effectTag === 'update') {
        handleDomProps(fiber.dom, fiber.el.props, fiber.alternate?.el.props);
    }

    if (fiber.child) commitWork(fiber.child);
    if (fiber.sibling) commitWork(fiber.sibling);
}

export function render(el, container) {
    const _rootFiber = constructFiber(
        {
            type: 'ROOT',
            props: {
                children: [el],
            },
        },
        {
            dom: container,
        }
    );
    nextFiber = _rootFiber;
}

export function update() {
    console.log('update', rootFiber);

    if (!rootFiber) return;
    // 重新渲染，构建一颗新的fiber树
    const _rootFiber = constructFiber(
        {
            type: 'ROOT',
            props: rootFiber.el.props,
        },
        {
            dom: rootFiber.dom,
            alternate: rootFiber,
        }
    );
    nextFiber = _rootFiber;
}

export default {
    createElement,
    render,
    update,
    createTextElement,
};
