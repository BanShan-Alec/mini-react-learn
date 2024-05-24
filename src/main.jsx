import React from '../core/React.js'
import ReactDom from '../core/ReactDom.js'
import {App} from './App.jsx'

ReactDom.createRoot(document.getElementById('root')).render(App);
// TODO render 方法不支持 Fn组件
// ReactDom.createRoot(document.getElementById('root')).render(<App />);