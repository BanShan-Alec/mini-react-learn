import React from '../core/React.js'
import ReactDom from '../core/ReactDom.js'
import {App} from './App.jsx'
// import {Pragma} from './Pragma.jsx'

// ReactDom.createRoot(document.getElementById('root')).render(App);
// ReactDom.createRoot(document.getElementById('root')).render(Pragma);
// TODO render 方法不支持 Fn组件
ReactDom.createRoot(document.getElementById('root')).render(<App />);