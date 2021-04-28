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

import studentImg from '../ImagePrinci/student-box-icon.png'
import studentimg from '../ImagesEx/employee@2x.png'
import book from '../ImagePrinci/reading-book.png'

import classIcon from '../ImagePrinci/class-box-icon.png'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";

import testImg from '../Images/test.png'
import fire from '../config';
// import announcementImg from '../Images/announcement.png'
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

class testDetails extends Component {
    constructor() {
        super()
        this.state = {
            className:"",
            classId:"",
            Tests:[]
        }
    }

    componentDidMount() {
        const { className, classId } = this.props.location.state;
        this.setState({ className: className, classId: classId });
        this.getTests()
    }



    getTests() {
        let { Tests } = this.state;

        Tests = []
        firebase.database().ref("Teacher_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == this.state.classId) {
                    Class.forEach(teacher => {
                     
                            teacher.forEach(test => {
                                Tests.push(test.val())
                            })
                        
                    })
                }

                console.log(Tests)
                this.setState({ Tests })

            })
        })
    }

    // getTests() {
    //     let { Tests } = this.state;
    //     let { content } = this.state;
    //     Tests = []
    //     firebase.database().ref("Student_Test").once("value").then(snapshot => {
    //         snapshot.forEach(Class => {
    //             if (Class.key == this.state.classId) {
    //                 Class.forEach(student => {

    //                     student.forEach(parent => {
    //                         parent.forEach(test => {
                                
    //                                 Tests.push(test.val())

                                

    //                         })
    //                     })

    //                 })
    //             }
    //             this.setState({ Tests })
    //             console.log(Tests)

    //         })
    //     })
    // }

    render() {
       

        return (
            <div className="dashboard-principal">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                        {/* <h1 className="center header-main-p">Welcome To Your Dashboard</h1> */}
                        <img src={principalHeader} className="header-img-p "></img>
                        {/* <div style={{ height: '98%', width: '100%' }} class='gradiant-p absolute no-margin'></div> */}
                    </div>



                    {/* <div style={{ marginTop: '40px' }} className="justify-center flex flex-responsive padding-sides-20 margin-bottom-10 width-100 margin-auto" >


                        <div className="class-box-purple" >
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Total Fees </h2>

                            <img src={teachericon} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Rs. {this.state.totalFee} </h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div>

                        <div className="class-box-purple" >
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Remaining</h2>

                            <img src={classIcon} className="class-icon-p" />

                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Rs.{this.state.remainingFee} </h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div>





                        <div className="class-box-purple">
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">Month </h2>

                            <img src={studentImg} className="class-icon-p" />
                            <h2 style={{ marginBottom: 0, textAlign: 'center' }} className="regular">{new Date().toString().slice(3, 7)} </h2>
                            <p style={{ margin: 0 }} className="regular"></p>


                        </div>





                    </div> */}

                    <div className='container flex justify-center'>


                        {/* list of classes */}
                        <div className="section-container-p width-80 width-100" >
                            <h2 class='center purple relative'>Class Work </h2>


                            <hr></hr>
                        

                            <div class='student-attendance-container-p'>
                            {this.state.Tests.slice(0).reverse().map(test => {
                                    return (


                                        <div className="test-box" >
                                            <Link to={{
                                                pathname: '/principal/test/details',
                                                state: {
                                                    test: test,
                                                    classId: this.state.classId,
                                                    className:this.state.className

                                                }

                                            }}>
                                                <div className="test-box-header purple" >
                                                    <img src={testImg} className="test-icon"></img>
                                                    <h5 className="no-margin-padding">{test.title}</h5>
                                                    <h5 className="no-margin-padding">Subject: {test.subjectName}</h5>
                                                    <h5 className="no-margin-padding">Date: {test.date.slice(0, 10)}</h5>


                                                </div>
                                                <hr />
                                                <div className="test-box-body" >
                                                    <div style={{ width: '100%', textAlign: 'center', borderRight: '1px solid black', padding: '10px', color: "#6437A1" }}>
                                                        <h5 className="no-margin-padding">M.C.Qs</h5>
                                                        <h5 className="no-margin-padding">{test.multiChoiceList != undefined ? test.multiChoiceList.length : ''}</h5>
                                                    </div>
                                                    <div style={{ width: '100%', textAlign: 'center', borderRight: '1px solid black', padding: '10px', color: "#6437A1" }}>
                                                        <h5 className="no-margin-padding">Short Questions</h5>
                                                        <h5 className="no-margin-padding">{test.shortsList != undefined ? test.shortsList.length : ''}</h5>

                                                    </div>
                                                    <div style={{ width: '100%', textAlign: 'center', padding: '10px', color: "#6437A1" }}>
                                                        <h5 className="no-margin-padding">Content Questions</h5>
                                                        <h5 className="no-margin-padding"></h5>

                                                    </div>

                                                </div>
                                                <hr />
                                                <div className="test-box-footer" style={{ color: "#6437A1" }}>
                                                    <h5 className="no-margin-padding">Marks: {test.totalMarks}</h5>
                                                    <h5 className="no-margin-padding">Duration: {test.testDuration}</h5>
                                                    <h5 className="no-margin-padding">Type: {test.classWorkTpye}</h5>

                                                </div>
                                            </Link>
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




            </div >



        )
    }
}
export default testDetails;