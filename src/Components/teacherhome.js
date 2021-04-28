import React, {Component} from 'react';
import '../App.css';
import '../config'; 
import* as firebase from 'firebase'
import {ResponsiveDrawer} from './navbar'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import fire from '../config';
import dashboardComponent from './dashboard'
import announcement from './announcement'
import createTest from './createTest'
import test from './test'
import checkTest from './checkTest'
import resultTest from './studentResults'
import profile from './profile'
import Video from './VideoChat/VideoMeeting.js'
import ZoomVideo from './zoom/VideoMeeting.js'
import ChatRoom from './chatting/WelcomeScreen.js'
import Chat from './chatting/ChatScreen.js'
import Students from './studentsRecord.js'
import Verification from './verification.js'








class teacherHomeComponent extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    componentDidMount(){
        console.log(window.location.pathname);
    }

    render(){

        if (localStorage.getItem("Teacher") == null ){
            console.log('null')
            return <Redirect to="/teacherlogin" />
        }

        return (
            <React.Fragment>
                <Router >
                <div className="appgrid component-background" >
                    <div>

              
                        <ResponsiveDrawer /> 
                    
                    {/* {
                        window.location.pathname=='/teacher/chat' ? <Chat  />
                        :
                        <ResponsiveDrawer /> 
                    } */}
                    

                    </div>
                    <div>

                  
                        <Switch>
                        <Route exact path="/teacher" component={dashboardComponent}  />  
                        <Route exact path="/teacher/create-announcement" component={announcement}  />  
                        <Route exact path="/teacher/create-test" component={createTest}  /> 
                        <Route exact path="/teacher/test" component={test}  /> 
                        <Route exact path="/teacher/test/check" component={checkTest}  /> 
                        <Route exact path="/teacher/test/result" component={resultTest}  /> 
                        <Route exact path="/teacher/profile" component={profile}  /> 
                        <Route exact path="/teacher/video" component={Video}  /> 
                        <Route exact path="/teacher/zoom" component={ZoomVideo}  /> 
                        <Route exact path="/teacher/chatScreen" component={ChatRoom}  /> 
                        <Route exact path="/teacher/chat" component={Chat}  /> 
                        <Route exact path="/teacher/view/student" component={Students}  /> 
                        <Route exact path="/teacher/students/verification" component={Verification}  /> 

                        







                        {/* <Route exact path="/home/:id" component={schoolDetails} key={this.props.match.params.id}  />  */}
                        {/* <Route exact path="/home/:id" render={(props) => (
                            <schoolDetails key={props.match.params.id} {...props} />)
                            } /> */}
                        {/* <Route exact path="/home/:id/tests" component={tests}  />
                        <Route exact path="/home/:id/:id" component={classDetails}  />      
                        <Route exact path="/home/:id/:id/result" component={results}  />    */}
                         
                        
                        </Switch>
                   
                    
                    </div>
                    <div></div>
                </div>
                </Router>
            </React.Fragment>
          );

    }
  
}

export default teacherHomeComponent;