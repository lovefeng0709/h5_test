import React from 'react'
// 导入store
import store from '../../store'
// 导入action构建函数
import {sendAction} from '../../action'
export default class Home extends React.Component{
handleClick=()=>{
    const action = sendAction()
    // 发送一个action 利用store
    store.dispatch(action)
}
componentDidMount(){
    store.subscribe(()=>{
        console.log('subscribe',store.getState())
        this.setState({})
    })
}
 render(){
    return (
        <div>
            <button onClick={this.handleClick}>发送action</button>
            <p>{store.getState().value}</p>
        </div>
    )
 }
}