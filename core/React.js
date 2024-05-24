export const createTextElement = (text) => {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }

}

export const createElement = (type, props, ...children) => {
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

export function render(el, container) {
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