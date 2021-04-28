import React, {useEffect, useState, Component} from 'react';

import '../config'; 
import* as firebase from 'firebase'
import {ResponsiveDrawer} from './navbar'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import dashboardPrincipalComponent from '../ComponentsPrincipal/dashboard'
// import schoolDetails from '../ComponentsEx/schoolDetails'
import classDetails from '../ComponentsPrincipal/classDetails'
import feesDetails from '../ComponentsPrincipal/feesDetail'
import testDetails from '../ComponentsPrincipal/testDetails'
import test from '../ComponentsPrincipal/test'
import expenditure from '../ComponentsPrincipal/expenditure'
import inventory from '../ComponentsPrincipal/inventory'
import announcement from '../ComponentsPrincipal/announcements'
import results from '../ComponentsPrincipal/results'
import teacherDetails from '../ComponentsPrincipal/teacherDetails'
import profile from './profile'
import ChatRoom from './chatting/WelcomeScreen.js'
import Chat from './chatting/ChatScreen.js'
import classPromotion from './promotion.js'
import Verification from './verification.js'



class princiHomeComponent extends Component {
    constructor(){
        super();
        this.state = {
            loggedIn: true
        }
    }

    render(){

        

        if (localStorage.getItem("user") == null ){
            console.log('null')
            return <Redirect to="/principallogin" />
        }


        return (

            <React.Fragment>
                <Router >
                <div className="appgrid component-background" >
                    <div >
                    <ResponsiveDrawer /> 
                    </div>
                    <div>

                  
                        <Switch>
                       <Route exact path="/principal/" component={dashboardPrincipalComponent}  />  
                       <Route exact path="/principal/profile/" component={profile}  /> 

                       <Route exact path="/principal/:id/" component={classDetails}  />  
                        <Route exact path="/principal/:id/fees" component={feesDetails}  />  
                        <Route exact path="/principal/:id/tests" component={testDetails}  /> 
                       <Route exact path="/principal/:id/promotion" component={classPromotion}  />  

                        <Route exact path="/principal/test/details" component={test}  />  
                    <Route exact path="/principal/:id/result" component={results}  />    
                    <Route exact path="/principal/:id/expenditure" component={expenditure}  />    
                    <Route exact path="/principal/:id/inventory" component={inventory}  />    
                    <Route exact path="/principal/:id/announcements" component={announcement}  />    
                    <Route exact path="/principal/:id/teachers" component={teacherDetails}  />  
                    <Route exact path="/principal/:id/chatScreen" component={ChatRoom}  /> 
                    <Route exact path="/principal/:id/chat" component={Chat}  /> 
                    <Route exact path="/principal/:id/verification" component={Verification}  /> 








                        {/*  <Route exact path="/executive/:id" component={schoolDetails} key={this.props.match.params.id}  />  */}
                        {/* <Route exact path="/home/:id" render={(props) => (
                            <schoolDetails key={props.match.params.id} {...props} />)
                            } /> */}
                        {/* <Route exact path="/executive/:id/tests" component={tests}  />
                        <Route exact path="/executive/:id/:id" component={classDetails}  />      
                        <Route exact path="/executive/:id/:id/result" component={results}  />    */}
                         
                        
                        </Switch>
                   
                    
                    </div>
                    <div></div>
                </div>
                </Router>
            </React.Fragment>
          );
    }
}

export default princiHomeComponent;