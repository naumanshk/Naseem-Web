import React, { Component } from 'react';
// import './AppEx.css';
import '../config';
import * as firebase from 'firebase'
import studentimg from '../ImagesEx/employee@2x.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController, toISODateString } from 'react-dates';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import 'react-dates/lib/css/_datepicker.css';
import greenhex from '../ImagesEx/greenhex.png'
import bluehex from '../ImagesEx/bluehex.png'
import yellowhex from '../ImagesEx/yellowhex.png'
import commentimg from '../ImagesEx/comment.png'
import Progress from 'react-progressbar';
import path from '../ImagePrinci/Path 2.png'
import path1 from '../ImagePrinci/Group 66.png'
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Header from '../Images/teacher-profile.png'
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import profile_user from '../Images/profile-user.png'
import email from '../Images/email.png'
import gender from '../Images/gender1.png'
import degree from '../Images/policy.png'
import location from '../Images/maps.png'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import dummy from '../Images/dummy.png';
import Icon from '@material-ui/core/Icon';
import storage from '../config'


class profile extends Component {
    constructor() {
        super()
        this.state = {
            name: '',
            address: '',
            email: '',
            gender: '',
            fname: '',
            schooldRef: '',
            editable:false,
            err:false,
            image: '',
            uploaded: '',
            imgURL: '',
            profileImg:'',
            

        }
    }

    componentWillMount() {


        this.getProfile();



    }


    getProfile() {
        let { schools } = this.state;
        schools = []
        firebase.database().ref("Organization").once("value").then(snapshot => {
            snapshot.forEach(school => {
                    console.log(school.val())
                    if (school.key == localStorage.getItem("organizationId")) {
                    //    school.forEach(organization=>{
                        schools.push(school.val())
                        console.log(schools)
                        this.setState({ address: school.val().location, name: school.val().organizationName, email: school.val().email, schooldRef: school.val().organizationID,profileImg:school.val().profileImg })


                    // })
                      
                    }
            
            })
        
        })
    }

    editProfile() {

   

        if (this.state.name == ""   || this.state.schooldRef == "" || this.state.email == "" || this.state.address == "") {

            this.setState({ err: true })

        }
        else {
            firebase.database().ref("Organization").child(localStorage.getItem("organizationId")).update({



                organizationName: this.state.name,
           
                organizationID: this.state.schooldRef,
              
                email: this.state.email,
                location: this.state.address,
                profileImg:this.state.imgURL

             
            }).then(window.location.reload())
        }
    }

    fileUpload() {
        let { image } = this.state;
        const upload = storage.ref(`Profile/${localStorage.getItem('organizationId')}`).put(image);
        upload.on('state_changed',
            (snapshot) => {
                console.log('done')
            },
            (error) => {
                console.log(error);
            },
            () => {
                storage.ref(`Profile/${localStorage.getItem('organizationId')}`).getDownloadURL().then(url => {
                    console.log(url);
                    this.setState({ imgURL: url });
                    this.setState({ uploaded: "Uploaded" })
                })
            });
    }


    render() {
        return (
            <div style={{marginRight:'0px'}} className="dashboard-principal">

                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                      
                        <img src={Header} className="header-img border-rad-img"></img>

                    </div>

                    <div className='container flex justify-center'>


                        {/* list of classes */}
                        <div className="section-container-p width-40 width-100" >

                        
                        <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <img src={this.state.profileImg !=null ? this.state.profileImg : dummy} style={{marginRight:'10px', width:'50px',height:'50px', borderRadius:'50px'}} className=""></img>
                                <h2 style={{textTransform:'capitalize'}} class='center green relative' >{this.state.name}
                                </h2>
                                </div>
                                <div style={{justifyContent:'flex-end'}} className='flex'>
                               {!this.state.editable ?
                                <Button
                                style={{justifyContent:'flex-end',border:'1px solid #4CBB17', color:'#4CBB17'}}
                                    variant="outlined" size="medium" color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={e=>this.setState({editable:true})}
                                >
                                    Edit Profile
                                </Button>  
                                
                                :

                                <Button
                                    style={{justifyContent:'flex-end'}}
                                    variant="outlined" size="medium" color="secondary"
                                    startIcon={<CancelIcon />}
                                    onClick={e=>this.setState({editable:false,err:false})}
                                >
                                    Cancel
                                </Button>  
    }  
                            </div>



                            <hr></hr>

                            <div style={{ paddingTop: '40px', paddingBottom: '40px',height: 'auto' }} className="inventory-values">



                                <div class='width-80 margin-auto margin-bottom-10'>
                                    {this.state.err && <h3 className="red">Please Fill all the fileds!</h3>}

                                    <InputLabel htmlFor="input-with-icon-adornment">Name</InputLabel>
                                    <Input
                                        value={this.state.name}
                                        style={{ width: '100%' }}
                                        disabled={!this.state.editable ? true : false}
                                        id="input-with-icon-adornment"
                                        onChange={(e)=> {
                                            e.preventDefault()                                
                                            this.setState({name:e.target.value})
                                        }}
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <img src={profile_user} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                            </InputAdornment>
                                        }
                                    />

                                </div>

                                <div class='width-80 margin-auto margin-bottom-10'>
                                    {/* {this.state.err && <h3 className="red">Please Fill all the fileds!</h3>} */}

                                    <InputLabel htmlFor="input-with-icon-adornment">Email</InputLabel>
                                    <Input
                                        value={this.state.email}
                                        disabled={!this.state.editable ? true : false}

                                        style={{ width: '100%' }}
                                        onChange={(e)=> {
                                            e.preventDefault()                                
                                            this.setState({email:e.target.value})
                                        }}
                                        id="input-with-icon-adornment"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <img src={email} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                            </InputAdornment>
                                        }
                                    />

                                </div>

                               

                                <div class='width-80 margin-auto margin-bottom-10'>
                                    {/* {this.state.err && <h3 className="red">Please Fill all the fileds!</h3>} */}

                                    <InputLabel htmlFor="input-with-icon-adornment">School Reference</InputLabel>
                                    <Input

                                        style={{ width: '100%' }}
                                        value={this.state.schooldRef}
                                        disabled={!this.state.editable ? true : false}
                                        onChange={(e)=> {
                                            e.preventDefault()                                
                                            this.setState({schooldRef:e.target.value})
                                        }}
                                        id="input-with-icon-adornment"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <img src={degree} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                            </InputAdornment>
                                        }
                                    />

                                </div>


                                <div class='width-80 margin-auto margin-bottom-10'>
                                    {/* {this.state.err && <h3 className="red">Please Fill all the fileds!</h3>} */}

                                    <InputLabel htmlFor="input-with-icon-adornment">Address</InputLabel>
                                    <Input
                                        value={this.state.address}
                                        style={{ width: '100%' }}
                                        disabled={!this.state.editable ? true : false}
                                        onChange={(e)=> {
                                            e.preventDefault()                                
                                            this.setState({address:e.target.value})
                                        }}
                                        id="input-with-icon-adornment"
                                        startAdornment={
                                            <InputAdornment position="start">
                                                <img src={location} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                            </InputAdornment>
                                        }
                                    />


                                </div>

                                {this.state.editable && <div class='width-80 margin-auto margin-bottom-10'>
                                    

                            
                                    <InputLabel htmlFor="input-with-icon-adornment">Profile Image</InputLabel>
                                        <input class="upload-img" style={{ height: '30px' ,marginTop:'10px'}} 
                                        type="file" onChange={(e) => {
                                            var { image } = this.state;
                                            image = e.target.files[0]
                                            this.setState({ image })
                                            console.log(image)
                                        }}></input> 
                                        
                                        {/* backgroundImage: `url(${uploadImg})`,  */}
                                        <button   className="content-btn" onClick={() => { this.fileUpload() }}>upload</button>
                                        <p>{this.state.uploaded}</p>
                                    </div>}


                                <div class='width-80 margin-auto margin-bottom-10'>
                                    {/* {this.state.err && <h3 className="red">Please Fill all the fileds!</h3>} */}

                                   {this.state.editable && <button onClick={e=>this.editProfile()} style={{ cursor:'pointer', background: '#4CBB17', border: 'none', borderRadius: '12px', color: 'white', width: '30%', padding: '20px', font: "14px", fontWeight: 'bold' }} className='flex justify-center center'>Save</button>}

                                </div>









                            </div>
                        </div>
                    </div>
                </div></div>



        )
    }
}

export default profile;