import React, { useEffect, useState, Component } from 'react';
// import './AppEx.css';
import '../config';
import * as firebase from 'firebase'
import { ResponsiveDrawer } from './navbar'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import fire from '../configEx';
import dashboardComponent from '../ComponentsEx/dashboard'
import schoolDetails from '../ComponentsEx/schoolDetails'
import classDetails from '../ComponentsEx/classDetails'
import results from '../ComponentsEx/results'
import tests from '../ComponentsEx/testDetails'
import testDetails from '../ComponentsEx/test'
import Profile from '../ComponentsEx/profile'
import Verification from '../ComponentsEx/verification.js'




class exHomeComponent extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: true
        }
    }

    render() {



        if (localStorage.getItem("user") == null) {
            console.log('null')
            return <Redirect to="/executivelogin" />
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
                                <Route exact path="/executive/" component={dashboardComponent} />
                                <Route exact path="/executive/:id" component={schoolDetails} key={this.props.match.params.id} />
                                <Route exact path="/executive/:id/profile" component={Profile} />
                                <Route exact path="/executive/:id/verification" component={Verification} />


                                {/* <Route exact path="/home/:id" render={(props) => (
                            <schoolDetails key={props.match.params.id} {...props} />)
                            } /> */}
                                <Route exact path="/executive/:id/tests" component={tests} />
                                <Route exact path="/executive/:id/:id" component={classDetails} />
                                <Route exact path="/executive/:id/:id/result" component={results} />
                                <Route exact path="/executive/:id/test/details" component={testDetails} />


                            </Switch>


                        </div>
                        <div></div>
                    </div>
                </Router>
            </React.Fragment>
        );
    }
}

export default exHomeComponent;