import React, { Component } from 'react';
import '../principal.css'
import '../../config';
import { fire } from '../../config'
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import naseemlogo from '../../ImagePrinci/naseemlogo.png'
import loginImg from '../../Images/naseemloginpagelogo.png'
// import userEmailImg from '../../Images/useremail.png'
// import lock from '../../Images/lock.png'
import { ClipLoader } from "react-spinners";
import illustration from '../../ImagePrinci/princi_illus.png'

class loginPrincipalComponent extends Component {
    constructor() {
        super();
        this.state = {
            user: null,
            email: '',
            password: '',
            array: [],
            uid: '',
            userExists: false,
            loading: false,
            error: '',
            verifiedUser: false
        }
    }

    verify(e) {
        this.setState({ loading: true })
        this.setState({ error: '' })

        console.log(this.state.email + this.state.password)

        fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
            // if(u.user.emailVerified==false){
            //     firebase.auth().currentUser.sendEmailVerification()
            //     this.setState({error: 'Verify your email before logging in we have sent you an email address on your registered email'})
            //     this.setState({loading: false})

            //     return 

            // }
            var uid = u.user.uid;
            this.setState({ uid: uid });
            console.log(uid);

            firebase.database().ref("Principal").once("value").then(snapShot => {
                snapShot.forEach(school => {
                    school.forEach(principal => {
                        this.state.array.push(principal.val());
                    })

                });

                console.log(this.state.array)
                this.state.array.map((user) => {
                    if (user.id == this.state.uid) {
                        // if (user.verified) {
                            this.setState({ userExists: true });

                            this.setState({ verifiedUser: true })
                            localStorage.setItem("user", user.refId)
                            localStorage.setItem("userName", user.userName)
                            localStorage.setItem("principalId", user.id)
                            localStorage.setItem("email", this.state.email)

                            this.setState({ loading: false })
                        // }

                    }
                })

                if (this.state.userExists === true) {
                    console.log('user exists - logged in!')
                    // window.location.reload();

                } else {
                    fire.auth().signOut();
                    console.log('user does not exist - logged out!')
                    this.setState({ loading: false })
                    this.setState({ error: 'You Are Not Authorized!' })
                }
            })


        }).catch((error) => {
            console.log('wr')
            if (error) {
                this.setState({ loading: false })
                this.setState({ error: 'Password or Email Incorrect' })
            }
        })
    }

    render() {

        if (localStorage.getItem("user") != null) {

            return <Redirect to="/principal/" />;
        } else {


        }

        return (

            <div className="half-grid-t">

                <div className="center naseemlogo">
                    <div style={{ height: '60%', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', margin: 'auto' }} class=''>
                        <img className="illustration" src={illustration} alt="logo" ></img>

                        <h1 className="text-center bold login-title purple" >Welcome To Naseem Principal</h1>

                    </div>


                </div>

                <div className="center background-principal">

                    <div class=''>

                        <img className="logo" style={{ borderRadius: '12px' }} src={naseemlogo} alt="logo" ></img>
                        <h1 className="white regular heading-white-mobile" >Get Started Now</h1>
                        <div className="login-container " >
                            <ClipLoader

                                size={25}

                                color={"white"}
                                loading={this.state.loading}
                            />
                            <h3 className="red">{this.state.error}</h3>
                            <div className="login-input-p flex">
                                {/* <img className="input-icon" src={userEmailImg} alt="userimg" /> */}
                                <input className="input-p"
                                    value={this.state.email} type="email" name="email" placeholder="Enter Your Email"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        var { email } = this.state;
                                        email = e.target.value;
                                        this.setState({ email })
                                    }}
                                />

                            </div>
                            <div className="login-input-p flex">
                                {/* <img className="input-icon" src={lock} alt="lock" /> */}
                                <input className="input-p"
                                    value={this.state.password} type="password" name="password" placeholder="Enter Your Password"
                                    onChange={(e) => {
                                        e.preventDefault();
                                        var { password } = this.state;
                                        password = e.target.value;
                                        this.setState({ password })
                                    }}
                                />

                            </div>
                            <Link to='/principalsignup'>
                                <p style={{ paddingTop: '20px ', color: 'white' }} >Register Now</p>
                            </Link>

                            <button className="login-btn-p" onClick={() => { this.verify() }} >LOGIN</button>
                        </div>

                    </div>


                </div>




            </div>
        );

    }
}

export default loginPrincipalComponent;