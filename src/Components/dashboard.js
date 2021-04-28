import React, { Component } from 'react';
import '../App.css';
import '../config';
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import classImg1 from '../Images/classImg1.png'
import Announcements from './announcements'
import teacherHeader from '../Images/teacher-dashboards.png'
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

class dashboardComponent extends Component {
    constructor() {
        super()
        this.state = {
            teacher: '',
            teacherId: '',
            classes: [],
            students: [],
            school: '',
            schoolId: '',
            attendance: [],
            date: moment(),
            selectedDate: moment(),
            present: 0,
            absent: 0,
            leave: 0,
            classId: '',
            Tests: [],
            fee: [],
            announcements: [],
            drawer: false,
            attendanceMarked: true,
            Notifications: [],
            checked: false

        }
    }

    componentDidMount() {

        this.setState({ teacher: localStorage.getItem("Teacher"), teacherId: localStorage.getItem("teacherId") })
        this.getClasses()
        this.getSelectedDate()
        this.getSchool()


    }

    getSchool() {
        firebase.database().ref("Teachers").once("value").then(snapshot => {
            snapshot.forEach(school => {


                school.forEach(teacher => {

                    if (teacher.key == localStorage.getItem("teacherId")) {

                        this.setState({ schoolId: school.key })

                    }
                })
            })
        })
    }

    getSelectedDate() {
        let { selectedDate } = this.state;
        let { date } = this.state;
        // date = date._d;

        var day = date.toDate().getDate();
        var month = date.toDate().getMonth() + 1;
        var year = date.toDate().getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        selectedDate = day + '-' + month + '-' + year;

        this.setState({ selectedDate })


    }

    getFee() {
        let { fee } = this.state;
        fee = []
        firebase.database().ref("Fee").once("value").then(snapshot => {
            snapshot.forEach(school => {

                console.log("school-key" + school.key)

                school.forEach(Class => {

                    if (Class.key == localStorage.getItem('classId')) {

                        Class.forEach(date => {
                            // console.log(date.val())
                            if (date.key == this.state.selectedDate.slice(3, 10)) {

                                date.forEach(student => {

                                    fee.push(student.val())
                                })

                            }

                        })

                    }
                })



            })
            this.setState({ fee })
            console.log(fee)

        })

    }


    getClasses() {
        let { classes } = this.state;
        classes = []

        firebase.database().ref("Assosiated_Classes").once("value").then(snapshot => {
            snapshot.forEach(school => {
                school.forEach(teacher => {
                    if (teacher.key == this.state.teacherId) {
                        this.setState({ school: school.key })

                        teacher.forEach(Class => {
                            classes.push(Class.val())
                            console.log('classes' + Class.val().refId)
                        })

                    }
                })
            })
            this.setState({ classes })
            if (classes.length != 0) {

                this.getClassDetails(classes[0].id)
                this.setState({ classId: classes[0].id })

                localStorage.setItem("classId", classes[0].id)
                localStorage.setItem("class", classes[0].className)

            }
        })
    }

    getClassDetails(id) {

        let { students } = this.state;
        students = []
        firebase.database().ref("Student").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == id) {
                    Class.forEach(student => {
                        students.push(student.val())
                    })
                }

            })
            this.setState({ students })

            this.getAttendance(id)
            this.getTests()
            this.getFee()
            this.getAnnouncements()
            this.getNotificaitons()
        })


    }

    dateChanged(date) {
        let { selectedDate } = this.state;

        // date = date._d;

        var day = date.toDate().getDate();
        var month = date.toDate().getMonth() + 1;
        var year = date.toDate().getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        selectedDate = day + '-' + month + '-' + year;

        this.setState({ selectedDate })

        this.getAttendanceTotals()
        this.getFee()


        let { present, absent, leave } = this.state;
        present = 0;
        absent = 0;
        leave = 0;

        this.state.attendance.forEach(student => {
            if (student.status == 1) {
                present = present + 1;

            } else if (student.status == 0) {
                absent = absent + 1;
            } else if (student.status == 2) {
                leave = leave + 1;
            }
        })

        this.setState({ present, absent, leave })

        this.getAttendance(localStorage.getItem("classId"))
    }


    getTests() {
        let { Tests } = this.state;

        Tests = []
        firebase.database().ref("Teacher_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == this.state.classId) {
                    Class.forEach(teacher => {
                        if (teacher.key == this.state.teacherId) {
                            teacher.forEach(test => {
                                Tests.push(test.val())
                            })
                        }
                    })
                }

                console.log(Tests)
                this.setState({ Tests })

            })
        })
    }

    getNotificaitons() {
        let { Notifications } = this.state;
        let { content } = this.state;
        Notifications = []
        firebase.database().ref("Student_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == this.state.classId) {
                    Class.forEach(student => {

                        student.forEach(parent => {
                            parent.forEach(test => {
                                if (test.val().testSolvedStatus) {
                                    console.log(test.val())
                                    Notifications.push(test.val())
                                }

                            })
                        })

                    })
                }
                this.setState({ Notifications })


            })
        })
    }


    getAttendance(id) {

        let { attendance } = this.state;
        attendance = []
        var studentAttendance = {
            date: this.state.selectedDate,
            attendance: []
        }
        firebase.database().ref("Attendance").once("value").then(snapshot => {
            snapshot.forEach(ClassId => {
                console.log(ClassId.key)

                console.log(id)
                if (ClassId.key == id) {
                    console.log('class')
                    ClassId.forEach(day => {
                        if (day.key == this.state.selectedDate) {
                            console.log('day')

                            day.forEach(student => {
                                console.log('student')
                                attendance.push({
                                    date: student.val().date,
                                    id: student.val().id,
                                    studentName: student.val().studentName,
                                    status: student.val().status
                                })
                            })

                        }

                    })
                }
            })
            console.log(attendance)
            if (attendance.length == 0) {
                this.setState({ attendanceMarked: false })

                this.state.students.forEach(student => {
                    attendance.push({
                        date: this.state.selectedDate,
                        id: student.id,
                        studentName: student.userName,
                        status: -1
                    })

                })
            }



            this.setState({ attendance })
            console.log(attendance)
            this.getAttendanceTotals()
        })
    }

    getAttendanceTotals() {
        let { present, absent, leave } = this.state;
        present = 0;
        absent = 0;
        leave = 0;

        this.state.attendance.forEach(student => {
            if (student.status == 1) {
                present = present + 1;

            } else if (student.status == 0) {
                absent = absent + 1;
            } else if (student.status == 2) {
                leave = leave + 1;
            }
        })

        this.setState({ present, absent, leave })


    }

    submitAttendance() {
        console.log(this.state.attendance)
        console.log(this.state.attendanceMarked)
        if (this.state.attendanceMarked == true) {


            this.state.attendance.forEach(student => {
                firebase.database().ref("Attendance").child(this.state.classId).child(this.state.selectedDate).child(student.id).child("status").set(student.status).then(console.log('done'))
            })

        } else if (this.state.attendanceMarked == false) {

            this.state.attendance.forEach(student => {
                firebase.database().ref("Attendance").child(this.state.classId).child(this.state.selectedDate).child(student.id).child("date").set(student.date).then(console.log('done'))
                firebase.database().ref("Attendance").child(this.state.classId).child(this.state.selectedDate).child(student.id).child("id").set(student.id).then(console.log('done'))
                firebase.database().ref("Attendance").child(this.state.classId).child(this.state.selectedDate).child(student.id).child("status").set(student.status).then(console.log('done'))
                firebase.database().ref("Attendance").child(this.state.classId).child(this.state.selectedDate).child(student.id).child("studentName").set(student.studentName).then(console.log('done'))

            })

        }


    }

    studentProgress(student) {
        let { students } = this.state;
        if (student.status == false) {
            firebase.database().ref("Student").child(this.state.classId).child(student.id).child("status").set(true)
            students.forEach(Student => {
                if (Student.id == student.id) {
                    Student.status = true;
                }
            })
            this.setState({ students })
        } else {
            firebase.database().ref("Student").child(this.state.classId).child(student.id).child("status").set(false)
            students.forEach(Student => {
                if (Student.id == student.id) {
                    Student.status = false;
                }
            })
            this.setState({ students });
        }
    }

    studentFee(student) {
        let { fee } = this.state;
        if (student.status == false) {
            firebase.database().ref("Fee").child(this.state.schoolId).child(this.state.classId).child(this.state.selectedDate.slice(3, 10)).child(student.id).child("status").set(true)
            fee.forEach(Student => {
                if (Student.id == student.id) {
                    Student.status = true
                }
            })
            this.setState({ fee })
        } else {
            firebase.database().ref("Fee").child(this.state.schoolId).child(this.state.classId).child(this.state.selectedDate.slice(3, 10)).child(student.id).child("status").set(false)
            fee.forEach(Student => {
                if (Student.id == student.id) {
                    Student.status = false
                }
            })
            this.setState({ fee })
        }
    }

    getAnnouncements() {
        let { announcements } = this.state;
        announcements = []
        firebase.database().ref("Announcements").child("TeacherAnnouncement").child(this.state.classId).once("value").then(snapshot => {
            snapshot.forEach(announcement => {
                announcements.push(announcement.val())
            })
            firebase.database().ref("Announcements").child("PrincipalAnnouncement").child(this.state.schoolId).once("value").then(snapshot => {
                snapshot.forEach(announcement => {
                    if(announcement.val().annoucementfor=="Teachers" || announcement.val().annoucementfor=="Both" ){
                        announcements.push(announcement.val())
                    }
                    
                })
                this.setState({ announcements })
    
            })

        })
    }

    render() {
        let attendance = this.state.attendance;

        return (
            <div className="dashboard">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    <div>
                    
                        <img src={teacherHeader} className="header-img border-rad-img"></img>

                    </div>


                    <div >
                        <h2 className="grey regular">Select Class To View Details</h2>
                        <div className="flex flex-responsive" >
                            {this.state.classes.map(Class => {

                                return (
                                    <div className={this.state.classId == Class.id ? "class-box-green" : "class-box-white"} onClick={() => {
                                        this.getClassDetails(Class.id)
                                        this.setState({ classId: Class.id })
                                        localStorage.setItem("classId", Class.id)
                                        localStorage.setItem("class", Class.className)



                                    }
                                    }>
                                        <h2 style={{ marginBottom: 0 }} className="regular">{Class.className}</h2>
                                        <p style={{ margin: 0 }} className="regular">{Class.refId}</p>
                                        <img src={classImg1} className="class-icon" />

                                    </div>
                                )
                            })

                            }

                        </div>
                    </div>

                    <div className="mid-grid" >
                        <div className="box-container">
                            <div className="container-header">
                                <h3 className="white center " style={{ marginTop: '0px' }}>Attendance Details</h3>
                                <div className="flex-justify">
                                    <div >
                                        <p className="no-margin-padding white">Total Students: {this.state.students.length}</p>
                                        <p className="no-margin-padding white">Present: {this.state.present}</p>
                                        <p className="no-margin-padding white">Absent: {this.state.absent}</p>
                                        <p className="no-margin-padding white">Leave: {this.state.leave}</p>

                                    </div>
                                    <div>
                                        <SingleDatePicker
                                            date={this.state.date}
                                            onDateChange={date => {
                                                this.setState({ date: date })
                                                // this.getSelectedDate()
                                                this.dateChanged(date);


                                            }}
                                            focused={this.state.focused}
                                            onFocusChange={({ focused }) => this.setState({ focused })}
                                            id="your_unique_id"
                                            isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                            numberOfMonths="1"
                                        />


                                        {this.state.checked && <h3 className="green btn-white" onClick={() => { this.submitAttendance() }} >Submit</h3>}




                                    </div>
                                </div>
                            </div>
                            <div >
                                {/*                                 
                                {attendance.map(day => {
                                    
                                    if (day.date == this.state.selectedDate){
                                        
                                        if (day.attendance.length == 0) {
                                            return (
                                                <div className="container-body">
                                                    {this.state.students.map( student =>{
                                                        return (
                                                            <div className="student-box">
                                                                <img src={studentImg} className="student-icon" ></img>
                                                                <p>{student.studentName}</p>
                                                                <div className="flex-justify" style={{marginTop: '-30px'}}>
                                                                        <div>
                                                                            <p>P</p>
                                                                            <div className="checkbox">
                                                                            <img src={checkmark} className={this.state.checkbox}></img>
    
                                                                            </div>
                                                                            
    
                                                                        </div>
                                                                        <div>
                                                                            <p>A</p>
                                                                            <div className="checkbox">
                                                                            <img></img>
    
                                                                            </div>
    
                                                                        </div>
                                                                        <div>
                                                                            <p>L</p>
                                                                            <div className="checkbox">
                                                                            <img></img>
    
                                                                            </div>
    
                                                                        </div>
    
                                                                    </div>

                                                            </div>
                                                        )
                                                    })

                                                    }

                                                </div>
                                            )

                                        } else {
                                            return ( */}
                                <div className="container-body">
                                    {
                                        this.state.attendance.map(student => {
                                            return (
                                                <div className="student-box-t" >
                                                    <img src={studentImg} className="student-icon" ></img>
                                                    <p style={{ height: '35px' }} className="student-box-name">{student.studentName}</p>
                                                    <div className="flex-justify attendance-ticks" >
                                                        <div >
                                                            <p>P</p>
                                                            <div className="checkbox-t" onClick={() => {
                                                                student.status = 1;
                                                                this.setState({ attendance: attendance, checked: true })
                                                            }} >
                                                                <img src={checkmark} className={student.status == 1 ? 'checkmark' : 'hidden'}></img>

                                                            </div>


                                                        </div>
                                                        <div >
                                                            <p>A</p>
                                                            <div className="checkbox-t" onClick={() => {
                                                                student.status = 0;
                                                                this.setState({ attendance: attendance, checked: true })
                                                            }} >
                                                                <img src={checkmark} className={student.status == 0 ? 'checkmark' : 'hidden'}></img>

                                                            </div>

                                                        </div>
                                                        <div >
                                                            <p>L</p>
                                                            <div className="checkbox-t" onClick={() => {
                                                                student.status = 2;
                                                                this.setState({ attendance: attendance, checked: true })
                                                            }} >
                                                                <img src={checkmark} className={student.status == 2 ? 'checkmark' : 'hidden'}></img>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>
                                            )
                                        })
                                    }
                                </div>

                                {/* //             )

                                //         }
                                        
                                        
                                //     }
                                // })

                                // } */}
                            </div>

                        </div>
                        <div className="box-container">
                            <div className="container-header">
                                <h3 className="white center">Class Work</h3>
                                <h4 className="white center">Type Of Work: </h4>
                            </div>
                            <div className="container-body">

                                {this.state.Tests.slice(0).reverse().map(test => {
                                    return (


                                        <div className="test-box" >
                                            <Link to={{
                                                pathname: '/teacher/test',
                                                state: {
                                                    test: test,
                                                    classId: this.state.classId

                                                }

                                            }}>
                                                <div className="test-box-header" style={{ color: "#4CBB17" }}>
                                                    <img src={testImg} className="test-icon"></img>
                                                    <h5 className="no-margin-padding">{test.title}</h5>
                                                    <h5 className="no-margin-padding">Subject: {test.subjectName}</h5>
                                                    <h5 className="no-margin-padding">Date: {test.date.slice(0, 10)}</h5>


                                                </div>
                                                <hr />
                                                <div className="test-box-body" >
                                                    <div style={{ width: '100%', textAlign: 'center', borderRight: '1px solid black', padding: '10px', color: "#4CBB17" }}>
                                                        <h5 className="no-margin-padding">M.C.Qs</h5>
                                                        <h5 className="no-margin-padding">{test.multiChoiceList != undefined ? test.multiChoiceList.length : ''}</h5>
                                                    </div>
                                                    <div style={{ width: '100%', textAlign: 'center', borderRight: '1px solid black', padding: '10px', color: "#4CBB17" }}>
                                                        <h5 className="no-margin-padding">Short Questions</h5>
                                                        <h5 className="no-margin-padding">{test.shortsList != undefined ? test.shortsList.length : ''}</h5>

                                                    </div>
                                                    <div style={{ width: '100%', textAlign: 'center', padding: '10px', color: "#4CBB17" }}>
                                                        <h5 className="no-margin-padding">Content Questions</h5>
                                                        <h5 className="no-margin-padding"></h5>

                                                    </div>

                                                </div>
                                                <hr />
                                                <div className="test-box-footer" style={{ color: "#4CBB17" }}>
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
                    <div className="mid-grid" >
                        <div className="box-container">
                            <div className="container-header">
                                <h3 className="white center">Announcement For Students</h3>
                                <div className="justify-between padding-sides-20">
                                    <div>


                                    </div>
                                    <div>
                                        <Link to={{
                                            pathname: '/teacher/create-announcement',
                                            state: {
                                                classId: this.state.classId

                                            }
                                        }} >
                                            <h3 className="green btn-white">Add Announcement</h3>
                                        </Link>

                                    </div>
                                </div>
                            </div>
                            <div className="container-body">
                                {this.state.announcements.slice(0).reverse().map(announcement => {

                                    return (
                                        <div className="announcement-box-sm" >
                                            <div className="announcement-box-grid">

                                                <div>

                                                    {announcement.contentList != undefined ? announcement.contentList.map(img => {
                                                        return (
                                                            <img src={img.fileUri} className="announcement-img" style={{ marginTop: '10px' }}></img>
                                                        )
                                                    }) : <img src={announcementImg} className="announcement-img" style={{ marginTop: '10px' }}></img>}
                                                </div>
                                                <div>
                                                    <p>{announcement.announDescription}</p>
                                                    <div style={{ textAlign: 'right' }}>
                                                        
                                                         <p className="red no-margin-padding">{announcement.annoucementfor != null ? "Principal" : "Teacher"}</p>

                                                        <p className="green no-margin-padding">{announcement.teacherName}</p>
                                                        <p className="green no-margin-padding">{announcement.announcDate}</p>

                                                    </div>
                                                </div>


                                            </div>

                                        </div>
                                    )
                                })

                                }

                            </div>

                        </div>
                        <div className="box-container">
                            <div className="container-header">
                                <h3 className="white center">Fee Section Of Students</h3>
                            </div>
                            <div className="container-body">
                                {this.state.fee.map(student => {
                                    return (
                                        <div style={{height:'150px'}} className="student-box-t">
                                            <img src={studentImg} className="student-icon" ></img>
                                            <p style={{marginBottom:'5px'}}>{student.studentName}</p>
                                            <p style={{marginTop:'0px',fontWeight:'bold'}}>PKR {student.fee}</p>


                                            <h5 className={student.status == true ? 'paid' : 'un-paid'} onClick={() => { this.studentFee(student) }} >{student.status == true ? 'PAID' : 'UN PAID'}</h5>
                                            <p style={{ marginTop: '-15px' }}>{student.date}</p>

                                        </div>
                                    )
                                })

                                }

                            </div>

                        </div>

                    </div>

                    <div className="student-progress" >
                        <div className="box-container" >
                            <div className="container-header">
                                <h3 className="white center">Yearly Progress Of Students</h3>
                            </div>
                            <div className="container-body">
                                {this.state.students.map(student => {
                                    return (
                                        <div className="student-box-t">
                                            <img src={studentImg} className="student-icon"></img>
                                            <p style={{ height: '35px', marginTop: '14px' }}>{student.userName}</p>
                                            <h5 className={student.status == true ? 'paid' : 'un-paid margin'} onClick={() => { this.studentProgress(student) }} >{student.status == true ? 'PASS' : 'FAIL'}</h5>
                                        </div>
                                    )
                                })

                                }

                            </div>
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

        )
    }
}
export default dashboardComponent;