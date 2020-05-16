// 这是action 构建函数
const sendAction = ()=>{
    // 需要返回一个action对象
    return {
        type:'send_action',
        value:'我使一个action对象'
    }
}
module.exports={
    sendAction
}