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
import { Link } from "react-router-dom";
import { isThisHour } from 'date-fns';
import uploadImg from '../Images/upload.png'
import Countdown from 'react-countdown-now';
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';

class checkTest extends Component {
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
            obtainedMarks: 0
        }
    }

    componentDidMount() {
        let { test } = this.props.location.state;
        console.log(test)
        this.setState({ test: test })
        // if (test.testSolvedStatus  && (test.multiChoiceList || test.shortsList || test.contentQuestionList)){
        //     console.log('nauman')
        //    var marksmcqs=0
        //    var marksShorts=0
        //    if(test.multiChoiceList){
        //     for(let i=0; i<test.multiChoiceList.length; i++){
        //         marksmcqs+=test.multiChoiceList[i].multiObtainMarks
        //            console.log(test.multiChoiceList[i].multiObtainMarks)
        //     }
        // }
        // if(test.shortsList){
        //          for(let i=0; i<test.shortsList.length; i++){
        //              marksShorts+=test.shortsList[i].shortObtainMarks
        //                 console.log(test.shortsList[i].shortObtainMarks)
        //          }
        // }
        // if(test.contentQuestionList){
        //          for(let i=0; i<test.contentQuestionList[0].multiChoices.length; i++){
        //              marksmcqs+=test.contentQuestionList[0].multiChoices[i].multiObtainMarks
        //                 console.log(test.contentQuestionList[0].multiChoices[i].multiObtainMarks)
        //          }


        //          for(let i=0; i<test.contentQuestionList[0].shorts.length; i++){
        //              marksShorts+=test.contentQuestionList[0].shorts[i].shortObtainMarks
        //                 console.log(test.contentQuestionList[0].shorts[i].shortObtainMarks)
        //          }
        //         }
        //          console.log(marksShorts+marksmcqs)
        //     this.setState({mcqs: test.multiChoiceList,obtainedMarks:this.state.obtainedMarks+marksShorts+marksmcqs})

        // }

        // if (test.shortsList){

        //     var marksShorts=0
        //      for(let i=0; i<test.shortsList.length; i++){
        //          marksShorts+=test.shortsList[i].shortObtainMarks
        //             console.log(test.shortsList[i].shortObtainMarks)
        //      }

        //      console.log("suchi="+Number(marksmcqs)+Number(marksShorts))

        //     this.setState({shortQuestions: test.shortsList,obtainedMarks:this.state.obtainedMarks+marksmcqs+marksShorts})
        // }

        if (test.contentQuestionList) {
            this.setState({ contentQuestionList: test.contentQuestionList[0] })
        }
        // if(test.testSolvedStatus && test.contentQuestionList){

        //     var marksmcqs=0
        //     var marksShorts=0
        //     for(let i=0; i<test.contentQuestionList[0].multiChoices.length; i++){
        //         marksmcqs+=test.contentQuestionList[0].multiChoices[i].multiObtainMarks
        //            console.log(test.contentQuestionList[0].multiChoices[i].multiObtainMarks)
        //     }
        //     for(let i=0; i<test.contentQuestionList[0].shorts.length; i++){
        //         marksShorts+=test.contentQuestionList[0].shorts[i].shortObtainMarks
        //            console.log(test.contentQuestionList[0].shorts[i].shortObtainMarks)
        //     }
        //     // this.setState({obtainedMarks:this.state.obtainedMarks+marksmcqs+marksShorts})
        //     console.log(this.state.obtainedMarks)
        // }






    }

    submit(Test) {


        firebase.database().ref("Student_Test").child(localStorage.getItem("classId")).child(Test.studentId).child(Test.teacherId).child(Test.id).set(Test);
        console.log(Test)

        var result = {
            classWorkType: Test.classWorkTpye,
            contentMultiChoiceObtainMarks: 0,
            contentMultiChoiceTotalCorrect: 0,
            contentMultiChoiceTotalMarks: 0,
            contentMultiChoiceTotalWrong: 0,
            contentQueObtainMarks: 0,
            contentQueTotalMarks: 0,
            contentShortQueObtianMarks: 0,
            contentShortQueTotalMarks: 0,
            contentTotalObtainMarks: 0,
            id: Test.id,
            multiChoiceObtainMarks: 0,
            multiChoiceTotalCorrect: 0,
            multiChoiceTotalMarks: 0,
            multiChoiceTotalWrong: 0,
            obtainMarks: 0,
            shortQueObtianMarks: 0,
            shortQueTotalMarks: 0,
            testCheckStatus: Test.testTeacherChecked,
            testDate: Test.date,
            testTitle: Test.title,
            totalContentQues: 0,
            totalMarks: 0,
            totalMCQues: 0,
            totalShortQues: 0
        }

        if (Test.multiChoiceList != undefined) {
            Test.multiChoiceList.map(mcq => {
                result.multiChoiceObtainMarks = result.multiChoiceObtainMarks + mcq.multiObtainMarks;
                result.multiChoiceTotalMarks = result.multiChoiceTotalMarks + mcq.marks;
                result.obtainMarks = result.obtainMarks + mcq.multiObtainMarks;
                if (mcq.studentSelectedAwnserId == mcq.awnserId) {
                    result.multiChoiceTotalCorrect = result.multiChoiceTotalCorrect + 1;
                } else {
                    result.multiChoiceTotalWrong = result.multiChoiceTotalWrong + 1;
                    var childKey = firebase.database().ref("progressive_suggestions").push().getKey();
                    console.log(mcq.questionType)
                    firebase.database().ref("progressive_suggestions").child(localStorage.getItem("classId")).child(Test.studentId).child(Test.subjectName).child(childKey).set({

                        questionType:mcq.questionType,
                        subject: Test.subjectName,
                        studentId:Test.studentId,
                        classLevel:Test.classLevel


                    }).then(console.log('done'));
                }
            })

            result.totalMCQues = Test.multiChoiceList.length;

        }

        if (Test.shortsList != undefined) {
            Test.shortsList.map(short => {
                result.shortQueObtianMarks = result.shortQueObtianMarks + parseInt(short.shortObtainMarks, 10);
                result.obtainMarks = result.obtainMarks + parseInt(short.shortObtainMarks, 10);
                result.shortQueTotalMarks = result.shortQueTotalMarks + short.marks;
            })
            result.totalShortQues = Test.shortsList.length;
        }

        if (this.state.contentQuestionList != null) {
            if (Test.contentQuestionList[0].multiChoices != undefined) {
                Test.contentQuestionList[0].multiChoices.map(mcq => {
                    result.contentMultiChoiceObtainMarks = result.contentMultiChoiceObtainMarks + mcq.multiObtainMarks;
                    result.contentMultiChoiceTotalMarks = result.contentMultiChoiceTotalMarks + mcq.marks;
                    result.obtainMarks = result.obtainMarks + mcq.multiObtainMarks;
                    if (mcq.studentSelectedAwnserId == mcq.awnserId) {
                        result.contentMultiChoiceTotalCorrect = result.contentMultiChoiceTotalCorrect + 1;
                    } else {
                        result.contentMultiChoiceTotalWrong = result.contentMultiChoiceTotalWrong + 1;
                    }
                    result.contentQueTotalMarks = result.contentQueTotalMarks + mcq.marks;
                    result.contentQueObtainMarks = result.contentQueObtainMarks + mcq.multiObtainMarks;
                    result.contentTotalObtainMarks = result.contentTotalObtainMarks + mcq.multiObtainMarks;
                })
                result.totalContentQues = Test.contentQuestionList[0].multiChoices.length;
            }
            if (Test.contentQuestionList[0].shorts) {
                Test.contentQuestionList[0].shorts.map(short => {
                    result.contentShortQueObtianMarks = result.contentShortQueObtianMarks + parseInt(short.shortObtainMarks, 10);
                    result.obtainMarks = result.obtainMarks + parseInt(short.shortObtainMarks, 10);
                    result.contentShortQueTotalMarks = result.contentShortQueTotalMarks + short.marks;
                    result.contentQueTotalMarks = result.contentQueTotalMarks + short.marks;
                    result.contentQueObtainMarks = result.contentQueObtainMarks + parseInt(short.shortObtainMarks, 10);
                    result.contentTotalObtainMarks = result.contentTotalObtainMarks + parseInt(short.shortObtainMarks, 10);

                })
                result.totalContentQues = result.totalContentQues + Test.contentQuestionList[0].shorts.length;

            }
        }






        result.totalMarks = Test.totalMarks;



        firebase.database().ref("Student_Result").child(localStorage.getItem("classId")).child(Test.studentId).child(Test.id).set(result);
        console.log(result)






        this.props.history.push('/teacher')

    }

    render() {
        var Test = this.state.test;
        return (
            <div className="main-container">
                <div className="test-header" >
                    <h1 className="center white">CHECK TEST</h1>

                    {!Test.testTeacherChecked && <button className="submit" onClick={() => {
                        Test.testTeacherChecked = true;
                        this.submit(Test)

                    }}>SUBMIT</button>}
                    {Test.testTeacherChecked && <button className="hide" disabled>SUBMIT</button>}

                    {Test.testTeacherChecked && <Link
                        to={{
                            pathname: '/teacher/test/result',
                            state: {
                                test: this.state.test
                            }
                        }}
                    >
                        <button className="submit" >Result</button>
                    </Link>
                    }

                    <div className="flex-justify">
                        <div>
                            <div className="flex">
                                <h3 className="white ">Work Title: </h3>
                                <p className="header-input-s" style={{ backgroundColor: '#4CBB17' }} >{this.state.test.title} </p>

                            </div>
                            <div className="flex">
                                <h3 className="white">Work Type: </h3>
                                <p className="header-input-s" style={{ backgroundColor: '#4CBB17' }} >{this.state.test.classWorkTpye}</p>


                            </div>
                            <div className="flex">
                                <h3 className="white ">Subject: </h3>
                                <p className="header-input-s" style={{ backgroundColor: '#4CBB17' }} >{this.state.test.subjectName} </p>


                            </div>
                            <h3 className="white ">Teacher Name: {this.state.test.teacherName}</h3>
                        </div>
                        <div>
                            <div className="flex">
                                <h3 className="white">Total Marks: </h3>
                                <p className="header-input-s" style={{ backgroundColor: '#4CBB17' }}>{this.state.test.totalMarks}</p>

                            </div>
                            <div className="flex">
                                <h3 className="white">Status </h3>
                                {this.state.test.testTeacherChecked && <p className="header-input-s" style={{ backgroundColor: '#4CBB17' }}>Checked</p>}
                                {!this.state.test.testTeacherChecked && <p className="header-input-s" style={{ backgroundColor: '#4CBB17', color: 'red' }}>Unchecked</p>}


                            </div>
                            <div className="flex">
                                <h3 className="white">Duration: </h3>
                                <p className="header-input-s" style={{ backgroundColor: '#4CBB17' }}>{this.state.test.testDuration}</p>

                            </div>
                            <div className="flex">
                                <h3 className="white">Date: </h3>
                                <p className="header-input-s" style={{ backgroundColor: '#4CBB17' }}>{this.state.test.date}</p>



                            </div>


                        </div>




                    </div>





                </div>

                {this.state.contentQuestionList != null && <div className="section-container ">

                    {Test.contentQuestionList[0].multiChoices && <div className="content-container">
                        <h3 className="green center">Multiple Choice Questions</h3>
                        {Test.contentQuestionList[0].multiChoices.map((mcq, index) => {
                            if (mcq.studentSelectedAwnserId == mcq.awnserId) {
                                mcq.multiObtainMarks = mcq.marks
                            }

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

                                        <RadioGroup name="options" value={parseInt(mcq.studentSelectedAwnserId, 10) - 1} >
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
                                    <input placeholder="Enter answer here" value={short.shortAwnser} className="question-input" />
                                    <div style={{ float: 'right' }} className="flex">
                                        <h4 className="regular green">Enter marks: </h4>

                                        <input className="input-marks" type="number" onChange={(e) => {
                                            short.shortObtainMarks = parseInt(e.target.value, 10);
                                        }} />

                                    </div>


                                </div>
                            )
                        })

                        }

                    </div>}





                </div>
                }

                {Test.multiChoiceList && <div className="section-container">
                    <h3 className="green center">Multiple Choice Questions</h3>
                    {Test.multiChoiceList.map((mcq, index) => {
                        if (mcq.studentSelectedAwnserId == mcq.awnserId) {
                            mcq.multiObtainMarks = mcq.marks
                        }

                        return (
                            <div className="question">
                                <div className="flex">
                                    <h4>Question No: {index + 1} </h4>
                                    <div className="flex">
                                        <h4 className="regular green">Marks: </h4>
                                        <input value={mcq.marks} className="input-marks" />

                                    </div>

                                    {/* <img src={deleteImg} className="delete" onClick={()=>{this.deleteMCQ(index)}}></img> */}


                                </div>
                                <div>

                                    <p>{mcq.question}</p>

                                </div>


                                <FormControl component="fieldset" >

                                    <RadioGroup name="options" value={parseInt(mcq.studentSelectedAwnserId, 10) - 1} >
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

                {Test.shortsList && <div className="section-container">
                    <h3 className="green center">Short Questions</h3>
                    {Test.shortsList.map((short, index) => {
                        return (
                            <div className="question">
                                <div className="flex">
                                    <h4>Question No: {index + 1} </h4>
                                    <div className="flex">
                                        <h4 className="regular green">Marks: </h4>
                                        <p className="input-marks">{short.marks}</p>

                                    </div>


                                </div>

                                <p>{short.question}</p>
                                <input placeholder="Enter answer here" value={short.shortAwnser} className="question-input" />
                                <div style={{ float: 'right' }} className="flex">
                                    <h4 className="regular green">Enter marks: </h4>

                                    <input className="input-marks" type="number" onChange={(e) => {
                                        short.shortObtainMarks = parseInt(e.target.value, 10);
                                    }} />

                                </div>



                            </div>
                        )
                    })

                    }

                </div>}



            </div>
        )
    }

}
export default checkTest;