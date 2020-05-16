import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import '../../css/login.scss'
// 引入第三方库zepto 滑块NoCaptcha md5
const $ = require("Zepto")
const NoCaptcha =require("NoCaptcha")
var md5 = require('md5');
export default class Login extends Component{
  constructor(props){
		super(props)
    this.state={
      nums:60,
      // 获取验证码按钮状态
      btnDisabled:false,
      // 滑块的显示状态
      displayName:'none',
      // 验证码输入框的状态
      smsCodeDisplay:'none'
    }
  }
  componentDidMount() {
    if (window.devicePixelRatio && devicePixelRatio >= 2) {
        document.querySelector('.getSms').className = 'getSms scale';
    }
    document.title =  '登录';
    this.init()
  }
   doLoop=()=> {
    this.setState({
      nums:this.state.nums-1
    })
    if (this.state.nums > 0) {
      $('#getSms').text(this.state.nums + 'S')
    } else {
        clearInterval(this.clock); //清除js定时器
        $('#getSms').text('获取验证码')
        this.setState({
          btnDisabled:false,
          nums : 60
        }) //重置时间
        $('#getSms').removeClass('bg');
    }
}
  sendCode=()=> {
    this.setState({
      btnDisabled:true
    })
    $('#getSms').text(this.state.nums + 'S')
    this.clock = setInterval(this.doLoop, 1000);
    $('#getSms').addClass('bg');
  }
  // 获取token
  getToken= async ()=>{
    const res = await this.$axios({url:'/user/auth/token',method: 'post',  data: {
      wechatId: 'Fred'
    },})
    console.log(res)
  }
  init=()=>{
     this.getToken()
    var nc_token = ["FFFF0N0N000000007FD1", (new Date()).getTime(), Math.random()].join(':');
    var nc = NoCaptcha.init({
        renderTo: '#nc',
        appkey: 'FFFF0N0N000000007FD1',
        scene: 'nc_message_h5',
        token: nc_token,
        trans: {
            "key1": "code200"
        },
        elementID: ["usernameID"],
        is_Opt: 0,
        language: "cn",
        timeout: 10000,
        retryTimes: 5,
        errorTimes: 5,
        inline: false,
        apimap: {
            // 'analyze': '//a.com/nocaptcha/analyze.jsonp',
            // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
        },
        bannerHidden: false,
        initHidden: false,
        callback: (data)=> {
           this.setState({
            displayName:'none',
            smsCodeDisplay:'block'
           })
            nc.reset()
            $.ajax({
                url: 'https://testdevgw.medtap.cn/user/3.0/sendCode/login',
                type: 'post',
                async: true,
                contentType: "application/json",
                headers:{
                    'apptype': 'wechat_lung',//不同平台需更换
                    'user-os':'wechat'
                },
                data: JSON.stringify({
                    sessionId: data.csessionid,
                    sig: data.sig,
                    ncToken: nc_token,
                    scene: 'nc_message_h5',
                    mobile: $('#mobile').val()
                }),
                success: (data)=> {
                  console.log(data)
                    if (data.success) {
                        this.sendCode();
                        // winPop('验证码已发送，请注意查收！');
                    } else {
                        // winPop(data.resultDesc);
                    }

                },
                error: function(err) {
                    console.log('err: ' + err);
                }
            });
        },
        error: function(s) {

        }
    });
    NoCaptcha.setEnabled(true);
    nc.reset(); //请务必确保这里调用一次reset()方法
    NoCaptcha.upLang('cn', {
        'LOADING': "加载中...", //加载
        'SLIDER_LABEL': "请向右滑动验证", //等待滑动
        'CHECK_Y': "验证通过", //通过
        'ERROR_TITLE': "非常抱歉，这出错了...", //拦截
        'CHECK_N': "验证未通过", //准备唤醒二次验证
        'OVERLAY_INFORM': "经检测你当前操作环境存在风险，请输入验证码", //二次验证
        'TIPS_TITLE': "验证码错误，请重新输入" //验证码输错时的提示
    });
  }
  handleClick = () => {
    // this.inputRef.focus();
  }
  getRequest=(name)=> {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = encodeURI(window.location.search).substr(1).match(reg);
    if (r != null) return decodeURI(unescape(r[2]));
    return null;
  }
  setToken=(obj)=> {
      function isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
      }
  
      function sortByKey(ob) {
        var arr = [],
          newObj = {};
        for(var key in ob) {
          arr.push(key);
        }
        arr = arr.sort();
        arr.forEach(function(key) {
          (!!ob[key] || typeof(ob[key]) === 'boolean' || ob[key] === 0) && (newObj[key] = ob[key]);
        });
        arr = null;
        return newObj;
      }
  
      function getStr(ob) {
        function judge(arr) {
          var a = [];
          [].forEach.call(arr, function(ar) {
            typeof ar === 'object' ?
              a.push(JSON.stringify(ar)) :
              (typeof ar === 'number' ? a.push(ar) : a.push('"' + ar.toString() + '"'));
          });
          return a.join(',');
        }
        var str = [];
        for(var key in ob) {
          str.push(key + '=' + (isArray(ob[key]) ? '[' + judge(ob[key]) + ']' : ob[key]));
        }
        return md5(str.join('&').toLowerCase());
      }
  
      var auth_time_stamp = new Date().getTime().toString(),
        auth_nonce = (parseInt(Math.random() * 10000000000)).toString();
      if(!obj || !typeof(obj) === 'object') {
        obj = {};
      } else {
        obj = sortByKey(obj);
      }
      obj.auth_time_stamp = auth_time_stamp
      obj.auth_nonce = auth_nonce;
      obj.auth_secret_key = '733828MTIzNDU2CShFp1468889281801r9uV0aajI10';
      obj.auth_sign = getStr(obj);
      delete obj['auth_secret_key'];
      return obj;
    
	}
  showToast=(message)=> {
    Toast.info(message, 1);
  }
  onClickUserText=()=>{
		this.props.history.push('./usertext')
  }
  onClickGetSms=()=>{
    if (!/^1[0-9]{10}$/.test($('#mobile').val())) {
      this.showToast('手机号格式错误！')
      return;
    } else {
      // $('#__nc').show();
      // $('.icon-smsCode').hide();
      this.setState({
        displayName:'block',
        smsCodeDisplay:'none'
      })
    }
  }
  onClickloginIn=()=>{
    if (!$('#mobile').val()) {
      this.showToast('请输入手机号')
      return;
    }
    if (!/^1[0-9]{10}$/.test($('#mobile').val())) {
      this.showToast('请输入合法的手机号')
      return;
    }
    if (!$('#smsCode').val()) {
      this.showToast('请输入验证码')
      return;
    }
    $.ajax({
      url: 'https://testdevgw.medtap.cn/user/loginUserByWechat',
      type: 'post',
      async: true,
      dataType: 'json',
      headers: {
        'apptype': 'wechat',
        'user-os':'wechat'
      },
      contentType: "application/json",
      data: JSON.stringify(this.setToken({
        mobile: $('#mobile').val(),
        smsCode: $('#smsCode').val(),
        wechatId: 'aa',
        // extra:{  
        //   operationType:34,
        // }
      })),
      success: (data)=> {
        if (data.success) {
          this.showToast('登录成功!')
          var token = data.content.token;
          localStorage.setItem('wechatToken', token);
          setTimeout(function() {
            window.location.replace('pages/success.html')
          }, 1000)
        } else {
          this.showToast(data.resultDesc)
        }
      },
      error: function(err) {
        console.log('err: ' + err);
      }
    });
  }
  render(){
    return(
      <div className="content">
        <div className="loginBox">
          <img src="assets/images/login_img_logo@2x.png" alt="" className='loginImg'/>
        </div>
        <div>
            <ul className="box">
                <li className="box-cell icon-mobile">
                    <input type="tel" className="mobile" placeholder="请输入手机号" id="mobile" name="mobile" onKeyUp="value=value.replace(/[^\d]/g,'')" />
                    <button className="getSms" type="button" id="getSms" onClick={this.onClickGetSms} disabled={this.state.btnDisabled}>获取验证码</button>
                </li>
                <li className="box-cell top-1 icon-smsCode" style={{display:this.state.smsCodeDisplay}}>
                    <input className="smsCode" type="tel" placeholder="验证码" id="smsCode" name="smsCode" maxLength="4" />
                </li>
                <li className="nc_box">
                    <div id="__nc" style={{display:this.state.displayName}}>
                        <div id="nc"></div>
                    </div>
                </li>
                <button className="login" type="button" id="login" onClick={this.onClickloginIn}>登录</button>
            </ul>
            <div className="footer">
                <p>登录/注册易加医账号，即已同意<span className="text-51c6d0 userLicens" onClick={this.onClickUserText}>《易加医用户协议》</span></p>
            </div>
        </div>
     </div>
    )
  }
}