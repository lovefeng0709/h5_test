import React  from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'lib-flexible';
import * as serviceWorker from './serviceWorker';
// 导入axios
import axios from 'axios'
// 配置axios
var $axios = axios.create({
  baseURL: 'https://testdevgw.medtap.cn',
  timeout: 1500,
  headers: {
    'apptype': 'wechat',//不同平台需更换
    'user-os': 'wechat'
  }
})
// 挂载到全局
React.Component.prototype.$axios = $axios
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
