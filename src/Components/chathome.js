import React, { Component } from 'react';
import '../App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ChatRoom from './chatting/WelcomeScreen.js'
import Chat from './chatting/ChatScreen.js'





class teacherHomeComponent extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {

        if (localStorage.getItem("Teacher") == null) {
            console.log('null')
            return <Redirect to="/teacherlogin" />
        }

        return (
            <React.Fragment>
                <Router >
                    <div  >

                        <div>


                            <ChatRoom />



                        </div>
                        <div>


                            <Switch>

                                <Route exact path="/teacher/chatScreen/chat" component={Chat} />




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