import React, { Component } from 'react';
import './principal.css';
import '../config';
import * as firebase from 'firebase'
import 'firebase/storage';
import storage from '../config'
import Announcements from './announcementsPrincipal'
import principalHeader from '../ImagePrinci/coverP.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { isInclusivelyBeforeDay } from 'react-dates'
import MonthYearPicker from 'react-month-year-picker';
import * as moment from 'moment';

import book from '../ImagePrinci/reading-book.png'
import announce from '../Images/announcement.png'


import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import DateTimePicker from 'react-datetime-picker';

import Icon from '@material-ui/core/Icon';
import iconsfile from './icon_names.json'

import class_ico from '../ImagePrinci/class.png'
import user_ico from '../ImagePrinci/username.png'

import paper from '../ImagePrinci/show result.png'



class announcements extends Component {
    constructor() {
        super()
        this.state = {
            announcements: [],
            date: new Date(),
            time: new Date(),
            selectedDate: '',
            selectedAudiance: "",
            principalName: "",
            title: "",
            description: "",
            principalId: '',
            image: '',
            imgURL: '',
            uploaded: "",
            err:false
        }
    }

    componentDidMount() {
        this.setState({ principalId: localStorage.getItem('principalId') })
        this.getAnnouncement()
        this.getSelectedDate()
        console.log(this.state.time.toLocaleTimeString())
    }



    handleDialog() {
        this.setState({ Open: !this.state.Open })

    }
    openFormpop() {
        this.setState({ openform: !this.state.openform })
    }

    getSelectedDate() {
        let { selectedDate } = this.state;
        let { date } = this.state;
        // date = date._d;

        var day = new Date(date).getDate();
        var month = new Date(date).getMonth() + 1;
        var year = new Date(date).getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        selectedDate = day + '-' + month + '-' + year;

        this.setState({ selectedDate })
        console.log(selectedDate.toString().slice(6, 10))


    }

    fileUpload() {
        let { image } = this.state;
        const upload = storage.ref(image.name).put(image);
        upload.on('state_changed',
            (snapshot) => {

            },
            (error) => {
                console.log(error);
            },
            () => {
                storage.ref(image.name).getDownloadURL().then(url => {
                    console.log(url);
                    this.setState({ imgURL: url });
                    this.setState({ uploaded: "Uploaded" })
                })
            });
    }

    getAnnouncement() {
        let { announcements } = this.state;
        announcements = []
        firebase.database().ref("Announcements").child("PrincipalAnnouncement").child(localStorage.getItem('schoolId')).once("value").then(snapshot => {
            snapshot.forEach(announcement => {
                if (announcement.val().teacherid == localStorage.getItem('principalId')) {
                    announcements.push(announcement.val())
                }
            })

            this.setState({ announcements })

        })

    }

    addAnnouncement() {
        let childKey = firebase.database().ref("Announcements").child("PrincipalAnnouncement").push().getKey();
        console.log(childKey)

        var contentList = [
            {
                fileName: this.state.image.name,
                fileSize: "",
                fileType: this.state.image.type,
                fileUri: this.state.imgURL
            }
        ]

        if(this.state.selectedAudiance=="" ||this.state.selectedDate=="" ||this.state.description=="" ||this.state.title==""||this.state.principalName==""){
            this.setState({err:true})
        }else{

        if (this.state.image != '' && this.state.imgURL != '') {
            firebase.database().ref("Announcements").child("PrincipalAnnouncement").child(localStorage.getItem('schoolId')).child(childKey).set({
                annoucementfor: this.state.selectedAudiance,
                announcDate: this.state.selectedDate,
                announcTime: this.state.time.toLocaleTimeString(),
                announDescription: this.state.description,
                announTitle: this.state.title,
                contentList: contentList,
                id: childKey,
                teacherid: this.state.principalId,
                teacherName: this.state.principalName
            }).then(window.location.reload())
        } else {
            firebase.database().ref("Announcements").child("PrincipalAnnouncement").child(localStorage.getItem('schoolId')).child(childKey).set({
                annoucementfor: this.state.selectedAudiance,
                announcDate: this.state.selectedDate,
                announcTime: this.state.time.toLocaleTimeString(),
                announDescription: this.state.description,
                announTitle: this.state.title,

                id: childKey,
                teacherid: this.state.principalId,
                teacherName: this.state.principalName
            }).then(window.location.reload())
        }
    }
    }


    render() {


        return (
            <div className="dashboard-principal">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                        {/* <h1 className="center header-main-p">Welcome To Your Dashboard</h1>
                        <img src={principalHeader} className="header-img-p "></img>
                        <div style={{ height: '98%', width: '100%' }} class='gradiant-p absolute no-margin'></div> */}
                            <img src={principalHeader} className="header-img-p "></img>
                    </div>



                    <div style={{ marginTop: '40px' }} className="justify-center flex flex-responsive padding-sides-20 margin-bottom-10 width-100 margin-auto" >

                        {/* months panel */}


                    </div>

                    <div className='container flex justify-center'>


                        {/* list of classes */}
                        <div className="section-container-p width-80 width-100" >

                            <h2 class='center purple relative' >Announcement
                            <Icon onClick={e => {
                                    this.openFormpop()

                                }} style={{ float: 'right', cursor: 'pointer', right: '15px' }} className="fa fa-plus-circle absolute purple" />
                            </h2>




                            <hr></hr>

                            <div className="inventory-values">
                                <h2 className="regular">{this.state.expenditureEmpty}</h2>

                                {this.state.announcements.map((item) => {

                                    return (



                                        <div className="announcement-item-p purple">
                                            <div className="justify-center flex no-margin-padding">
                                                {item.contentList != undefined ? item.contentList.map(img => {
                                                    return (
                                                        <img src={img.fileUri} className="announcement-img" style={{ marginTop: '10px' }}></img>
                                                    )
                                                }) : <img src={announce} className="announcement-img" style={{ marginTop: '10px' }}></img>}
                                                <h3 className="center regular" >{item.announcTitle}</h3>

                                            </div>

                                            <h3 className=" center regular" >{item.announDescription}</h3>
                                            <h3 className=" center regular" >{item.announcDate} {item.announcTime}</h3>
                                            <h3 className=" center regular" >{item.annoucementfor}</h3>
                                            {/* {item.receipturi && <h3>Get Receipt</h3> } */}

                                        </div>
                                    )
                                })

                                }


                            </div>
                        </div>
                    </div>



                    <div className="announcement-div">
                        <Announcements school={this.state.Notifications} />
                        <Drawer anchor="right" open={this.state.drawer} onClose={() => { this.setState({ drawer: false }) }} >
                            <Announcements school={this.state.Notifications} />
                        </Drawer>

                    </div>


                </div>


                {/* Dialog box form entery */}

                <Dialog className="dialog" fullWidth="true" open={this.state.openform} onClose={() => {
                    this.openFormpop()
                    this.setState({ iconName: "ic_inventory_stockdefault" ,err:false})

                }} aria-labelledby="form-dialog-title">

                    <img src={book} style={{ alignSelf: 'center', marginTop: '20px', backgroundColor: 'unset' }} className="icon" ></img>
                    <DialogTitle className="center purple" id="form-dialog-title">Add Announcement</DialogTitle>

                    <DialogContent>

                        <div class='width-80 margin-auto margin-bottom-10'>

                             {this.state.err && <h3 className="red">Please fill all the fields to continue!</h3>}
                            <InputLabel htmlFor="input-with-icon-adornment">Principal Name</InputLabel>
                            <Input

                                style={{ width: '100%' }}
                                onChange={e => { this.setState({ principalName: e.target.value }) }}
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <img src={user_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                    </InputAdornment>
                                }
                            />

                        </div>
                        <div class='width-80 margin-auto margin-bottom-10'>


                            <InputLabel htmlFor="input-with-icon-adornment">Title</InputLabel>
                            <Input

                                style={{ width: '100%' }}
                                onChange={e => { this.setState({ title: e.target.value }) }}
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <img src={paper} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                    </InputAdornment>
                                }
                            />

                        </div>
                        <div class='width-80 margin-auto margin-bottom-10'>


                            <InputLabel htmlFor="input-with-icon-adornment">Description</InputLabel>
                            <Input

                                style={{ width: '100%' }}
                                onChange={e => { this.setState({ description: e.target.value }) }}
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <img src={class_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                    </InputAdornment>
                                }
                            />

                        </div>
                        <div class='width-80 margin-auto margin-bottom-10'>


                            <InputLabel htmlFor="input-with-icon-adornment">Select Audiance</InputLabel>
                            <Select
                                startAdornment={
                                    <InputAdornment position="start">
                                        <img src={user_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                    </InputAdornment>
                                }
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                fullWidth
                                onChange={e => {
                                    this.setState({ selectedAudiance: e.target.value })

                                }}

                            >
                                <MenuItem value='Teachers'>Teacher</MenuItem>
                                <MenuItem value='Students'>Students</MenuItem>
                                <MenuItem value='Both'>Both</MenuItem>



                            </Select>

                        </div>

                        <div class='width-80 margin-auto margin-bottom-10'>
                            <DateTimePicker
                              

                                onChange={e => {
                                    this.setState({ time: e, date: new Date(e) }, () => this.getSelectedDate())

                                }}
                                value={new Date(this.state.time)}
                                className="custom-cal-p"

                            />
                        </div>

                        <div class='width-80 margin-auto margin-bottom-10'>
                            <input class="upload-img" style={{ height: '30px' }} type="file" onChange={(e) => {
                                var { image } = this.state;
                                image = e.target.files[0]
                                this.setState({ image })
                                console.log(image)
                            }}></input>
                            <p>{this.state.uploaded}</p>

                            <button style={{ background: "#6437A1" }} className="content-btn" onClick={() => { this.fileUpload() }}>Upload</button>
                        </div>




                    </DialogContent>

                    <DialogActions className="width-80 margin-auto">
                        <Button onClick={e => this.setState({ openform: false, addExpenditure: false, iconName: "ic_inventory_stockdefault"  ,err:false})} color="#6437A1 ">
                            Cancel
                            </Button>
                        <Button onClick={e => this.addAnnouncement()} color="#6437A1 ">
                            Add
                            </Button>

                    </DialogActions>
                </Dialog>

                {/* Diaolog box form entery ends */}




            </div >



        )
    }
}
export default announcements;