import React, { Component } from 'react';
import '../App.css';
import '../config';
import * as firebase from 'firebase'
import 'firebase/storage';
import storage from '../config'
import leader from '../Images/leader.png'
import createTypography from '@material-ui/core/styles/createTypography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import deleteImg from '../Images/delete.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { isInclusivelyBeforeDay } from 'react-dates'
import * as moment from 'moment';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import { Link } from '@material-ui/core';
import { isThisHour } from 'date-fns';
import uploadImg from '../Images/upload.png'
import Countdown from 'react-countdown-now';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';
import print from '../Images/print.png'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ViewArray } from '@material-ui/icons';
import { now } from 'moment';
import download from 'downloadjs'
class solveTest extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            workType: 'Test',
            subject: 'English',
            teacherName: '',
            totalMarks: '',
            date: moment(),
            time: '',
            duration: '',
            mcqs: [],
            shortQuestions: [],
            image: '',
            content: false,
            imgURL: '',
            uploaded: '',
            test: [],
            contentQuestionList: null,
            timeout: false,
            counter: 0,
            expired_time: "",
            remainingTime: null,
            contentURL: "",
            heldOn: false,
        }
        this.submit = this.submit.bind(this)
    }

    componentDidMount() {
        console.log('test' + this.props.location.state)
        let { test } = this.props.location.state;
        var check = Date.now()
        console.log("nauman" + new Date(check))
        this.setState({ test: test })
        if (test.multiChoiceList) {
            this.setState({ mcqs: test.multiChoiceList })

        }

        if (test.shortsList) {
            this.setState({ shortQuestions: test.shortsList })
        }

        if (test.contentQuestionList) {
            this.setState({ contentQuestionList: test.contentQuestionList[0], contentURL: test.contentQuestionList[0].contents[0].fileUri })
        }

        //Logic for test time counter

        var testTime = test.testTime
        var date = []
        //changing date format
        date = test.date.split("-")
        var testStart = new Date(date[2],date[1]-1,date[0])
        console.log(testStart)
      
        // console.log(dateObj)

        //Current date
        var current= new Date()
        console.log(new Date(current.setHours(0,0,0,0)).toLocaleDateString())
    

 //Logic for test time counter
     
        if (testStart > new Date().setHours(0,0,0,0)) {
            console.log("You test will helod on " + test.date + " " + test.testTime)
            this.setState({ heldOn: true })
        }
        if (testStart < new Date().setHours(0,0,0,0) ) {
            this.setState({ timeout: true })
        }

        if(testStart.toLocaleDateString()===  new Date(current.setHours(0,0,0,0)).toLocaleDateString()){
          
            var startdate = new Date(this.getDateFromHours(test.testTime));  //getting test time (starting time)
            var deadline = new Date(startdate); //converting to date Obj

            deadline.setMinutes(startdate.getMinutes() + Number(test.testDuration));
            console.log(deadline)

            //if the current time is equal or grater 
            if (new Date().toLocaleTimeString() >= test.testTime) {

                console.log("Start Test" + this.getDateFromHours(test.testTime).toLocaleTimeString())

                //checking if the test deadline is passed or the test is attempted
                if (new Date().getTime() > deadline.getTime() || test.testSolvedStatus) {
                    console.log('time expired')
                    this.setState({ timeout: true })
                } 
                else {

                    //setting counter on the ramining time to attempt test
                    if (deadline - new Date().getTime() > 0) {
                        const remaining = deadline - new Date().getTime()
                        this.setState({ heldOn: false })
                        this.setState({ remainingTime: new Date(remaining).getMinutes() })
                        console.log("remainign time" + new Date(remaining).getMinutes())
                    } else {
                        this.setState({ timeout: true })
                    }
                }
            } 
            //if the test time is greater then dont show and start the test
            else {
                console.log('your test will start at ' + test.testTime)
                this.setState({ heldOn: true })
            }
        }

        if (new Date(testTime).toLocaleString() < new Date().toLocaleString()) {

            var expired_time = new Date(testTime).getTime() + Number(test.testDuration * 60000)
            this.setState({ expired_time: new Date(expired_time).toLocaleString() })
            console.log(new Date(expired_time).getHours())
            console.log(Date.now())


            var startdate = new Date(test.testTime);
            var deadline = new Date(startdate);
            deadline.setMinutes(startdate.getMinutes() + Number(test.testDuration));
            console.log(deadline)

            if (new Date().getTime() > deadline.getTime()) {
                console.log('exoired')
                console.log(new Date().toLocaleString())
                console.log(deadline.toLocaleString())
            }
            if (new Date().getTime() > deadline.getTime() || test.testSolvedStatus) {
                console.log('time expired')
                this.setState({ timeout: true })
            } else {

                if (deadline - new Date().getTime() > 0) {
                    const remaining = deadline - new Date().getTime()

                    this.setState({ remainingTime: new Date(remaining).getMinutes() })
                    console.log("remainign time" + new Date(remaining).getMinutes())
                } else {
                    this.setState({ timeout: true })
                }
            }
        }

 //Logic for test time counter



    }

    getDateFromHours(time) {
        time = time.split(':');
        let now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), ...time);
    }

    print(id) {

        var quotes = document.getElementById(id);
        html2canvas(quotes)
            .then((canvas) => {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 295;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                var doc = new jsPDF('p', 'mm');
                var position = 10; // give some top padding to first page

                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position += heightLeft - imgHeight; // top padding for other pages
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }


                doc.save("reciept")




                window.open(doc.output('bloburl'), '_blank');
            }
            );
    }

    submit(Test) {

        var test = Test;
        test.studentName = localStorage.getItem('Student')
        test.studentId = localStorage.getItem('studentId')
        this.setState({ timeout: true })
        firebase.database().ref("Student_Test").child(localStorage.getItem("classId")).child(localStorage.getItem("studentId")).child(Test.teacherId).child(Test.id).set(test);
        console.log(test)









        this.props.history.push('/student')

    }

    render() {
        var Test = this.state.test;
        return (
            <div className="main-container" id={this.state.test.id}>
                <div className="test-header" style={{ backgroundColor: '#0E7886' }} >
                    <img className="print" src={print} onClick={this.print.bind(this, this.state.test.id)}></img>
                    <h1 className="center white">SOLVE YOUR TEST</h1>
                    <Link to="/home">
                        {!this.state.timeout && !this.state.heldOn && <button className="submit-s" onClick={() => {
                            Test.testSolvedStatus = true;
                            this.submit(Test)

                        }}>SUBMIT</button>}
                    </Link>
                    {Test.testSolvedStatus && <button className="submit-s" disabled>SUBMIT</button>}

                    <div className="flex-justify">
                        <div>
                            <div className="flex">
                                <h3 className="white ">Work Title: </h3>
                                <p className="header-input-s"  >{this.state.test.title} </p>

                            </div>
                            <div className="flex">
                                <h3 className="white">Work Type: </h3>
                                <p className="header-input-s"  >{this.state.test.classWorkTpye}</p>


                            </div>
                            <div className="flex">
                                <h3 className="white ">Subject: </h3>
                                <p className="header-input-s" >{this.state.test.subjectName} </p>


                            </div>
                            <h3 className="white ">Teacher Name: {this.state.test.teacherName}</h3>
                        </div>
                        <div>
                            <div className="flex">
                                <h3 className="white">Total Marks: </h3>
                                <p className="header-input-s">{this.state.test.totalMarks}</p>

                            </div>
                            <div className="flex">
                                <h3 className="white">Duration: </h3>
                                <p className="header-input-s">{this.state.test.testDuration}</p>

                            </div>
                            <div className="flex">
                                <h3 className="white">Date: </h3>
                                <p className="header-input-s" >{this.state.test.date}</p>



                            </div>

                            <div className="flex">
                                <h3 className="white">Submission Time: </h3>
                                <p className="header-input-s" >{this.state.expired_time}</p>



                            </div>


                        </div>




                    </div>
                    <div style={{ color: 'white', fontSize: '22px', margin: '10px', textAlign: "center" }}>
                        <h3 className="no-margin-padding">Remaining Time: </h3>
                        {this.state.heldOn && !Test.testSolvedStatus && <h3 style={{ color: "red" }} className="no-margin-padding">Your Test Will be on {Test.date}-{Test.testTime}</h3>}

                        {this.state.timeout && !Test.testSolvedStatus && <h3 style={{ color: "red" }} className="no-margin-padding">Timeout Not Submitted </h3>}
                        {this.state.timeout && Test.testSolvedStatus && <h3 style={{ color: "#29c129" }} className="no-margin-padding">Submitted </h3>}
                        {!this.state.timeout && !Test.testSolvedStatus && !this.state.heldOn && <Countdown date={Date.now() + this.state.remainingTime * 60000} onComplete={() => {
                            Test.testSolvedStatus = true;
                            this.submit(Test)
                        }} />}


                    </div>




                </div>
                {!this.state.heldOn && <div>

                    {this.state.contentQuestionList != null && <div className="section-container ">
                        <a className="opencontent" onClick={async () => {

                            // Get the download URL

                            var xhr = new XMLHttpRequest();
                            xhr.responseType = 'blob';
                            xhr.onload = function (event) {
                                var blob = xhr.response;

                                download(blob)
                            };
                            xhr.open('GET', this.state.contentURL);
                            xhr.send();

                            // Or inserted into an <img> element:
                            // var img = document.getElementById('myimg');
                            // img.src = url;




                        }} >Open content</a>
                        {Test.contentQuestionList[0].multiChoices && <div className="content-container">
                            <h3 className="green center">Multiple Choice Questions</h3>
                            {Test.contentQuestionList[0].multiChoices.map((mcq, index) => {

                                return (
                                    <div className="question">
                                        <div className="flex">
                                            <h4>Question No: {index + 1} </h4>
                                            <div className="flex">
                                                <h4 className="regular green-s">Marks: </h4>
                                                <input value={mcq.marks} className="input-marks-s" placeholder="Enter marks" type="number" />

                                            </div>


                                        </div>
                                        <div>
                                            <p>{mcq.question}</p>


                                        </div>


                                        <FormControl component="fieldset" >

                                            <RadioGroup name="options" value={parseInt(mcq.studentSelectedAwnserId, 10) - 1} onChange={(e) => {

                                                mcq.studentSelectedAwnserId = parseInt(e.target.value, 10) + 1;
                                                this.setState({ test: Test })


                                            }}>
                                                <div className="flex-justify">

                                                    {mcq.options.map((option, index) => {
                                                        return (
                                                            <div className="flex">
                                                                <FormControlLabel value={index} control={<Radio />} />
                                                                <input className="option-input-s" value={option.option} />


                                                            </div>
                                                        )
                                                    })

                                                    }

                                                </div>
                                            </RadioGroup>
                                        </FormControl>





                                    </div>
                                )
                            })

                            }

                        </div>}

                        {this.state.contentQuestionList.shorts != undefined && <div className="content-container">
                            <h3 className="green center">Short Questions</h3>
                            {Test.contentQuestionList[0].shorts.map((short, index) => {
                                return (
                                    <div className="question">
                                        <div className="flex">
                                            <h4>Question No: {index + 1} </h4>
                                            <div className="flex">
                                                <h4 className="regular green">Marks: </h4>
                                                <input value={short.marks} className="input-marks" placeholder="Enter marks" type="number" />

                                            </div>


                                        </div>

                                        <p>{short.question}</p>
                                        <input placeholder="Enter answer here" value={short.shortAwnser} className="question-input" onChange={(e) => {
                                            short.shortAwnser = e.target.value;
                                        }} />


                                    </div>
                                )
                            })

                            }

                        </div>}





                    </div>
                    }

                    {this.state.mcqs.length > 0 && <div className="section-container">
                        <h3 className="green-s center">Multiple Choice Questions</h3>
                        {Test.multiChoiceList.map((mcq, index) => {

                            return (
                                <div className="question">
                                    <div className="flex">
                                        <h4>Question No: {index + 1} </h4>
                                        <div className="flex">
                                            <h4 className="regular green-s">Marks: </h4>
                                            <input value={mcq.marks} className="input-marks-s" />

                                        </div>

                                        {/* <img src={deleteImg} className="delete" onClick={()=>{this.deleteMCQ(index)}}></img> */}


                                    </div>
                                    <div>

                                        <p>{mcq.question}</p>

                                    </div>


                                    <FormControl component="fieldset" >

                                        <RadioGroup name="options" value={parseInt(mcq.studentSelectedAwnserId, 10) - 1} onChange={(e) => {

                                            mcq.studentSelectedAwnserId = parseInt(e.target.value, 10) + 1;
                                            this.setState({ test: Test })


                                        }}>
                                            <div className="flex-justify">

                                                {mcq.options.map((option, index) => {
                                                    return (
                                                        <div className="flex">
                                                            <FormControlLabel value={index} control={<Radio />} />
                                                            <p className="option-input-s">{option.option}</p>


                                                        </div>
                                                    )
                                                })

                                                }

                                            </div>
                                        </RadioGroup>
                                    </FormControl>





                                </div>
                            )
                        })

                        }

                    </div>}

                    {this.state.shortQuestions.length > 0 && <div className="section-container">
                        <h3 className="green-s center">Short Questions</h3>
                        {Test.shortsList.map((short, index) => {
                            return (
                                <div className="question">
                                    <div className="flex">
                                        <h4>Question No: {index + 1} </h4>
                                        <div className="flex">
                                            <h4 className="regular green-s">Marks: </h4>
                                            <p className="input-marks-s">{short.marks}</p>

                                        </div>


                                    </div>

                                    <p>{short.question}</p>
                                    <input placeholder="Enter answer here" value={short.shortAwnser} className="question-input" onChange={(e) => {
                                        short.shortAwnser = e.target.value;
                                    }} />



                                </div>
                            )
                        })

                        }

                    </div>}


                </div>}
            </div>
        )
    }

}
export default solveTest;