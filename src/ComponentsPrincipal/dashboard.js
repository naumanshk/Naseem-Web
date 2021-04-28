import React, { Component } from 'react';
import './principal.css';
import '../config';
import * as firebase from 'firebase'
import Announcements from './announcementsPrincipal'
import principalHeader from '../ImagePrinci/coverP.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { isInclusivelyBeforeDay } from 'react-dates'
import * as moment from 'moment';
import teachericon from '../ImagePrinci/teacher-box-icon.png'
import teacherpurpleicon from '../ImagePrinci/teacher-purple-icon.svg'
import Chart from './chart'
import MonthlyChart from './monthlyExpense'
import studentImg from '../ImagePrinci/student-box-icon.png'
import curriculum from '../ImagePrinci/curriculum-box-icon.png'
import feeIcon from '../ImagePrinci/fee-box-icon.png'
import testIcon from '../ImagePrinci/test-box-icon.png'
import classPurpleIcon from '../ImagePrinci/class-purple-icon.svg'

import classIcon from '../ImagePrinci/class-box-icon.png'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";

import testImg from '../Images/test.png'
import fire from '../config';
// import announcementImg from '../Images/announcement.png'
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import iconsfile from './icon_names.json'
import downloadIcon from '../ImagePrinci/download.png'
import download from 'downloadjs'
import Button from '@material-ui/core/Button';


import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

import expense_ico from '../ImagePrinci/expense.png'
import dollar from '../ImagePrinci/dollar.png'

import quantity from '../ImagePrinci/add-objects.png'
import item_ico from '../ImagePrinci/itemName.png'
import { v4 as uuidv4 } from 'uuid';
const uniqid = require('uniqid');

class dashboardPrincipalComponent extends Component {
    constructor() {
        super()
        this.state = {
            teacher: '',
            teacherId: '',
            classes: [],
            students: [],
            schools: [],
            teachers: [],
            schoolId: '',
            attendance: [],
            date: moment(),
            selectedDate: moment(),
            totalstudent: 0,
            totalclasses: 0,
            totalteachers: 0,
            classId: '',
            Tests: [],
            fee: [],
            announcements: [],
            drawer: false,
            attendanceMarked: true,
            Notifications: [],
            checked: false,
            associated: [],
            organization: "",

            openform: false,
            className: '',
            refId: uniqid()

        }
    }

    componentDidMount() {
        this.getSchools();
        this.getAssociatedClasses()
        // this.getTotals()
        // this.getOrganization()
       

       
        console.log(uuidv4());
    }

    getOrganization() {
        console.log('runiing')
        firebase.database().ref("Organization").once("value").then(snapshot => {
            console.log(snapshot.val())
            snapshot.forEach(organization => {
                if (organization.val().organizationID == localStorage.getItem("user")) {
                    this.setState({ organization: organization.key })

                }
            })

            // this.getSchools();




        })
    }

    async getSchools() {
        let { schools } = this.state;
        schools = []
        await firebase.database().ref("School").once("value").then(snapshot => {
            snapshot.forEach(organization => {
                organization.forEach(school => {
                    // console.log(school.val())
                    if (school.val().refId == localStorage.getItem("user")) {
                        console.log(school.val())
                        schools.push(school.val())
                        this.setState({ schoolId: school.key })

                        localStorage.setItem("schoolId", school.key)

                    }
                })
                // if (organization.key == this.state.organization ){
                //     organization.forEach(item => {
                //         schools.push(item.val())
                //     })
                // }      

            })
            this.setState({ schools })
            // this.getFinances();
            this.getTotals();

        })
    }







    async getTotals() {
        let { totalstudents, totalclasses, totalteachers } = this.state;

        totalstudents = 0;


        var classes = [];
        await firebase.database().ref("Classes").once("value").then(snapshot => {
            this.state.schools.forEach(school => {
                snapshot.forEach(School => {
                    if (School.key == school.id) {
                        School.forEach(section => {
                            classes.push(section.val())

                        })

                    }

                })

            })
            this.setState({ totalclasses: classes.length, classes })
            console.log("total classes" + classes.length)


            firebase.database().ref("Student").once("value").then(snapshot => {
                classes.forEach(Class => {
                    snapshot.forEach(section => {
                        if (section.key == Class.id) {
                            section.forEach(student => {
                                totalstudents = totalstudents + 1;

                            })
                        }

                    })

                })
                this.setState({ totalstudents })
                console.log("total students" + totalstudents)

            })

        })

        totalteachers = 0;
        var teachers = []
        var associated = []

        await firebase.database().ref("Teachers").once("value").then(snapshot => {
            this.state.schools.forEach(school => {
                snapshot.forEach(School => {
                    if (School.key == school.id) {
                        School.forEach(teacher => {

                            // firebase.database().ref("Assosiated_Classes").child(localStorage.getItem('schoolId')).once("value").then(ss => {


                            //     ss.forEach(teach=>{
                            //         if (teach.key == teacher.val().id) {
                            //             console.log(teach.val(),teacher.val().userName)
                            teachers.push(teacher.val())
                            totalteachers = totalteachers + 1;

                            //         }
                            //     })

                            // })


                            // totalteachers = totalteachers + 1;
                            // teachers.push(teacher.val())
                        })

                    }

                })

            })
            this.setState({ totalteachers, teachers })
            console.log("total teachers" + totalteachers)

        })


    }

    openFormpop() {
        this.setState({ openform: !this.state.openform })
    }

    addClass() {
        let childKey = firebase.database().ref("Classes").push().getKey();
        if (this.state.className == "" || this.state.refId == "") {

            this.setState({ err: true })

        }
        else {
            firebase.database().ref("Classes").child(localStorage.getItem("schoolId")).child(childKey).set({

                className: this.state.className,
                id: childKey,
                refId: this.state.refId,
                status: false,
                forigenKey: localStorage.getItem('schoolId'),
                teacherRole: 0,
                totalStudents: '',

            }).then(window.location.reload())
        }
    }

    async getAssociatedClasses() {
        var associated = []

        await firebase.database().ref("Assosiated_Classes").child(localStorage.getItem('schoolId')).once("value").then(snapshot => {
            console.log(snapshot.val())
            snapshot.forEach(teacher => {
                teacher.forEach(Section => {

                    associated.push(Section.val())

                })

            })

            this.setState({ associated: associated })

        })
    }


    render() {
        let attendance = this.state.attendance;

        return (
            <div className="dashboard-principal">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                        {/* <h1 className="center header-main-p">Welcome To Your Dashboard</h1> */}
                        <img src={principalHeader} className="header-img-p "></img>
                        {/* <div style={{ height: '98%', width: '100%' }} class='gradiant-p absolute no-margin'></div> */}
                    </div>

                    <Container>
                        <Grid container className="justify-center">
                            <Grid md={12} xs={12} lg={6}>
                                <h2 className="regular purple center">Fees Analysis</h2>
                                <div className="mychart-p">
                                    <Chart />

                                </div>
                            </Grid>

                            <Grid md={12} xs={12} lg={6}>
                                <h2 className="regular purple center">Expense Analysis</h2>
                                <div className="mychart-p">
                                    <MonthlyChart />

                                </div>
                            </Grid>

                        </Grid>



                    </Container>


                    <div style={{ marginTop: '40px' }} className="justify-center flex flex-responsive padding-sides-20 margin-bottom-10 width-100 margin-auto" >


                        <div className="class-box-purple" >
                            <img src={teachericon} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Teacher {this.state.totalteachers}</h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div>

                        <div className="class-box-purple" >
                            <img src={classIcon} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Classes {this.state.totalclasses}</h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div>


                        {/* <div className="class-box-purple" >
                            <img src={curriculum} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Curriculum</h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div> */}


                        <div className="class-box-purple">
                            <img src={studentImg} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Students {this.state.totalstudents}</h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div>

                        {/* <div className="class-box-purple" >
                            <img src={testIcon} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular"> Tests</h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div>



                        <div className="class-box-purple" >
                            <img src={feeIcon} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Fee Register</h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div> */}


                    </div>

                    <div className='mid-grid'>
                        <div className='box-container'>
                            <div className='container-header-p'> <h3 className='center white'>Teachers</h3>

                            </div>

                            {/* list of teachers */}
                            <div class='container-body'>

                                {this.state.teachers.map((item) => {


                                    return (


                                        <div className='class-box-row ' style={{ justifyContent: 'space-between' }}>
                                            <div className='justify-left'>
                                                <img className="tables-icon" src={teacherpurpleicon} alt="dash" ></img>
                                                <h2 className='purple regular' >{item.userName}</h2>

                                            </div>
                                            <h4 className='purple regular' >Associated Classes</h4>
                                            <div className='small-text-container flex-wrap'>


                                                {this.state.associated.map(Classes => {
                                                    return (
                                                        Classes.teacherId != null &&
                                                        <div >{Classes.teacherId == item.id ? <h2 className='white small-text' >{Classes.className}</h2> : ""}</div>
                                                    )
                                                })}


                                            </div>
                                        </div>

                                    )

                                })

                                }

                            </div>
                        </div>

                        {/* list of classes */}
                        <div className='box-container'>
                            <div className='container-header-p relative'> <h3 className='center  white'>Classes</h3>
                                <Icon onClick={e => {
                                    this.openFormpop()


                                }} style={{ float: 'right', cursor: 'pointer', right: '15px', top: '10px' }} className="fa fa-plus-circle absolute" />
                            </div>

                            <div class='container-body'>

                                {this.state.classes.map((item) => {

                                    return (
                                        <div style={{ width: '100%' }}>




                                            <div className='class-box-row ' style={{ justifyContent: 'space-between' }}>

                                                <div className='justify-left'>
                                                    <img className="tables-icon" src={classPurpleIcon} alt="dash" ></img>
                                                    <div>
                                                        <h2 className='purple regular' >{item.className}</h2>
                                                        <p className='purple regular' >{item.refId}</p>
                                                    </div>
                                                </div>

                                                <div className='small-text-container flex-wrap'>

                                                    <Link to={{

                                                        pathname: `/principal/${item.className}`,
                                                        state: {
                                                            className: item.className,
                                                            classId: item.id,

                                                        }
                                                    }} ><h2 className='white small-text' >View Attendance</h2>
                                                    </Link >

                                                    <Link to={{

                                                        pathname: `/principal/${item.id}/fees`,
                                                        state: {
                                                            className: item.className,
                                                            classId: item.id,

                                                        }
                                                    }}>
                                                        <h2 className='white small-text' >View Fees</h2>
                                                    </Link>
                                                    <Link to={{

                                                        pathname: `/principal/${item.id}/tests`,
                                                        state: {
                                                            className: item.className,
                                                            classId: item.id,

                                                        }
                                                    }}>

                                                        <h2 className='white small-text' >View Tests</h2>
                                                    </Link>

                                                    <Link to={{

                                                        pathname: `/principal/${item.id}/promotion`,
                                                        state: {
                                                            className: item.className,
                                                            classId: item.id,

                                                        }
                                                    }}>

                                                        <h2 className='white small-text' >Yearly Progress</h2>
                                                    </Link>



                                                </div>

                                            </div>

                                        </div>
                                    )

                                })

                                }


                                {/* Dialog box form entery */}

                                <Dialog className="dialog" fullWidth="true" open={this.state.openform} onClose={() => {
                                    this.openFormpop()
                                    this.setState({ err: false })

                                }} aria-labelledby="form-dialog-title">

                                    <DialogTitle className="center purple" id="form-dialog-title">Add Class</DialogTitle>

                                    <DialogContent>

                                        <div class='width-80 margin-auto margin-bottom-10'>

                                            {this.state.err && <h3 className="red">Please fill all the fields to continue!</h3>}

                                            <InputLabel htmlFor="input-with-icon-adornment">Class Name</InputLabel>
                                            <Input

                                                style={{ width: '100%' }}
                                                onChange={e => { this.setState({ className: e.target.value }) }}
                                                id="input-with-icon-adornment"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        {/* <img src={item_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img> */}

                                                    </InputAdornment>
                                                }
                                            />

                                        </div>

                                        <div class='width-80 margin-auto margin-bottom-10'>


                                            <InputLabel htmlFor="input-with-icon-adornment">Reference ID</InputLabel>
                                            <Input

                                                style={{ width: '100%' }}
                                                type='text'
                                                value={this.state.refId}
                                                disabled
                                                // onChange={e => { this.setState({ refId: e.target.value }) }}
                                                id="input-with-icon-adornment"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        {/* <img src={dollar} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img> */}

                                                    </InputAdornment>
                                                }
                                            />

                                        </div>


                                    </DialogContent>
                                    <DialogActions className="width-80 margin-auto">
                                        <Button style={{ color: 'red' }} className='purple' onClick={e => this.setState({ openform: false, err: false })} >
                                            Cancel
                            </Button>
                                        <Button onClick={e => this.addClass()} >
                                            Add
                            </Button>

                                    </DialogActions>
                                </Dialog>

                                {/* Diaolog box form entery ends */}


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




            </div>



        )
    }
}
export default dashboardPrincipalComponent;