console.log('Hello World');
// 实现react createElement
// ReactDOM.createRoot(document.getElementById('root')!).render(<div id="app">Hello World</div>);

// v1 直接创建dom元素
// document.createTextNode('Hello World');

// v2 react vdom虚拟dom：用js对象来描述dom结构

// const textEl = {
//     type: 'TEXT_ELEMENT',
//     props: {
//         nodeValue: 'Hello World！！！',
//         children: []
//     }

// }
// const el = {
//     type: 'div',
//     props: {
//         id: "app",
//         children: [
//             textEl,
//         ]
//     }
// }

const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }

}

const createElement = (type, props, ...children) => {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === 'object' ? child : createTextElement(child);
            })
        }
    }
}

// render
// const el = createElement('div', { id: 'app' }, createTextElement('Hello World~~~~'));
// console.log('el', el);

// const dom = document.createElement(el.type);
// dom.id = el.props.id;
// document.getElementById('root').append(dom);

// el.props.children.forEach((child) => {
//     if (child.type === 'TEXT_ELEMENT') {
//         const text = document.createTextNode(child.props.nodeValue);
//         text.nodeValue
//         dom.appendChild(text);
//     }
// })

function render(el, container) {
    const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type);

    Object.entries(el.props).filter(([key]) => key !== 'children').forEach(([key, value]) => {
        dom[key] = value;
    })

    // 递归渲染子元素
    el.props.children.forEach((child) => {
        render(child, dom);
    })

    container.appendChild(dom);
}


// const root = document.getElementById('root');
// render(createElement('div', { id: 'app' }, 'Hello My friends', ' 123'), root);

// v3
// ReactDOM.createRoot(document.getElementById('root')!).render(<div id="app">Hello World</div>);
const ReactDOM = {
    createRoot: (container) => {
        return {
            render: (el) => {
                render(el, container);
            }
        }
    }
}
ReactDOM.createRoot(document.getElementById('root')).render(createElement('div', { id: 'app' }, 'Hello My friends', '@@@@@123'));