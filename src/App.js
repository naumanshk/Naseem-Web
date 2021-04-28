import React, {useEffect, useState} from 'react';
// import './App.css';
// import './jones.css';

import './config'; 
import* as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import loginComponent from './Components/Auth/login'
import loginExComponent from './ComponentsEx/Auth/LoginEx'
import loginStudentComponent from './ComponentsStudent/Auth/loginStudent'
import loginPrincipalComponent from './ComponentsPrincipal/Auth/loginPrincipal'


import signupPrinicpalComponent from './ComponentsPrincipal/Auth/signup'
import signupComponent from './Components/Auth/signup'
import signupStudentComponent from './ComponentsStudent/Auth/signupStudent'
import teacherHomeComponent from './Components/teacherhome'
import exHomeComponent from './ComponentsEx/executiveHome'
import studentHomeComponent from './ComponentsStudent/studentHome'
import princiHomeComponent from './ComponentsPrincipal/principalHome'

import aboutComponent from './Components/about'
import terms from './Components/terms'
import fire from './config';


function App() {

  useEffect(() => {

  },[]);

    


  return (
    <div className="App">

        
  

       <Router>
        <Switch>
          <Route exact path="/" component={aboutComponent}  />   

          <Route exact path="/teacherlogin" component={loginComponent}  />  
          <Route exact path="/teachersignup" component={signupComponent}  />  
          <Route path="/teacher" component={teacherHomeComponent}  />

          <Route path="/student" component={studentHomeComponent}  />
          <Route exact path="/studentlogin" component={loginStudentComponent}  />   
          <Route exact path="/studentsignup" component={signupStudentComponent}  />              
          
          <Route path="/executive" component={exHomeComponent}  />
          <Route exact path="/executivelogin" component={loginExComponent}  /> 

          <Route path="/principal" component={princiHomeComponent}  />
          <Route exact path="/principallogin" component={loginPrincipalComponent}  />   
          <Route exact path="/principalsignup" component={signupPrinicpalComponent}  />              


          <Route path="/about" component={aboutComponent}  />
          <Route path="/terms&conditions" component={terms}  />

    
          
        </Switch>
      </Router> 
     
    </div>
  );
}

export default App;
