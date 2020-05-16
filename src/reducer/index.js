// 这个文件是创建reducer函数的，专门用来处理发过来的action
const initState = {
	value: '默认值'
};
const reducer = (state = initState, action) => {
    console.log('reducer',state,action)
	switch (action.type) {
		case 'send_action':
			return { ...state, ...action };
		default:
			return state;
	}
};
module.exports = {
	reducer
};
