import React, { Component } from 'react';
import './AppStudent.css';
import '../config';
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import classImg1 from '../Images/classImg1.png'
import Announcements from './announcementsStudent'
import teacherHeader from '../Images/teacher-header.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { isInclusivelyBeforeDay } from 'react-dates'
import * as moment from 'moment';
import studentImg from '../Images/student.png'
import checkmark from '../Images/checkmark.png'
import testImg from '../Images/test.png'
import fire from '../config';
import announcementImg from '../Images/announcement.png'
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import studentDash from '../ImagesStudent/student-dashboard.png'
import Progress from 'react-progressbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import backpack from '../ImagesStudent/backpack@2x.png'
import bookshelf from '../ImagesStudent/bookshelf (1)@2x.png'
import calendar from '../ImagesStudent/calendar@2x.png'
import exam from '../ImagesStudent/exam (2)@2x.png'
import student from '../ImagesStudent/student (1)@2x.png'

class dashboardComponent extends Component {
    constructor() {
        super()
        this.state = {
            student: '',
            studentId: '',
            classes: [],
            students: [],
            school: '',
            schoolId: '',
            attendance: [],
            present: 0,
            absent: 0,
            leave: 0,
            notMarked: 0,
            date: new Date(),
            selectedDate: moment(),
            month: `0${moment().month() + 1}`,
            classId: '',
            Tests: [],
            Results: [],
            fee: [],
            announcements: [],
            drawer: false,
            attendanceMarked: true,
            absentDates: [],
            presentDates: [],
            leaveDates: []

        }
    }

    componentDidMount() {
        console.log('how we show time ' + new Date().toLocaleTimeString(), new Date().getMinutes() + 10)
        this.setState({ student: localStorage.getItem("Student"), studentId: localStorage.getItem("studentId"), schoolId: localStorage.getItem("schoolId"), classId: localStorage.getItem("classId") })
        this.getTests()
        this.getResults()
        this.getSchool()
        this.getAnnouncements()
        this.getAttendance()
        // this.getAttendancebydate(new Date())


    }

    getSchool() {
        firebase.database().ref("Classes").once("value").then(snapshot => {
            snapshot.forEach(school => {


                school.forEach(section => {

                    if (section.key == localStorage.getItem("classId")) {
                        localStorage.setItem("class", section.val().className)
                        console.log(section.val())
                        
                        console.log(school.key)

                    }
                })
            })
        })
    }



    getSelectedDate() {
        let { selectedDate } = this.state;

        // date = date._d;
        var date = new Date()
        var day = date.getDate();
        var month = date.getMonth() + 1;
        // var year = date.getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        selectedDate = day + '-' + month + '-';

        this.setState({ selectedDate })

        this.setState({ month: month })


    }

    getTests() {
        let { Tests } = this.state;
        Tests = []
        firebase.database().ref("Student_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == this.state.classId) {
                    Class.forEach(student => {
                        if (student.key == this.state.studentId) {
                            student.forEach(parent => {
                                parent.forEach(test => {
                                    Tests.push(test.val())
                                })
                            })
                        }
                    })
                }
                var date_a = []
                var date_b = []
                var sorted = Tests.sort((a, b) => {
                    date_a = a.date.split("-")
                    date_b = b.date.split("-")

                    var annouDate_a = new Date(date_a[2], date_a[1] - 1, date_a[0])
                    var annouDate_b = new Date(date_b[2], date_b[1] - 1, date_b[0])

                    return annouDate_a.getTime() -
                        annouDate_b.getTime()
                }).reverse();
                this.setState({ Tests: sorted })
                console.log(Tests)

            })
        })
    }

    getResults() {
        let { Results } = this.state;
        Results = []
        firebase.database().ref("Student_Result").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == this.state.classId) {
                    Class.forEach(student => {
                        if (student.key == this.state.studentId) {
                            student.forEach(result => {
                                Results.push(result.val())
                            })
                        }
                    })
                }



            })
            var date_a = []
            var date_b = []
            //changing date format
            var sorted = Results.sort((a, b) => {
                date_a = a.testDate.split("-")
                date_b = b.testDate.split("-")

                var annouDate_a = new Date(date_a[2], date_a[1] - 1, date_a[0])
                var annouDate_b = new Date(date_b[2], date_b[1] - 1, date_b[0])

                return annouDate_a.getTime() -
                    annouDate_b.getTime()
            }).reverse();

            this.setState({ Results: sorted })
            console.log(Results)
        })
    }

    getAttendance() {
        var field = document.getElementById("select")
        field.value = ""
        console.log(field)
        let { attendance, present, absent, leave, notMarked, absentDates, presentDates, leaveDates } = this.state;
        attendance = []
        absentDates = []
        presentDates = [],
            leaveDates = []
        present = 0
        absent = 0
        leave = 0
        notMarked = 0
        firebase.database().ref("Attendance").once("value").then(snapshot => {
            snapshot.forEach(Class => {

                if (Class.key == this.state.classId) {
                    Class.forEach(date => {
                        console.log(date.key.slice(3, 5))
                        console.log(this.state.month)
                        if (date.key.slice(3, 5) == this.state.month) {
                            date.forEach(student => {
                                if (student.key == localStorage.getItem("studentId")) {

                                    if (student.val().status == 1) {
                                        attendance.push(student.val())
                                        presentDates.push(student.val().date)
                                        present = present + 1
                                        console.log(student.val().date)
                                    } else if (student.val().status == 0) {
                                        absentDates.push(student.val().date)
                                        console.log(student.val().date)
                                        absent = absent + 1
                                    } else if (student.val().status == 2) {
                                        leaveDates.push(student.val().date)
                                        leave = leave + 1
                                    } else if (student.val().status == -1) {
                                        notMarked = notMarked + 1
                                    }
                                }
                            })
                        }
                    })
                }
                this.setState({ attendance, present, absent, leave, notMarked, absentDates, presentDates, leaveDates })
                console.log(present, absent, leave, notMarked)
                console.log(attendance)
            })
        })

    }


    async getAttendancebydate(date) {
        console.log('into dates function')
        this.setState({ attendance: [], noAttendance: '', date: date })

        this.getSelectedDate(date);



        await firebase.database().ref("Attendance").once("value").then(snapshot => {
            let { attendance } = this.state;
            attendance = []
            var present = 0;
            var absent = 0;
            var leave = 0;
            var notMarked = 0
            snapshot.forEach(section => {
                if (section.key == this.state.classId) {
                    section.forEach(date => {
                        if (date.key == this.state.selectedDate) {
                            date.forEach(student => {
                                if (student.key == localStorage.getItem("studentId")) {
                                    if (student.val().status == 0) {
                                        absent = 1;
                                    } else if (student.val().status == 1) {
                                        present = 1;
                                    } else if (student.val().status == -1) {
                                        notMarked = 1;
                                    } else if (student.val().status == 2) {
                                        leave = 1;
                                    }
                                }
                                attendance.push({
                                    name: student.val().studentName,
                                    Present: present,
                                    Absent: absent,
                                    Leave: leave,
                                    notMarked: notMarked
                                })
                            })
                        }
                    })
                }
            })

            this.setState({ attendance, present, absent, leave, notMarked })
        })
    }

    getSelectedDate(date) {

        let { selectedDate } = this.state;
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

    }


    // dateChanged(date){
    //     let { selectedDate} = this.state;

    //     // date = date._d;

    //     var day = date.toDate().getDate();
    //     var month = date.toDate().getMonth() + 1;
    //     var year = date.toDate().getFullYear();
    //     if (day < 10) {
    //         day = '0' + day;
    //     }
    //     if (month < 10) {
    //         month = '0' + month;
    //     }
    //     selectedDate = day + '-' + month  + '-' + year;

    //     this.setState({selectedDate})



    //     let {present, absent, leave} = this.state;
    //     present = 0;
    //     absent = 0;
    //     leave = 0;

    //             this.state.attendance.forEach(student => {
    //                 if (student.status == 1){
    //                     present = present + 1;

    //                 } else if (student.status == 0){
    //                     absent = absent + 1;
    //                 } else if (student.status == 2) {
    //                     leave = leave + 1;
    //                 }
    //             })

    //         this.setState({present, absent, leave})


    //     }



    // getAnnouncements(){
    //     let {announcements} = this.state;
    //     announcements = []
    //     console.log(this.state.classId)
    //     firebase.database().ref("Announcements").child("TeacherAnnouncement").child(this.state.classId).once("value").then(snapshot => {
    //         snapshot.forEach(announcement => {
    //             announcements.push(announcement.val())
    //         })
    //         this.setState({announcements})
    //     })
    // }

    getAnnouncements() {
        firebase.database().ref("Announcements").once("value").then(snapshot => {
            let { announcements } = this.state;
            announcements = []

            snapshot.forEach(parent => {
                if (parent.key == 'TeacherAnnouncement') {

                    parent.forEach(section => {
                        // console.log(school.key)


                        if (section.key == this.state.classId) {

                            section.forEach(announcement => {


                                announcements.push(announcement.val())

                            })
                        }

                    })

                }
                if (parent.key == 'PrincipalAnnouncement') {

                    parent.forEach(school => {
                        console.log(school.key)


                        if (school.key == this.state.schoolId) {

                            school.forEach(announcement => {
                                if (announcement.val().annoucementfor == "Students" || announcement.val().annoucementfor == "Both") {
                                    announcements.push(announcement.val())
                                }
                            })
                        }

                    })

                }
                var date_a = []
                var date_b = []
                //changing date format


                var sorted = announcements.sort((a, b) => {
                    date_a = a.announcDate.split("-")
                    date_b = b.announcDate.split("-")

                    var annouDate_a = new Date(date_a[2], date_a[1] - 1, date_a[0])
                    var annouDate_b = new Date(date_b[2], date_b[1] - 1, date_b[0])

                    return annouDate_a.getTime() -
                        annouDate_b.getTime()
                }).reverse();


                this.setState({ announcements: sorted })
                console.log(announcements)

            })
        })

    }



    onChange(e) {
        var field = document.getElementById("select")
        field.value = `${this.state.month}`
        console.log(field)
        // this.setState({date:e},()=>{getAttendancebydate()})
        this.getAttendancebydate(e)
    }


    render() {
        let attendance = this.state.attendance;

        return (
            <div className="dashboard">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    {/* <div className="student-header">
                     
                        <div><img src={studentDash} className="header-img-s header-img-md"></img></div>


                    </div> */}
                           <div>
                  
                        <img src={studentDash} className="dashboard-header-student"></img>

                    </div>


                    <div className="mid-grid">
                        <div className="box-container">
                            <div className="container-header-s">
                                <h3 className="white center">Class Work</h3>
                                <h4 className="white center">Type Of Work: </h4>
                                <img className="img-sm-st" src={backpack}></img>
                            </div>
                            <div className="container-body">
                                {this.state.Tests.map(test => {
                                    return (


                                        <div className="test-box" style={{ cursor: 'pointer' }}>
                                            <Link to={{
                                                pathname: '/student/test',
                                                state: {
                                                    test: test

                                                }
                                            }}>

                                                <div className="test-box-header" style={{ color: '#0E7886' }}>
                                                    <img src={bookshelf} className="test-icon"></img>
                                                    <h5 className="no-margin-padding">{test.title}</h5>
                                                    <h5 className="no-margin-padding">Subject: {test.subjectName}</h5>
                                                    {/* <h5 className="no-margin-padding">Date: {test.date.slice(0,10)}</h5> */}


                                                </div>
                                                <hr />
                                                <div className="test-box-body">
                                                    <div style={{ width: '100%', textAlign: 'center', borderRight: '1px solid black', padding: '10px', color: '#0E7886' }}>
                                                        <h5 className="no-margin-padding">M.C.Qs</h5>
                                                        <h5 className="no-margin-padding">{test.multiChoiceList != undefined ? test.multiChoiceList.length : ''}</h5>
                                                    </div>
                                                    <div style={{ width: '100%', textAlign: 'center', borderRight: '1px solid black', padding: '10px', color: '#0E7886' }}>
                                                        <h5 className="no-margin-padding">Short Questions</h5>
                                                        <h5 className="no-margin-padding">{test.shortsList != undefined ? test.shortsList.length : ''}</h5>

                                                    </div>
                                                    <div style={{ width: '100%', textAlign: 'center', padding: '10px', color: '#0E7886' }}>
                                                        <h5 className="no-margin-padding">Content Questions</h5>
                                                        <h5 className="no-margin-padding"></h5>

                                                    </div>

                                                </div>
                                                <hr />
                                                <div className="test-box-footer" style={{ color: '#0E7886' }}>
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

                        <div className="box-container">
                            <div className="container-header-s">
                                <h3 className="white center">Results</h3>
                                <img className="img-sm-st" src={student}></img>


                            </div>
                            <div className="container-body">
                                {this.state.Results.map(result => {
                                    return (

                                        <div className="result-box" >
                                            <Link to={{
                                                pathname: '/student/result',
                                                state: {
                                                    test: result

                                                }
                                            }}>
                                                <img className="img-sm-st" style={{ width: '35px' }} src={exam}></img>

                                                <h4>{result.testTitle + result.classWorkType}</h4>
                                                <Progress className="progress-bar" completed={(result.obtainMarks / result.totalMarks) * 100} />
                                                <p>Obtained Marks: {result.obtainMarks} out of {result.totalMarks}</p>
                                            </Link>
                                        </div>

                                    )
                                })

                                }

                            </div>

                        </div>

                    </div>

                    <div className="mid-grid">

                        <div className="box-container">
                            <div className="container-header-s">
                                <img className="img-sm-st" src={calendar}></img>

                                <h3 className="white center regular " style={{ marginLeft: '60px', marginRight: '60px' }}>Have a look at your Attendance Calendar</h3>

                            </div>
                            <div className="container-body">
                                <Calendar
                                    onChange={e => this.onChange(e)}
                                    value={this.state.date}
                                    tileClassName={({ date, view }) => {
                                        
                                        if (this.state.absentDates.find(x => x == moment(date).format("DD-MM-YYYY"))) {
                                          
                                            return 'light'
                                        }
                                        if (this.state.presentDates.find(x => x == moment(date).format("DD-MM-YYYY"))) {
                                            return 'green'
                                        }
                                        if (this.state.leaveDates.find(x => x ==moment(date).format("DD-MM-YYYY"))) {
                                            return 'yellow'
                                        }

                                    }}




                                />


                            </div>

                            <div className="flex" style={{ justifyContent: 'space-around' }}>
                                <h3>Attendance Summary: </h3>

                                <select id="month" className="attendance-select" value={this.state.month} onChange={(e) => {
                                    this.setState({ month: e.target.value })
                                    this.getAttendance()
                                    console.log(this.state.date)
                                }}>
                                    <option id="select" value="" >Select</option>
                                    <option value="01">Jan</option>
                                    <option value="02">Feb</option>
                                    <option value="03">Mar</option>
                                    <option value="04">Apr</option>
                                    <option value="05">May</option>
                                    <option value="06">Jun</option>
                                    <option value="07">Jul</option>
                                    <option value="08">Aug</option>
                                    <option value="09">Sep</option>
                                    <option value="10">Oct</option>
                                    <option value="11">Nov</option>
                                    <option value="12">Dec</option>
                                </select>

                            </div>
                            <div className="flex" style={{ justifyContent: 'space-around' }}>
                                <div>
                                    <p>Present: {this.state.present}</p>
                                    <p>Absent: {this.state.absent}</p>
                                </div>
                                <div>
                                    <p>Leave: {this.state.leave}</p>
                                    <p>Not Marked: {this.state.notMarked}</p>

                                </div>



                            </div>




                        </div>



                        <div className="box-container">
                            <div className="container-header-s">
                                <img className="img-sm-st" src={calendar}></img>

                                <h3 className="white center regular " style={{ marginLeft: '60px', marginRight: '60px' }}>Announcement For Students</h3>

                            </div>
                            <div className="container-body">
                                {this.state.announcements.map(announcement => {
                                    return (
                                        <div className="announcement-box">
                                            <img src={announcementImg} className="announcement-img" ></img>
                                            {/* <div>
                                                <p className="red right">{announcement.annoucementfor != null ? "Principal" : "Teacher"}</p>
                                                <p className="green right">{announcement.announcDate}</p>
                                                <p style={{ textAlign: 'left' }}>{announcement.announDescription}</p>

                                            </div> */}
                                             <div>
                                                    <p>{announcement.announDescription}</p>
                                                    <div style={{ textAlign: 'right' }}>
                                                        
                                                         <p className="red no-margin-padding">{announcement.annoucementfor != null ? "Principal" : "Teacher"}</p>

                                                        <p className="green no-margin-padding">{announcement.teacherName}</p>
                                                        <p className="green no-margin-padding">{announcement.announcDate}</p>

                                                    </div>
                                                </div>
                                        </div>
                                    )
                                })

                                }

                            </div>

                        </div>

                    </div>








                </div>







                <div className="announcement-div">
                    <Announcements school={this.state.schoolId} />
                    <Drawer anchor="right" open={this.state.drawer} onClose={() => { this.setState({ drawer: false }) }} >
                        <Announcements school={this.state.schoolId} />
                    </Drawer>

                </div>





            </div>

        )
    }
}
export default dashboardComponent;