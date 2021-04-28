import React, { Component} from 'react';
import '../../App.css';
import '../../config'; 
import {fire} from '../../config'
import* as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import naseemlogo from '../../Images/naseemlogo.png'
import loginImg from '../../Images/naseemloginpagelogo.png'
// import userEmailImg from '../../Images/useremail.png'
// import lock from '../../Images/lock.png'
import { ClipLoader } from "react-spinners";


class loginComponent extends Component {
    constructor(){
        super();
        this.state = {
            user: null,
            email: '',
            password: '',
            array: [],
            uid: '',
            userExists: false,
            loading: false,
            error: ''
        }
    }

    verify(e){
        this.setState({loading: true})
        this.setState({error: ''})
        
        console.log(this.state.email + this.state.password)
        
        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u)=>{
            // if(u.user.emailVerified==false){
            //     firebase.auth().currentUser.sendEmailVerification()
            //     this.setState({error: 'Verify your email before logging in we have sent you an email address on your registered email'})
            //     this.setState({loading: false})

            //     return 

            // }
            var uid = u.user.uid;
            this.setState({uid: uid});
            console.log(uid);

            firebase.database().ref("Teachers").once("value").then(snapShot => {
                snapShot.forEach( school => {
                    school.forEach(teacher => {
                        this.state.array.push(teacher.val());
                    })
                    
                });
    
                console.log(this.state.array)
                this.state.array.map((user) => {
                    if (user.id == this.state.uid){
                        // if (user.verified) {
                        this.setState({userExists:true});
                        localStorage.setItem("Teacher",  user.userName)
                        localStorage.setItem("Profile",  user.profileImg)

                        localStorage.setItem("teacherId", user.id)
                        localStorage.setItem("email",this.state.email)

                        this.setState({loading: false})
                        // }
                    }

                })
    
                if(this.state.userExists === true){
                    console.log('user exists - logged in!')
                    // window.location.reload();
                    
                } else {
                    fire.auth().signOut();
                    console.log('user does not exist - logged out!')
                    this.setState({loading: false})
                    this.setState({error: 'You Are Not Authorized!'})
                }
            })

            
        }).catch((error)=>{
            console.log('wr')
            if (error){
                this.setState({loading: false})
                this.setState({error: 'Password or Email Incorrect'})
            }
        })
    }

    render(){
        
        if (localStorage.getItem("Teacher") != null) {
            
            return <Redirect to="/teacher/"/>;
        } else {
            
            
        }

        return (
            
            <div className="half-grid-t">

                <div className="center naseemlogo">
                    <h1 className="grey regular login-title" style={{paddingTop: '100px'}}>Welcome To Naseem Teacher</h1>
                    <img style={{marginTop:'10vh'}} id="naseem-main" src={loginImg} alt="logo"></img>          

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
                                value={this.state.email}  type="email" name="email" placeholder="Enter Your Email"
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
                                value={this.state.password} type="password" name="password" placeholder="Enter Your Password"
                                onChange={(e)=> {
                                    e.preventDefault();
                                    var {password} = this.state;
                                    password = e.target.value;
                                    this.setState({password})
                                }}
                            />

                        </div>
                        <Link to='/teachersignup'>
                        <p style={{paddingTop: '20px'}} >Register Now</p>
                        </Link>
                        
                        <button className="login-btn-t" onClick={()=> {this.verify()}} >LOGIN</button>
                    </div>
                    

                </div>

                
                
             
            </div>
          );

    }
}

export default loginComponent;