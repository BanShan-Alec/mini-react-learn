import ReactDom from '../core/ReactDom.js'
import {App} from './App.jsx'

// TODO jsx 转换成 createElement
ReactDom.createRoot(document.getElementById('root')).render(App);