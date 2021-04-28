import React, { Component} from 'react';
import '../AppEx.css';
import '../../config'; 
import* as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import naseemlogo from '../../ImagesEx/naseemlogo.png'
import loginImg from '../../Images/executive@2x.png'
import userEmailImg from '../../ImagesEx/useremail.png'
import lock from '../../ImagesEx/lock.png'
import { ClipLoader } from "react-spinners";
import {fire} from '../../config'
class loginExComponent extends Component {
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

        

            firebase.database().ref("Organization").once("value").then(snapShot => {
                snapShot.forEach(item => {
                    this.state.array.push(item.val());
                });
    
                console.log(this.state.array)
                this.state.array.map((user) => {
                    if (user.id == this.state.uid){
                        this.setState({userExists:true});
                        localStorage.setItem("user",  user.organizationName)
                        localStorage.setItem("organizationId",  user.id)
                        localStorage.setItem("email",  user.email)


                    }
                })
    
                if(this.state.userExists === true){
                    console.log('user exists - logged in!')
                    window.location.reload();
                    
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
        
        if (localStorage.getItem("user") != null) {
            
            return <Redirect to="/executive/"/>;
        } else {
            
            
        }

        return (
            
            <div className="half-grid">
                <div className="center">
                    <a href="/"><img className="logo" src={naseemlogo} alt="logo" ></img></a>
                    <h1 className="green bold" >NASEEM EXECUTIVE</h1>
                    <div className="login-container" >
                        <ClipLoader
                            
                            size={25}
                            //size={"150px"} this also works
                            color={"#15A73F"}
                            loading={this.state.loading}
                        />
                        <h3 className="red">{this.state.error}</h3>
                        <div className="login-input flex">
                            <img className="input-icon" src={userEmailImg} alt="userimg" />
                            <input className="input-ex"
                                value={this.state.email}  type="email" name="email" placeholder="Enter Your Email"
                                onChange={(e)=> {
                                    e.preventDefault()   ;                                 
                                    var {email} = this.state;
                                    email = e.target.value;
                                    this.setState({email})
                                }}
                            />

                        </div>
                        <div className="login-input flex">
                        <img className="input-icon" src={lock} alt="lock" />
                            <input className="input-ex"
                                value={this.state.password} type="password" name="password" placeholder="Enter Your Password"
                                onChange={(e)=> {
                                    e.preventDefault();
                                    var {password} = this.state;
                                    password = e.target.value;
                                    this.setState({password})
                                }}
                            />

                        </div>
                        <button className="login-btn-ex" onClick={()=> {this.verify()}} >LOGIN</button>
                    </div>
                    

                </div>

                <div className="center naseemlogo">
                    
                    <img id="naseem-main" src={loginImg} alt="logo"></img>   
                    <h1 className="green bold" >Welcome to Naseem Education</h1>
    

                </div>
                
             
            </div>
          );

    }
}

export default loginExComponent;