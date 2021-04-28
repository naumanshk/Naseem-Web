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
// import DateFnsUtils from '@date-io/date-fns';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardTimePicker,
//   KeyboardDatePicker,
// } from '@material-ui/pickers';
import DateTimePicker from 'react-datetime-picker';

class createTest extends Component {
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
            contentMCQs: [],
            contentShorts: [],
            image: '',
            content: false,
            imgURL: '',
            uploaded: '',
            students: [],
            testeCreated: false,
            testStartTime: new Date(),
            questionType: ''
        }

    }

    componentDidMount() {
        console.log(this.state.testStartTime.toLocaleTimeString())
        this.getStudents()
    }

    getStudents() {
        let { students } = this.state;
        firebase.database().ref("Student").child(localStorage.getItem("classId")).once("value").then(snapshot => {
            snapshot.forEach(student => {


                if (student.val().id != null) {
                    // console.log(student.val())
                    // console.log(student.key)
                    students.push({ ...student.val(), demokey: student.key })
                }
            })
            // console.log("search for undefined"+students)
            this.setState({ students })
        })

    }



    newMCQ() {
        let { mcqs } = this.state;
        mcqs.push({
            id: mcqs.length + 1,
            question: null,
            marks: 0,
            multiObtainMarks: 0,
            options: [
                {
                    option: '',
                    id: ''
                },
                {
                    option: '',
                    id: ''
                }

            ],
            awnserId: null,
            studentSelectedAwnserId: 0,
            questionType: this.state.questionType,
            classLevel: localStorage.getItem("class"),


        })
        this.setState({ mcqs })
        if (mcqs.length > 0) {
            this.setState({ testeCreated: true })
        }

    }

    newContentMCQ() {
        let { contentMCQs } = this.state;
        contentMCQs.push({
            id: contentMCQs.length + 1,
            question: null,
            marks: 0,
            multiObtainMarks: 0,
            options: [
                {
                    option: '',
                    id: ''
                },
                {
                    option: '',
                    id: ''
                }

            ],
            awnserId: null,
            studentSelectedAwnserId: 0

        })
        this.setState({ contentMCQs })
        if (contentMCQs.length > 0) {
            this.setState({ testeCreated: true })
        }
    }

    newContentShort() {
        let { contentShorts } = this.state;
        contentShorts.push({
            id: contentShorts.length + 1,
            question: '',
            marks: null,
            shortObtainMarks: 0
        })
        this.setState({ contentShorts })
        if (contentShorts.length > 0) {
            this.setState({ testeCreated: true })
        }
    }

    newShortQuestion() {
        let { shortQuestions } = this.state;
        shortQuestions.push({
            id: shortQuestions.length + 1,
            question: '',
            marks: null,
            shortObtainMarks: 0
        })
        this.setState({ shortQuestions })
        if (shortQuestions.length > 0) {
            this.setState({ testeCreated: true })
        }
    }

    deleteMCQ(index) {
        console.log(index)
        let { mcqs } = this.state;
        mcqs.splice(index, 1);
        console.log(mcqs)
        this.setState({ mcqs })
        if (mcqs.length == 0) {
            this.setState({ testeCreated: false })
        }
    }

    deleteShort(index) {
        console.log(index)
        let { shortQuestions } = this.state;
        shortQuestions.splice(index, 1);
        console.log(shortQuestions)
        this.setState({ shortQuestions })
        if (shortQuestions.length == 0) {
            this.setState({ testeCreated: false })
        }
    }

    deleteContentMCQ(index) {
        console.log(index)
        let { contentMCQs } = this.state;
        contentMCQs.splice(index, 1);
        console.log(contentMCQs)
        this.setState({ contentMCQs })
        if (contentMCQs.length == 0) {
            this.setState({ testeCreated: false })
        }
    }

    deleteContentShort(index) {
        console.log(index)
        let { contentShorts } = this.state;
        contentShorts.splice(index, 1);
        console.log(contentShorts)
        this.setState({ contentShorts })
        if (contentShorts.length == 0) {
            this.setState({ testeCreated: false })
        }
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


    submit() {
        if (!this.state.testeCreated) {
            alert("Please add some questions to submit test")
            return;
        }
        let { date } = this.state;
        var key = firebase.database().ref("Teacher_Test").child(localStorage.getItem("classId")).child(localStorage.getItem("teacherId")).push().key;
        console.log(key)

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
        date = day + '-' + month + '-' + year;

        var contentQuestionList = [
            {
                contents: [
                    {
                        fileName: this.state.image.name,
                        fileSize: "",
                        fileType: this.state.image.type,
                        fileUri: this.state.imgURL
                    }
                ],
                id: 1,
                multiChoices: this.state.contentMCQs,
                shorts: this.state.contentShorts

            }
        ]

        if (this.state.image != '' && this.state.imgURL != '') {
            firebase.database().ref("Teacher_Test").child(localStorage.getItem("classId")).child(localStorage.getItem("teacherId")).child(key).set({
                classWorkTpye: this.state.workType,
                contentQuestionList: contentQuestionList,
                date: date,
                id: key,
                multiChoiceList: this.state.mcqs,
                shortsList: this.state.shortQuestions,
                subjectName: this.state.subject,
                teacherId: localStorage.getItem("teacherId"),
                teacherName: localStorage.getItem("Teacher"),
                testDuration: this.state.duration,
                testSolvedStatus: false,
                testTeacherChecked: false,
                testTime: this.state.testStartTime.toLocaleTimeString(),
                title: this.state.title,
                totalMarks: this.state.totalMarks
            }).then(console.log('dones'))

            this.state.students.forEach(student => {
                console.log('here')
                firebase.database().ref("Student_Test").child(localStorage.getItem("classId")).child(student.id).child(localStorage.getItem("teacherId")).child(key).set({
                    classWorkTpye: this.state.workType,
                    contentQuestionList: contentQuestionList,
                    date: date,
                    id: key,
                    multiChoiceList: this.state.mcqs,
                    shortsList: this.state.shortQuestions,
                    subjectName: this.state.subject,
                    teacherId: localStorage.getItem("teacherId"),
                    teacherName: localStorage.getItem("Teacher"),
                    studentName: student.userName,
                    studentId: student.id,
                    testDuration: this.state.duration,
                    testSolvedStatus: false,
                    testTeacherChecked: false,
                    testTime: this.state.testStartTime.toLocaleTimeString(),
                    title: this.state.title,
                    totalMarks: this.state.totalMarks
                }).then(console.log('eje'));

            })



        } else {
            firebase.database().ref("Teacher_Test").child(localStorage.getItem("classId")).child(localStorage.getItem("teacherId")).child(key).set({
                classWorkTpye: this.state.workType,
                date: date,
                id: key,
                multiChoiceList: this.state.mcqs,
                shortsList: this.state.shortQuestions,
                subjectName: this.state.subject,
                teacherId: localStorage.getItem("teacherId"),
                teacherName: localStorage.getItem("Teacher"),
                testDuration: this.state.duration,
                testSolvedStatus: false,
                testTeacherChecked: false,
                testTeacherChecked: false,
                classLevel: localStorage.getItem("class"),
                testTime: this.state.testStartTime.toLocaleTimeString(),
                title: this.state.title,
                totalMarks: this.state.totalMarks
            }).then(console.log('done'))

            this.state.students.forEach(student => {
                console.log('here')
                console.log(student)
                console.log(student.id)


                firebase.database().ref("Student_Test").child(localStorage.getItem("classId")).child(student.id).child(localStorage.getItem("teacherId")).child(key).set({
                    classWorkTpye: this.state.workType,
                    date: date,
                    id: key,
                    multiChoiceList: this.state.mcqs,
                    shortsList: this.state.shortQuestions,
                    subjectName: this.state.subject,
                    teacherId: localStorage.getItem("teacherId"),
                    teacherName: localStorage.getItem("Teacher"),
                    studentName: student.userName,
                    studentId: student.id,
                    testDuration: this.state.duration,
                    testSolvedStatus: false,
                    testTeacherChecked: false,
                    testTime: this.state.testStartTime.toLocaleTimeString(),
                    title: this.state.title,
                    classLevel: localStorage.getItem("class"),
                    totalMarks: this.state.totalMarks

                }).then(console.log('eje'));

            })



        }

        this.props.history.push('/teacher')

    }

    render() {
        var MCQS = this.state.mcqs;
        var shorts = this.state.shortQuestions;
        var contentMCQs = this.state.contentMCQs;
        var contentShorts = this.state.contentShorts;
        return (
            <div className="main-container">
                <div className="test-header">
                    <h1 className="center white">CREATE TEST FOR STUDENTS</h1>
                    <Link to="/home">
                        {!this.state.testeCreated && <button className="submit" onClick={() => { this.submit() }} disabled>SUBMIT</button>}
                        {this.state.testeCreated && <button className="submit" onClick={() => { this.submit() }} >SUBMIT</button>}
                    </Link>

                    <div className="flex-justify">
                        <div>
                            <div className="flex">
                                <h3 className="white ">Work Title: </h3>
                                <input className="header-input" value={this.state.title} onChange={(e) => {
                                    e.preventDefault()
                                    this.setState({ title: e.target.value })
                                }} />

                            </div>
                            <div className="flex">
                                <h3 className="white">Work Type: </h3>
                                <select id="workType" className="select" onChange={(e) => {
                                    this.setState({ workType: e.target.value })
                                }}>
                                    <option selected="selected" value="Test">Test</option>
                                    <option value="Home Work">Home Work</option>
                                    <option value="Mid Term">Mid Term</option>
                                    <option value="Final Term">Final Term</option>
                                </select>
                            </div>
                            <div className="flex">
                                <h3 className="white ">Subject: </h3>
                                <select id="workType" className="select" onChange={(e) => {
                                    this.setState({ subject: e.target.value })
                                }} >
                                    <option selected="selected" value="English">English</option>
                                    <option value="Urdu">Urdu</option>
                                    <option value="Maths">Maths</option>
                                    <option value="Physics">Physics</option>



                                </select>
                            </div>
                            <h3 className="white ">Teacher Name: {localStorage.getItem("Teacher")}</h3>
                        </div>
                        <div>
                            <div className="flex">
                                <h3 className="white">Total Marks: </h3>
                                <input className="header-input" value={this.state.totalMarks} type="number" onChange={(e) => {
                                    e.preventDefault()
                                    this.setState({ totalMarks: parseInt(e.target.value, 10) })
                                }} ></input>

                            </div>
                            <div className="flex">
                                <h3 className="white">Duration: </h3>
                                <input className="header-input" value={this.state.duration} type="number" onChange={(e) => {
                                    e.preventDefault()
                                    this.setState({ duration: e.target.value })
                                }} ></input>

                            </div>
                            <div className="flex">
                                <h3 className="white">Date: </h3>
                                {/* <SingleDatePicker
                                        date={this.state.date} 
                                        onDateChange={date => {
                                            this.setState({date: date})
                                            // this.getSelectedDate()
                                            
                                            
                                            
                                        }} 
                                        focused={this.state.focused} 
                                        onFocusChange={({ focused }) => this.setState({ focused })}
                                        id="your_unique_id" 
                                        isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                        numberOfMonths= "1"
                                        /> */}

                                <DateTimePicker

                                    className='custom-cal-t'
                                    onChange={e => this.setState({ testStartTime: e, date: new Date(e) })}
                                    value={new Date(this.state.testStartTime)}

                                />
                            </div>
                            <div className="flex">
                                {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardTimePicker
                                margin="normal"
                                id="time-picker"
                                label="Time picker"
                                value={this.state.time}
                                onChange={time => {
                                    this.setState({time: time})
                                    console.log(time)
                                }}
                                KeyboardButtonProps={{
                                    'aria-label': 'change time',
                                }}
                                />
                            </MuiPickersUtilsProvider> */}



                            </div>

                        </div>


                    </div>

                    <div className="flex-justify" >
                        <button className="test-btn" onClick={() => { this.newMCQ() }}>Multiple Choice</button>

                        <button className="test-btn" onClick={() => { this.newShortQuestion() }}>Short Questions</button>

                        <button className="test-btn" onClick={() => { this.setState({ content: true }) }}>Content Upload</button>
                    </div>

                </div>

                {this.state.content == true && <div className="section-container center">
                    <input class="upload-img" style={{ backgroundImage: `url(${uploadImg})`, height: '30px' }} type="file" onChange={(e) => {
                        var { image } = this.state;
                        image = e.target.files[0]
                        this.setState({ image })
                        console.log(image)
                    }}></input>
                    <p>{this.state.uploaded}</p>

                    <button className="content-btn" onClick={() => { this.fileUpload() }}>upload</button>

                    <div className="flex-justify" >
                        <button className="test-btn" onClick={() => { this.newContentMCQ() }}>Multiple Choice</button>
                        <button className="test-btn" onClick={() => { this.newContentShort() }}>Short Questions</button>

                    </div>



                    {contentMCQs.length > 0 && <div className="content-container">
                        <h3 className="green center">Multiple Choice Questions</h3>
                        {contentMCQs.map((mcq, index) => {

                            return (
                                <div className="question">
                                    <div className="flex">
                                        <h4>Question No: {index + 1} </h4>
                                        <div className="flex">
                                            <h4 className="regular green">Marks: </h4>
                                            <input value={mcq.marks} className="input-marks" placeholder="Enter marks" type="number" onChange={(e) => {
                                                e.preventDefault();
                                                mcq.marks = parseInt(e.target.value, 10);
                                                this.setState({ contentMCQs: contentMCQs })
                                            }} />

                                        </div>

                                        <img src={deleteImg} className="delete" onClick={() => { this.deleteContentMCQ(index) }}></img>


                                    </div>
                                    <div>
                                        <input value={mcq.question} placeholder="Enter Question here" className="question-input" onChange={(e) => {
                                            e.preventDefault()
                                            mcq.question = e.target.value;
                                            this.setState({ contentMCQs: contentMCQs })
                                        }} />

                                        <button className="add-new-option" onClick={() => {
                                            mcq.options.push({
                                                option: '',
                                                id: 0
                                            })
                                            this.setState({ contentMCQs: contentMCQs })
                                        }} >+ Add New Option</button>

                                    </div>


                                    <FormControl component="fieldset" >

                                        <RadioGroup name="options" value={parseInt(mcq.awnserId, 10) - 1} onChange={(e) => {

                                            mcq.awnserId = parseInt(e.target.value, 10) + 1;
                                            this.setState({ contentMCQs: contentMCQs })

                                            console.log(e.target.value)
                                        }}>
                                            <div className="flex-justify">

                                                {mcq.options.map((option, index) => {
                                                    return (
                                                        <div className="flex">
                                                            <FormControlLabel value={index} control={<Radio />} />
                                                            <input className="option-input" value={option.option} onChange={(e) => {
                                                                e.preventDefault()
                                                                option.option = e.target.value;
                                                                option.id = index + 1;
                                                                this.setState({ contentMCQs: contentMCQs })
                                                            }} />


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

                    {contentShorts.length > 0 && <div className="content-container">
                        <h3 className="green center">Short Questions</h3>
                        {contentShorts.map((short, index) => {
                            return (
                                <div className="question">
                                    <div className="flex">
                                        <h4>Question No: {index + 1} </h4>
                                        <div className="flex">
                                            <h4 className="regular green">Marks: </h4>
                                            <input value={short.marks} className="input-marks" placeholder="Enter marks" type="number" onChange={(e) => {
                                                e.preventDefault();
                                                short.marks = parseInt(e.target.value, 10);
                                                this.setState({ contentShorts: contentShorts })
                                            }} />

                                        </div>
                                        <img src={deleteImg} className="delete" onClick={() => { this.deleteContentShort(index) }}></img>

                                    </div>
                                    <input value={short.question} placeholder="Enter Question here" className="question-input" onChange={(e) => {
                                        e.preventDefault()
                                        short.question = e.target.value;
                                        this.setState({ contentShorts: contentShorts })
                                    }} />


                                </div>
                            )
                        })

                        }

                    </div>}





                </div>
                }

                {MCQS.length > 0 && <div className="section-container">
                    <h3 className="green center">Multiple Choice Questions</h3>
                    {MCQS.map((mcq, index) => {

                        return (
                            <div className="question">
                                <div className="flex">
                                    <h4>Question No: {index + 1} </h4>
                                    <div className="flex">
                                        <h4 className="regular green">Marks: </h4>
                                        <input value={mcq.marks} className="input-marks" placeholder="Enter marks" type="number" onChange={(e) => {
                                            e.preventDefault();
                                            mcq.marks = parseInt(e.target.value, 10);
                                            this.setState({ mcqs: MCQS })
                                        }} />


                                        {
                                            this.state.subject == 'English' &&
                                            <select
                                                onChange={e => {



                                                    e.preventDefault()
                                                    mcq.questionType = e.target.value;
                                                    this.setState({ mcqs: MCQS })


                                                }
                                                }
                                                style={{ height: '50%', alignSelf: 'center', marginLeft: '40px' }}>
                                                <option>Type</option>
                                                <option value={'Grammer'}>Grammer</option>
                                                <option value={'Punctuation'}>Punctuation</option>
                                                <option value={'Adjectivies'}>Adjectives</option>
                                                <option value={'Nouns'}>Nouns</option>

                                                <option value={'Adverbs'}>Adverbs</option>
                                                <option value={'Verbs'}>Verbs</option>
                                                


                                            </select>
                                        }

                                        {
                                            this.state.subject == 'Maths' &&
                                            <select
                                                onChange={e => {



                                                    e.preventDefault()
                                                    mcq.questionType = e.target.value;
                                                    this.setState({ mcqs: MCQS })


                                                }
                                                }
                                                style={{ height: '50%', alignSelf: 'center', marginLeft: '40px' }}>
                                                <option>Type</option>
                                                <option value={'multiplication'}>Multiplication</option>
                                                <option value={'addition'}>Addition</option>

                                            </select>
                                        }

                                    </div>

                                    <img src={deleteImg} className="delete" onClick={() => { this.deleteMCQ(index) }}></img>


                                </div>
                                <div>
                                    <input value={mcq.question} placeholder="Enter Question here" className="question-input" onChange={(e) => {
                                        e.preventDefault()
                                        mcq.question = e.target.value;
                                        this.setState({ mcqs: MCQS })
                                    }} />

                                    <button className="add-new-option" onClick={() => {
                                        mcq.options.push({
                                            option: '',
                                            id: 0
                                        })
                                        this.setState({ mcqs: MCQS })
                                    }} >+ Add New Option</button>

                                </div>


                                <FormControl component="fieldset" >

                                    <RadioGroup name="options" value={parseInt(mcq.awnserId, 10) - 1} onChange={(e) => {

                                        mcq.awnserId = parseInt(e.target.value, 10) + 1;
                                        this.setState({ mcqs: MCQS })

                                        console.log(e.target.value)
                                    }}>
                                        <div className="flex-justify">

                                            {mcq.options.map((option, index) => {
                                                return (
                                                    <div className="flex">
                                                        <FormControlLabel value={index} control={<Radio />} />
                                                        <input className="option-input" value={option.option} onChange={(e) => {
                                                            e.preventDefault()
                                                            option.option = e.target.value;
                                                            option.id = index + 1;
                                                            this.setState({ mcqs: MCQS })
                                                        }} />


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

                {
                    shorts.length > 0 && <div className="section-container">
                        <h3 className="green center">Short Questions</h3>
                        {shorts.map((short, index) => {
                            return (
                                <div className="question">
                                    <div className="flex">
                                        <h4>Question No: {index + 1} </h4>
                                        <div className="flex">
                                            <h4 className="regular green">Marks: </h4>
                                            <input value={short.marks} className="input-marks" placeholder="Enter marks" type="number" onChange={(e) => {
                                                e.preventDefault();
                                                short.marks = parseInt(e.target.value, 10);
                                                this.setState({ shortQuestions: shorts })
                                            }} />

                                        </div>
                                        <img src={deleteImg} className="delete" onClick={() => { this.deleteShort(index) }}></img>

                                    </div>
                                    <input value={short.question} placeholder="Enter Question here" className="question-input" onChange={(e) => {
                                        e.preventDefault()
                                        short.question = e.target.value;
                                        this.setState({ shortQuestions: shorts })
                                    }} />


                                </div>
                            )
                        })

                        }

                    </div>
                }



            </div >
        )
    }

}
export default createTest;