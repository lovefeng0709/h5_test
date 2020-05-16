import React from 'react';
import './App.scss';
import { BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import 'antd-mobile/dist/antd-mobile.css';
import QuestionIndex from './pages/questionIndex'
import Login from './pages/login'
import UserText from './pages/userText'
function Home(){
     return (
          <div>
               <h1>首页</h1>
          </div>
     )
}
function Me(){
     return (
          <div>
               <h1>我的</h1>
          </div>
     )
}
function About(){
     return (
          <div>
               <h1>关于</h1>
          </div>
     )
}
export default class App extends React.Component{
   
     render(){
          return(
               <div id="app">
                    <Router>
                         <Switch>
                              <Route path="/" exact component={Home}></Route>
                              <Route path="/question"  component={QuestionIndex}></Route>
                              <Route path="/Me" component={Me}></Route>
                              <Route path="/About" component={About} ></Route>
                              <Route path="/login" component={Login} ></Route>
                              <Route path="/usertext" component={UserText} ></Route>
                         </Switch>
                    </Router>
               </div>
          )
     }
}
