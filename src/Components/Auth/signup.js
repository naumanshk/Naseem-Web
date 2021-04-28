import React, { Component} from 'react';
import '../../App.css';
import '../../config'; 
import* as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import naseemlogo from '../../Images/naseemlogo.png'
import loginImg from '../../Images/naseemloginpagelogo.png'
import { ClipLoader } from "react-spinners";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {fire} from '../../config';
import  * as firebaseui from 'firebaseui'

class signupComponent extends Component {
    constructor(){
        super();
        this.state = {
            verified:true,
            user: null,
            name: '',
            email: '',
            password: '',
            verifiedPassword: '',
            code: '',
            array: [],
            uid: '',
            userExists: false,
            loading: false,
            error: '',
            gender: null,
            schoolId: ''
        }
    }

    componentDidMount(){
        this.renderFirebaseVerifications()
    }
    renderFirebaseVerifications = () =>{
        console.log("dasdhash")
        let self=this;
         var uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                console.log(authResult)
                let updated_phone=authResult.user.phoneNumber.replace("+92","0")
                console.log(updated_phone)
                self.setState({phone:updated_phone})
                self.setState({verified:false})
                console.log(self.state)
                
                // self.isVerified=true
                // Do something with the returned AuthResult.
                // Return type determines whether we continue the redirect automatically
                // or whether we leave that to developer to handle.
                return true;
                },
                signInFailure: function(error) {
                    console.log(error)
                    // Some unrecoverable error occurred during sign-in.
                    // Return a promise when error handling is completed and FirebaseUI
                    // will reset, clearing any UI. This commonly occurs for error code
                    // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
                    // occurs. Check below for more details on this.
                    return handleUIError(error);
                    },
                },
                signInOptions: [{
                    // Leave the lines as is for the providers you want to offer your users.
                    provider:firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                    defaultCountry: 'PK',
                }
                ],
                // tosUrl and privacyPolicyUrl accept either url string or a callback
                // function.
                // Terms of service url/callback.
                tosUrl:function() {
                    // self.$router.push({path:'/terms-and-conditions'})
                    // window.location.assign('/terms-and-conditions');
                },
                // Privacy policy url/callback.
                privacyPolicyUrl: function() {
                    // self.$router.push({path:'/terms-and-conditions'})
                    // window.location.assign('/terms-and-conditions');
                }
                };

                // Initialize the FirebaseUI Widget using Firebase.
                var ui =  firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());//new firebaseui.auth.AuthUI(firebase.auth());
                // The start method will wait until the DOM is loaded.
                ui.start('#firebaseui-auth-container', uiConfig);

    }
    
    
    register(){
        var uid;
        var codeVerified;
        codeVerified = false;

        if (this.state.password !== this.state.verifiedPassword){
            this.setState({error: "Passwords do not match! Try again..."})
            return;
        } else if (this.state.gender == null){
            this.setState({error: "Please select your gender!"})
            return;
        } else if (this.state.password.length < 6){
            this.setState({error: "Password should be atleast 6 charachters"})
            return;
        }

        firebase.database().ref("School").once("value").then(snapshot => {
            console.log(snapshot.val())
            snapshot.forEach(organization => {
                organization.forEach(school => {
                    if (school.val().refId == this.state.code){
                        codeVerified = true;
                        this.setState({schoolId: school.key})
                    }
                })
            })
            if(codeVerified == true){
                fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(u=>{
                    console.log(u)
                    firebase.auth().currentUser.sendEmailVerification()

                    uid = u.user.uid;
                    firebase.database().ref("Teachers").child(this.state.schoolId).child(uid).set({
                        email: this.state.email,
                        forigenKey: this.state.schoolId,
                        gendar: this.state.gender == 'male' ? 'Male' : 'Female',
                        id: u.user.uid,
                        refId: this.state.code,
                        status: false,
                        userImage: "no",
                        userName: this.state.name,
                        userType: 0,
                        verified:false


                    }).then(()=>{
                        this.props.history.push('/teacherlogin')
                    })
                }).catch(error => {
                    console.log(error)
                })
                
            } else {
                this.setState({error: "Code Incorrect!"})
            }
        })

        
        
    }

    render(){
        return (
            <div>

            {this.state.verified==true &&<div style={{ backgroundColor: 'white', maxWidth: 400 , margin: 'auto', marginTop: '10vh', marginBottom: '10vh',textAlign:'center', borderRadius: 10, boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.3)'}}  id="firebaseui-auth-container"></div>}
                
            {this.state.verified==false && <div className="half-grid-t">
    
                        <div className="center naseemlogo">
                            <h1 className="grey regular login-title" style={{paddingTop: '100px'}}>Welcome To Naseem Teacher</h1>
                            <img id="naseem-main" src={loginImg} alt="logo"></img>          
        
                        </div>
        
                        <div className="center">
                            <img className="logo" src={naseemlogo} alt="logo" ></img>
                            <h1 className="grey regular" >Get Started Now</h1>
                            <div className="login-container" >
                                <ClipLoader
                                    
                                    size={25}
                                    
                                    color={"#15A73F"}
                                    loading={this.state.loading}
                                />
                                <h3 className="red">{this.state.error}</h3>
                                <div className="login-input-t flex">
                                    {/* <img className="input-icon" src={userEmailImg} alt="userimg" /> */}
                                    <input className="input"
                                        value={this.state.code}  type="text" name="code" placeholder="Enter Code"
                                        onChange={(e)=> {
                                            e.preventDefault()   ;                                 
                                            var {code} = this.state;
                                            code = e.target.value;
                                            this.setState({code})
                                        }}
                                    />
        
                                </div>
                                <div className="login-input-t flex">
                                    {/* <img className="input-icon" src={userEmailImg} alt="userimg" /> */}
                                    <input className="input"
                                        value={this.state.name}  type="text" name="name" placeholder="Enter Your Name"
                                        onChange={(e)=> {
                                            e.preventDefault()   ;                                 
                                            var {name} = this.state;
                                            name = e.target.value;
                                            this.setState({name})
                                        }}
                                    />
        
                                </div>
                                <div className="login-input-t flex">
                                    {/* <img className="input-icon" src={userEmailImg} alt="userimg" /> */}
                                    <input className="input"
                                        value={this.state.email}  type="email" name="email" placeholder="Enter Email"
                                        onChange={(e)=> {
                                            e.preventDefault()   ;                                 
                                            var {email} = this.state;
                                            email = e.target.value;
                                            this.setState({email})
                                        }}
                                    />
        
                                </div>
                                <div className="login-input-t flex">
                                {/* <img className="input-icon" src={lock} alt="lock" /> */}
                                    <input className="input"
                                        value={this.state.password} type="password" name="password" placeholder="Enter Password"
                                        onChange={(e)=> {
                                            e.preventDefault();
                                            var {password} = this.state;
                                            password = e.target.value;
                                            this.setState({password})
                                        }}
                                    />
        
                                </div>
                                <div className="login-input-t flex">
                                {/* <img className="input-icon" src={lock} alt="lock" /> */}
                                    <input className="input"
                                        value={this.state.verifiedPassword} type="password" name="passwordverify" placeholder="Confirm Password"
                                        onChange={(e)=> {
                                            e.preventDefault();
                                            var {verifiedPassword} = this.state;
                                            verifiedPassword = e.target.value;
                                            this.setState({verifiedPassword})
                                        }}
                                    />
        
                                </div>
                                <div>
                                <FormControl component="fieldset" >
                                    
                                    <RadioGroup aria-label="gender" name="gender1" value={this.state.gender} onChange={(e) => {
                                        this.setState({gender: e.target.value})
                                        console.log(e.target.value)
                                    }}>
                                        <div className="flex">
                                        <FormLabel style={{marginTop: '12px', marginRight: '20px'}} component="legend">Select Gender</FormLabel>
                                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                                        <FormControlLabel value="female" control={<Radio />} label="Female" />
                                        

                                        </div>
                                    </RadioGroup>
                                </FormControl>

                                </div>

                                
                                
                                
                                
                                
                                <button className="login-btn-t" onClick={()=> {this.register()}} >REGISTER</button>

                                <p style={{paddingTop: '20px'}} >Already Have An Account? <Link to='/teacherlogin'>Login</Link></p>
                            </div>
                            
        
                        </div>
        
                        
                        
                     
                    </div>}
                    </div>
          );

    }
  
}

export default signupComponent;