import React, { Component} from 'react';
import '../AppStudent.css';
import '../../config'; 
import {fire} from '../../config'
import* as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import naseemlogo from '../../Images/naseemlogo.png'
import loginImg from '../../ImagesStudent/student-main.png'

import { ClipLoader } from "react-spinners";


class loginStudentComponent extends Component {
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
            console.log(u)
            var uid = u.user.uid;
            this.setState({uid: uid});
            console.log(uid);

            firebase.database().ref("Student").once("value").then(snapShot => {
                snapShot.forEach( section => {
                    section.forEach(student => {
                        // this.state.array.push(student.val());
                        if (student.val().id == this.state.uid){
                            // if (student.val().verified) {
                            this.setState({userExists:true});
                            localStorage.setItem("Student",  student.val().userName)
                            localStorage.setItem("studentId", student.val().id)
                            localStorage.setItem("classId", section.key )
                            localStorage.setItem("email", this.state.email)
                            localStorage.setItem("Profile", student.val().profileImg)


                            this.setState({loading: false})
                            // }
                        }
                    })
                    
                });
    
                // console.log(this.state.array)
                // this.state.array.map((user) => {
                //     if (user.id == this.state.uid){
                //         this.setState({userExists:true});
                //         localStorage.setItem("Student",  user.userName)
                //         localStorage.setItem("studentId", user.id)
                //         this.setState({loading: false})
                //     }
                // })
    
                if(this.state.userExists === true){
                    console.log('user exists - logged in!')
                    window.location.reload();
                    
                } else {
                    fire.auth().signOut();
                    console.log('user does not exist - logged out!')
                    this.setState({loading: false})
                    this.setState({error: 'You Are Not Authorized!'})
                    localStorage.removeItem("Student")
                    localStorage.removeItem("studentId")
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
        
        if (localStorage.getItem("Student") != null) {
            
            return <Redirect to="/student/"/>;
        } else {
            
            
        }

        return (
            
            <div className="half-grid-t">

                <div className="center studentlogo">
                    <h1 className="student-grey regular login-title" style={{paddingTop: '80px'}}>Welcome To Naseem Student</h1>
                    <img id="student-main" src={loginImg} alt="logo"></img>          

                </div>

                <div className="center">
                    <a href="/"><img className="logo" src={naseemlogo} alt="logo" ></img></a>
                    <h1 className="student-grey regular" >Get Started Now</h1>
                    <div className="login-container" >
                        <ClipLoader
                            
                            size={25}
                            
                            color={"#0E7886"}
                            loading={this.state.loading}
                        />
                        <h3 className="red">{this.state.error}</h3>
                        <div className="login-input-s flex">
                            {/* <img className="input-icon" src={userEmailImg} alt="userimg" /> */}
                            <input className="input-s"
                                value={this.state.email}  type="email" name="email" placeholder="Enter Your Email"
                                onChange={(e)=> {
                                    e.preventDefault()   ;                                 
                                    var {email} = this.state;
                                    email = e.target.value;
                                    this.setState({email})
                                }}
                            />

                        </div>
                        <div className="login-input-s flex">
                        {/* <img className="input-icon" src={lock} alt="lock" /> */}
                            <input className="input-s"
                                value={this.state.password} type="password" name="password" placeholder="Enter Your Password"
                                onChange={(e)=> {
                                    e.preventDefault();
                                    var {password} = this.state;
                                    password = e.target.value;
                                    this.setState({password})
                                }}
                            />

                        </div>
                        <Link to='/studentsignup'>
                        <p style={{paddingTop: '20px'}} >Register Now</p>
                        </Link>
                        
                        <button className="login-btn-s" onClick={()=> {this.verify()}} >LOGIN</button>
                    </div>
                    

                </div>

                
                
             
            </div>
          );

    }
}

export default loginStudentComponent;