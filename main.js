import ReactDom from './core/ReactDom.js'
import { createElement } from './core/React.js';

// TODO jsx 转换成 createElement
ReactDom.createRoot(document.getElementById('root')).render(createElement('div', { id: 'app' }, 'Hello World', '12341235'));