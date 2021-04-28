import React, {Component} from 'react';
import './AppStudent.css';
import '../config'; 
import* as firebase from 'firebase'
import {ResponsiveDrawer} from './navbar'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import {fire} from '../config';
import dashboardComponent from './dashboardStudent'
import solveTest from './studentTest'
import studentResult from './studentResults'
import profile from './profile'
import Video from './VideoChat/VideoMeeting.js'
import Suggestions from './suggestions.js'
import ZoomVideo from './zoom/VideoMeeting.js'
import chatScreen from './chatting/WelcomeScreen.js'
import Chat from './chatting/ChatScreen.js'






class studentHomeComponent extends Component {
    constructor(){
        super()
        this.state = {

        }
    }

    render(){

        if (localStorage.getItem("Student") == null ){
            
            return <Redirect to="/studentlogin" />
        }

        return (
            <React.Fragment>
                <Router >
                <div className="appgrid component-background" >
                    <div>
                    <ResponsiveDrawer /> 
                    </div>
                    <div>

                  
                        <Switch>
                        <Route exact path="/student" component={dashboardComponent}  />  
                        <Route exact path="/student/test" component={solveTest}  />  
                        <Route exact path="/student/result" component={studentResult}  />  
                        <Route exact path="/student/profile" component={profile}  /> 
                        <Route exact path="/student/video" component={Video}  />  
                        <Route exact path="/student/suggestions" component={Suggestions}  />  
                        <Route exact path="/student/zoom" component={ZoomVideo}  />  
                        <Route exact path="/student/chatScreen" component={chatScreen}  />  
                        <Route exact path="/student/chat" component={Chat}  />  


            







                        
                        
                        
                        
                         
                        
                        </Switch>
                   
                    
                    </div>
                    <div></div>
                </div>
                </Router>
            </React.Fragment>
          );

    }
  
}

export default studentHomeComponent;