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
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === 'object' ? child : createTextElement(child);
            }),
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

const handleDomProps = (dom, props) => {
    Object.entries(props)
        .filter(([key]) => key !== 'children')
        .forEach(([key, value]) => {
            dom[key] = value;
        });
};

const constructFiber = (el, parent) => {
    return {
        el,
        dom: null,
        parent,
        child: null,
        sibling: null,
    };
};

const handleFiber = (fiber) => {
    if (!fiber.dom) {
        // 每遍历一个Dom就渲染一次
        // FIXME：requestIdleCallback卡顿的时间很长的情况，会导致整个dom竖渲染不连贯
        const dom = (fiber.dom = createDomByType(fiber.el.type));
        handleDomProps(dom, fiber.el.props);
        // fiber.parent?.dom.appendChild(dom);
    }

    // 树结构（前序遍历）展开为链表，一边遍历一边构建链表
    // https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/solutions/356853/er-cha-shu-zhan-kai-wei-lian-biao-by-leetcode-solu
    const children = fiber.el.props.children;
    let prevChild = null;
    children.forEach((child) => {
        const childFiber = constructFiber(child, fiber);
        if (prevChild) {
            prevChild.sibling = childFiber;
        } else {
            fiber.child = childFiber;
        }
        prevChild = childFiber;
    });

    // 返回下一个fiber
    // 返回undefined，表示渲染结束
    if (fiber.child) {
        return fiber.child;
    }

    if (fiber.sibling) {
        return fiber.sibling;
    }

    // FIXME: return parent.sibling，会找不到爷爷节点的兄弟节点（只有一层）
    // 一直向上找，直到找到有兄弟节点的节点
    let tmpFiber = fiber;
    while (tmpFiber.parent) {
        if (tmpFiber.parent.sibling) {
            return tmpFiber.parent.sibling;
        }
        tmpFiber = tmpFiber.parent;
    }
};

let nextFiber = null;
let firstFiber = null;
function workLoop(deadline) {
    while (deadline.timeRemaining() > 1) {
        // 执行任务
        if (nextFiber) {
            console.log('workLoop: do work');
            if (!firstFiber) firstFiber = nextFiber;
            nextFiber = handleFiber(nextFiber);
        } else {
            console.log('workLoop: work end');
            // 等待链表构建完成，再渲染
            if (!firstFiber) return;
            console.log('render: start', firstFiber);
            commitWork(firstFiber);
            firstFiber = null;
        }
    }
    requestIdleCallback(workLoop);
}
requestIdleCallback(workLoop);

function commitWork(fiber) {
    if (fiber.parent) fiber.parent.dom.appendChild(fiber.dom);
    if (fiber.child) commitWork(fiber.child);
    if (fiber.sibling) commitWork(fiber.sibling);
}

export function render(el, container) {
    const rootFiber = constructFiber(
        {
            type: 'ROOT',
            props: {
                children: [el],
            },
        },
        null
    );
    rootFiber.dom = container;
    nextFiber = rootFiber;
}

export default {
    createElement,
    render,
    createTextElement,
};
