import React, {useEffect, useState} from 'react';
import './App.css';
import './config'; 
import* as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import loginComponent from './Components/Auth/login'
import signupComponent from './Components/Auth/signup'
import homeComponent from './Components/home'
import fire from './config';

function App() {

  const [user, setUser] = useState({})

  useEffect(() => {

  },[]);

    


  return (
    <div className="App">

        
  

       <Router>
        <Switch>
          <Route exact path="/" component={loginComponent}  />   
          <Route exact path="/login" component={loginComponent}  />     
          <Route exact path="/signup" component={signupComponent}  />  
          <Route path="/home" component={homeComponent}  />
        </Switch>
      </Router> 
     
    </div>
  );
}

export default App;
