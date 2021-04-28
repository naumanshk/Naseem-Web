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
import studentimg from '../ImagesEx/employee@2x.png'
import { Link } from 'react-router-dom'
import teacherpurpleicon from '../ImagePrinci/teacher-purple-icon.svg'
import checkmark from '../Images/checkmark.png'
import MonthYearPicker from 'react-month-year-picker';

import classPurpleIcon from '../ImagePrinci/class-purple-icon.svg'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import { green, yellow } from '@material-ui/core/colors';

class teacherDetails extends Component {
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
            summaryattendance: [],

            date: moment(),
            month: 'Jan',
            monthKey: `0${new Date().getMonth() + 1}-${new Date().getUTCFullYear()}`,
            Open: false,

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
            selectedDate: '',
            organization: "",
            present: 0,
            absent: 0,
            leave: 0,
            unmarked: 0,
            monthNum: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            monthly: false

        }
    }

    componentDidMount() {
        var month = `${new Date().toDateString().slice(3, 7)} ${new Date().getFullYear()}`
        this.setState({ month: month })
        const { className, schoolId } = this.props.location.state;
        this.setState({ className: className, schoolId: schoolId });

        this.getTeachers()

    }


    handleDialog() {
        this.setState({ Open: !this.state.Open, monthly: true })

    }



    async getTeachers() {
        await firebase.database().ref("Teachers").once("value").then(snapshot => {
            let { teachers } = this.state;
            teachers = []
            snapshot.forEach(section => {
                if (section.key == this.state.schoolId) {
                    section.forEach(teacher => {
                        teachers.push(teacher.val())
                    })
                }
            })
            this.setState({ teachers })

            this.getAttendance(this.state.date)
        })
    }




    async getAttendanceMonth() {


        var month_year = this.state.monthNum < 10 ? `0${this.state.monthNum}-${this.state.year}` : `${this.state.monthNum}-${this.state.year}`
        console.log(month_year)
        let { summaryattendance } = this.state;
        summaryattendance = []
        this.state.teachers.forEach(Teacher => {

            var present = 0;
            var absent = 0;
            var leave = 0;
            var unmarked = 0;

            firebase.database().ref("Attendance").child('TeacherAttendance').once("value").then(snapshot => {


                snapshot.forEach(section => {


                    section.forEach(date => {
                        var Datee = date.key;

                        var month = Datee.slice(3);

                        
                        if (month_year == month) {
                            console.log(month)

                        }
                        if (month_year == month) {
                            date.forEach(teacher => {

                                if (teacher.val().id == Teacher.id) {


                                    if (teacher.val().status == 0) {
                                        absent = absent + 1;
                                    } else if (teacher.val().status == 1) {
                                        present = present + 1;
                                    } else if (teacher.val().status == 2) {
                                        leave = leave + 1;
                                    } else if (teacher.val().status == -1) {
                                        unmarked = unmarked + 1;
                                    }

                                }


                            })
                        }

                    })

                })

                summaryattendance.push({
                    studentName: Teacher.userName,
                    Id: Teacher.id,
                    Present: present,
                    Absent: absent,
                    Leave: leave,
                    Unmarked: unmarked,


                })
                if (summaryattendance.length == 0) {

                    this.setState({ noAttendance: "No attendance marked for this day." })
                    this.state.teachers.map(teacher => {
                        summaryattendance.push({
                            name: teacher.userName,
                            Id: teacher.id,
                            Present: '-',
                            Absent: '-',
                            Leave: '-',
                            Unmarked: '-'
                        })

                    })
                }
                console.log(summaryattendance)
                this.setState({ summaryattendance })


            })



        })

    }

    getAttendance(date) {
        this.getSelectedDate(date);
        let { attendance } = this.state;
        attendance = []
        var studentAttendance = {
            date: this.state.selectedDate,
            attendance: []
        }
        firebase.database().ref("Attendance").child('TeacherAttendance').once("value").then(snapshot => {
            snapshot.forEach(school => {
                console.log(school.key)


                if (school.key == this.state.schoolId) {

                    school.forEach(day => {
                        if (day.key == this.state.selectedDate) {
                            console.log('day')

                            day.forEach(teacher => {
                                console.log('student')
                                attendance.push({
                                    date: teacher.val().date,
                                    id: teacher.val().id,
                                    studentName: teacher.val().studentName,
                                    status: teacher.val().status
                                })
                            })

                        }

                    })
                }
            })
            console.log(attendance)
            if (attendance.length == 0) {
                this.setState({ attendanceMarked: false })

                this.state.teachers.forEach(teacher => {
                    attendance.push({
                        date: this.state.selectedDate,
                        id: teacher.id,
                        studentName: teacher.userName,
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
        let { present, absent, leave, unmarked } = this.state;
        present = 0;
        absent = 0;
        leave = 0;
        unmarked = 0

        this.state.attendance.forEach(teacher => {
            if (teacher.status == 1) {
                present = present + 1;

            } else if (teacher.status == 0) {
                absent = absent + 1;
            } else if (teacher.status == 2) {
                leave = leave + 1;
            } else if (teacher.status == -1) {
                unmarked = unmarked + 1;
            }
        })

        this.setState({ present, absent, leave, unmarked })


    }

    submitAttendance() {
        console.log(this.state.attendance)
        console.log(this.state.attendanceMarked)
        if (this.state.attendanceMarked == true) {


            this.state.attendance.forEach(teacher => {
                firebase.database().ref("Attendance").child('TeacherAttendance').child(this.state.schoolId).child(this.state.selectedDate).child(teacher.id).child("status").set(teacher.status).then(console.log('done'))
            })

        } else if (this.state.attendanceMarked == false) {

            this.state.attendance.forEach(teacher => {
                firebase.database().ref("Attendance").child('TeacherAttendance').child(this.state.schoolId).child(this.state.selectedDate).child(teacher.id).child("date").set(teacher.date).then(console.log('done'))
                firebase.database().ref("Attendance").child('TeacherAttendance').child(this.state.schoolId).child(this.state.selectedDate).child(teacher.id).child("id").set(teacher.id).then(console.log('done'))
                firebase.database().ref("Attendance").child('TeacherAttendance').child(this.state.schoolId).child(this.state.selectedDate).child(teacher.id).child("status").set(teacher.status).then(console.log('done'))
                firebase.database().ref("Attendance").child('TeacherAttendance').child(this.state.schoolId).child(this.state.selectedDate).child(teacher.id).child("studentName").set(teacher.studentName).then(console.log('done'))

            })

        }


    }

    getSelectedDate(date) {

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

    }

    setDate(date) {
        this.setState({ date })
    }


    render() {
        let attendance = this.state.attendance;

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

                    <div className="section-container-p" >
                        <h2 class='center purple'>Teachers Progress</h2>
                        <div className="flex-justify">
                            <div className="flex" >
                                <h3 className="purple">Select Specific Date: </h3>
                                <SingleDatePicker
                                    date={this.state.date}
                                    onDateChange={date => {
                                        this.setState({ date, monthly: false })
                                        this.state.summaryattendance.length = 0


                                        this.getAttendance(date)

                                    }}
                                    focused={this.state.focused}
                                    onFocusChange={({ focused }) => this.setState({ focused })}
                                    id="custom-cal-p"
                                    isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                    numberOfMonths="1"
                                />



                            </div>

                            <div className="flex">

                                {this.state.checked && <h3 onClick={() => { this.submitAttendance() }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', color: 'white', backgroundColor: '#6437A1', padding: '10px', borderRadius: '5px' }}> Submit</h3>}

                            </div>
                            <div className="flex">
                            <h3 onClick={() => {
                                    this.state.summaryattendance.length = 0, this.setState({ monthly: false }) 
                                }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', padding: '10px', borderRadius: '5px' } } className={this.state.monthly ? 'border-btn' : 'btn-fill'}>Mark Attendance </h3>
                                <h3 onClick={() => { this.handleDialog() }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', padding: '10px', borderRadius: '5px' }} className={this.state.monthly ? 'btn-fill' : 'border-btn'}>  Monthly Summary  </h3>
                           



                            </div>


                        </div>
                        <div className='flex-justify'>
                            <div className="flex">
                                <h4 style={{ paddingRight: 3 }} className='purple'>Total Teacher: </h4>
                                <h4 className="green">{this.state.teachers.length}</h4>
                            </div>
                            <div className="flex">
                                <h4 style={{ paddingRight: 3 }} className='purple'>Total Presents: </h4>
                                <h4 className="green">{this.state.present}</h4>
                            </div>
                            <div className="flex">
                                <h4 style={{ paddingRight: 3 }} className='purple'>Total Absents: </h4>
                                <h4 className="red">{this.state.absent}</h4>
                            </div>
                            <div className="flex">
                                <h4 style={{ paddingRight: 3 }} className='purple'>Total Leaves: </h4>
                                <h4 className="yellow">{this.state.leave}</h4>
                            </div>
                            <div className="flex">
                                <h4 style={{ paddingRight: 3 }} className='purple'>Unmarked: </h4>
                                <h4 className="red">{this.state.unmarked}</h4>
                            </div>



                        </div>
                        <hr></hr>
                        <div class="student-attendance-titles">
                            <h3 class="purple center regular x-small-font">Names</h3>
                            <h3 class="purple center regular x-small-font">Present</h3>
                            <h3 class="purple center regular x-small-font">Absent</h3>
                            <h3 class="purple center regular x-small-font">Leave</h3>
                        </div>

                        <div class='student-attendance-container'>
                            <h3 className="purple center">{this.state.attendance.length == 0 ? "No Attendance marked for this day." : ''} </h3>

                            {!this.state.monthly && this.state.attendance != null && this.state.attendance.map(teacher => {
                                return (
                                    <div class='student-attendance-box'>
                                        <div className="justify-left">
                                            <img src={studentimg} className="icon" ></img>
                                            <h4 className="center purple">{teacher.studentName}</h4>

                                        </div>
                                        <div class='flex' >

                                            <div className="checkbox-p" onClick={() => {
                                                teacher.status = 1;
                                                this.setState({ attendance: attendance, checked: true })
                                            }} >
                                                <img src={checkmark} className={teacher.status == 1 ? 'checkmark bg-succ' : 'hidden'}></img>

                                            </div>




                                        </div>
                                        <div class='flex' >

                                            <div className="checkbox-p" onClick={() => {
                                                teacher.status = 0;
                                                this.setState({ attendance: attendance, checked: true })
                                            }} >
                                                <img src={checkmark} className={teacher.status == 0 ? 'checkmark bg-red' : 'hidden'}></img>

                                            </div>




                                        </div>

                                        <div class='flex' >

                                            <div className="checkbox-p" onClick={() => {
                                                teacher.status = 2;
                                                this.setState({ attendance: attendance, checked: true })
                                            }} >
                                                <img src={checkmark} className={teacher.status == 2 ? 'checkmark bg-yellow' : 'hidden'}></img>

                                            </div>




                                        </div>



                                    </div>
                                )
                            })

                            }

                            {/* swaping tables view from daily attendance to monthly and vise varsa */}

                            {this.state.monthly && this.state.summaryattendance != null && this.state.summaryattendance.map(student => {
                                return (
                                    <div class='student-attendance-box'>
                                        <div className="justify-left">
                                            <img src={studentimg} className="icon" ></img>
                                            <h4 className="center purple">{student.studentName}</h4>

                                        </div>
                                        <h4 className=" center green">{student.Present}</h4>
                                        <h4 className=" center red">{student.Absent}</h4>
                                        <h4 className="center blue">{student.Leave}</h4>


                                    </div>
                                )
                            })

                            }
                        </div>
                    </div>


                    <div className="announcement-div">
                        <Announcements school={this.state.Notifications} />
                        <Drawer anchor="right" open={this.state.drawer} onClose={() => { this.setState({ drawer: false }) }} >
                            <Announcements school={this.state.Notifications} />
                        </Drawer>

                    </div>
                </div>

                {/* <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                    this.handleDialog()

                }} aria-labelledby="form-dialog-title">

                    <h1 className="center purple regular" >Select Month</h1>

                    <DialogContent>
                        <div className="flex-justify center">
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `JAN ${new Date().getFullYear()}`, monthKey: `01-${new Date().getFullYear()}` })
                                this.handleDialog()

                                this.getAttendanceMonth()
                            }}>JAN {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `FEB ${new Date().getFullYear()}`, monthKey: `02-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>FEB {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `MAR ${new Date().getFullYear()}`, monthKey: `03-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>MAR {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `APR ${new Date().getFullYear()}`, monthKey: `04-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>APR {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `MAY ${new Date().getFullYear()}`, monthKey: `05-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>MAY {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `JUN ${new Date().getFullYear()}`, monthKey: `06-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>JUN {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `JUL ${new Date().getFullYear()}`, monthKey: `07-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>JUL {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `AUG ${new Date().getFullYear()}`, monthKey: `08-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>AUG {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `SEP ${new Date().getFullYear()}`, monthKey: `09-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>SEP {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `OCT ${new Date().getFullYear()}`, monthKey: `10-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>OCT {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `NOV ${new Date().getFullYear()}`, monthKey: `11-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>NOV {new Date().getFullYear()}</div>
                            <div className="btn-month-p" onClick={() => {
                                this.setState({ month: `DEC ${new Date().getFullYear()}`, monthKey: `12-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>DEC {new Date().getFullYear()}</div>

                        </div>

                    </DialogContent>

                    <DialogActions className="dialog-btns">

                    </DialogActions>
                </Dialog> */}


                {/* Dialog box month/year filter */}
                <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                    this.handleDialog()

                }} aria-labelledby="form-dialog-title">

                    <h1 className="center purple regular" >Select Month</h1>

                    <DialogContent>
                        <div className="flex-justify center">
                            <MonthYearPicker
                                selectedMonth={this.state.monthNum}
                                selectedYear={this.state.year}
                                minYear={2000}
                                maxYear={2030}
                                onChangeYear={year => {
                                    this.setState({ year: year },()=>this.getAttendanceMonth())
                                }}
                                onChangeMonth={month => {
                                    this.setState({ monthNum: month ,Open:false},()=>this.getAttendanceMonth())
                                    

                                }}
                                style={{ color: '#6437A1' }}
                            />

                        </div>

                    </DialogContent>

                    <DialogActions className="dialog-btns">

                    </DialogActions>
                </Dialog>



            </div>



        )
    }
}
export default teacherDetails;