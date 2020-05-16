import React, { Component } from 'react';

import { Button } from 'antd-mobile';
export default class QuestiontionIndex extends Component {
	constructor(props){
		super(props)
		console.log(props)
	}
	handle=()=>{
		this.props.history.push('./me')
	}
	render() {
		return (
			<div>
				主页
				<Button onClick={this.handle}>去首页</Button>
			</div>
		);
	}
}
