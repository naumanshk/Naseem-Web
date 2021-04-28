import React, { Component } from 'react';

import '../config';
import * as firebase from 'firebase'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import studentimg from '../ImagesEx/employee@2x.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import 'react-dates/lib/css/_datepicker.css';
import * as moment from 'moment';
import Calendar from 'react-calendar';
import MonthYearPicker from 'react-month-year-picker';
import dashboardBanner from '../ImagesEx/dashboard-ex.png'

import './AppEx.css';
import { Button } from '@material-ui/core';
import { isInclusivelyBeforeDay } from 'react-dates'
import classBanner from '../ImagesEx/class-banner.png'
import calender from '../ImagesEx/calendar2x.png'

class classDetails extends Component {
    constructor() {
        super();
        this.state = {
            className: '',
            classId: '',
            students: [],
            date: moment(),
            selectedDate: '',
            attendance: [],
            noAttendance: '',
            month: 'Jan',
            monthKey: `0${new Date().getMonth() + 1}-${new Date().getUTCFullYear()}`,
            Open: false,
            openCal: false,
            absentDates: [],
            presentDates: [],
            leaveDates: [],
            monthNum: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
        }
    }

    componentWillMount() {
        var month = `${new Date().toDateString().slice(3, 7)} ${new Date().getFullYear()}`
        this.setState({ month: month })
        console.log(month.slice(3, 7))
        const { className, classId } = this.props.location.state;
        this.setState({ className: className, classId: classId });
        this.getStudents()

        // this.getAttendance(this.state.date)


    }

    async getStudents() {
        await firebase.database().ref("Student").once("value").then(snapshot => {
            let { students } = this.state;
            students = []
            snapshot.forEach(section => {
                if (section.key == this.state.classId) {
                    section.forEach(student => {
                        students.push(student.val())
                    })
                }
            })
            this.setState({ students })

            this.getAttendanceMonth()
        })
    }

    wait(ms) {
        var start = new Date().getTime();
        var end = start;
        while (end < start + ms) {
            end = new Date().getTime();
        }
    }

    async getAttendance(date) {
        this.setState({ attendance: [], noAttendance: '' })

        this.getSelectedDate(date);



        await firebase.database().ref("Attendance").once("value").then(snapshot => {
            let { attendance } = this.state;
            attendance = []
            snapshot.forEach(section => {
                if (section.key == this.state.classId) {
                    section.forEach(date => {
                        if (date.key == this.state.selectedDate) {
                            date.forEach(student => {
                                var present = 0;
                                var absent = 0;
                                var leave = 0;
                                var unmarked = 0;
                                if (student.val().status == 0) {
                                    absent = 1;
                                } else if (student.val().status == 1) {
                                    present = 1;
                                } else if (student.val().status == -1) {
                                    unmarked = 1;
                                } else if (student.val().status == 2) {
                                    leave = 1;
                                }
                                attendance.push({
                                    name: student.val().studentName,
                                    Present: present,
                                    Absent: absent,
                                    Leave: leave,
                                    Unmarked: unmarked

                                })
                            })
                        }
                    })
                }
            })



            if (attendance.length == 0) {

                this.setState({ noAttendance: "No attendance marked for this day." })
                this.state.students.map(student => {
                    attendance.push({
                        name: student.userName,
                        Present: '-',
                        Absent: '-',
                        Leave: '-',
                        Unmarked: '-'
                    })

                })
            }

            this.setState({ attendance })
        })
    }

    async getAttendanceMonth() {



        let { attendance } = this.state;
        attendance = []
        this.state.students.forEach(Student => {

            var present = 0;
            var absent = 0;
            var leave = 0;
            var unmarked = 0;

            firebase.database().ref("Attendance").once("value").then(snapshot => {


                snapshot.forEach(section => {


                    section.forEach(date => {
                        var Datee = date.key;

                        var month = Datee.slice(3);

                        if (this.state.monthKey == month) {

                            date.forEach(student => {

                                if (student.val().studentName == Student.userName) {


                                    if (student.val().status == 0) {
                                        absent = absent + 1;
                                    } else if (student.val().status == 1) {
                                        present = present + 1;
                                    } else if (student.val().status == 2) {
                                        leave = leave + 1;
                                    } else if (student.val().status == -1) {
                                        unmarked = unmarked + 1;
                                    }

                                }


                            })
                        }

                    })

                })

                attendance.push({
                    name: Student.userName,
                    Id: Student.id,
                    Present: present,
                    Absent: absent,
                    Leave: leave,
                    Unmarked: unmarked,


                })
                if (attendance.length == 0) {

                    this.setState({ noAttendance: "No attendance marked for this day." })
                    this.state.students.map(student => {
                        attendance.push({
                            name: student.userName,
                            Id: student.id,
                            Present: '-',
                            Absent: '-',
                            Leave: '-',
                            Unmarked: '-'
                        })

                    })
                }
                console.log(attendance)
                this.setState({ attendance })


            })



        })

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

    handleDialog() {
        this.setState({ Open: !this.state.Open })

    }

    studentSummary(studentId) {
        this.setState({ openCal: true })
        localStorage.setItem("studentId", studentId)

        let { absentDates, presentDates, leaveDates } = this.state;

        absentDates = []
        presentDates = [],
            leaveDates = []

        firebase.database().ref("Attendance").once("value").then(snapshot => {
            snapshot.forEach(Class => {

                if (Class.key == this.state.classId) {
                    Class.forEach(date => {
                        var Datee = date.key;
                        var month = Datee.slice(3);

                        if (this.state.monthKey == month) {
                            date.forEach(student => {
                                if (student.key == studentId) {

                                    if (student.val().status == 1) {

                                        presentDates.push(student.val().date)

                                    } else if (student.val().status == 0) {
                                        absentDates.push(student.val().date)

                                    } else if (student.val().status == 2) {
                                        leaveDates.push(student.val().date)

                                    }
                                }
                            })
                        }
                    })
                }
                this.setState({ absentDates, presentDates, leaveDates })

            })
        })

    }

    render() {
        return (
            <div className="dashboard-ex regular" >
                     <div className="dashboard-header-ex">
                    <img src={window.innerWidth >= 900 ? dashboardBanner : dashboardBanner} className="title-img-ex"></img>
                    {/* <h1 className="white title">Welcome To Your Dashboard</h1> */}

                </div>


                <div className="students-container" >
                    <h2 className="green">Student Attendance</h2>
                    <div className="flex-justify">
                        <div className="flex" >
                            <h3 className="green">Select Specific Date: </h3>
                            <SingleDatePicker
                                date={this.state.date}
                                onDateChange={date => {
                                    this.setState({ date })


                                    this.getAttendance(date)

                                }}
                                focused={this.state.focused}
                                onFocusChange={({ focused }) => this.setState({ focused })}
                                id="custom-cal-ex"
                                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                numberOfMonths="1"
                            />

                        </div>

                        {/* </div>
                    
                    <div className="flex-justify"> */}
                        <div className="flex">
                            <h3 className="green" >Select Month:  </h3>
                            <h3 onClick={() => { this.handleDialog() }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', color: 'white', backgroundColor: 'green', padding: '10px', borderRadius: '5px' }}> {this.state.month}</h3>



                        </div>

                    </div>
                    <hr />

                    <div className="student-attendance-titles">
                        <h3 className="green regular" >Names</h3>
                        <h3 className="green regular" >Present</h3>
                        <h3 className="green regular" >Absent</h3>
                        <h3 className="green regular" >Leave</h3>

                    </div>
                    <div className="student-attendance-container">
                        <h3 className="green">{this.state.attendance.length == 0 ? "No Attendance marked for this day." : ''} </h3>
                        {this.state.attendance.map(student => {
                            return (
                                <div>


                                    <div className="student-attendance-box">
                                        <div className="justify-left">
                                            <img src={studentimg} className="icon" ></img>
                                            <h4 className="green">{student.name}</h4>

                                        </div>
                                        <h4 className="green">{student.Present}</h4>
                                        <h4 className="red">{student.Absent}</h4>
                                        <h4 className="blue">{student.Leave}</h4>
                                        <label onClick={() => { this.studentSummary(student.Id) }}><img className='icon' src={calender}></img></label>

                                        {/* <Link to={{
                                            pathname: `${window.location.pathname}/result`,
                                            state: {
                                                name: student.name,
                                                studentId: student.Id,
                                                className: this.state.className,
                                                classId: this.state.classId
                                            }
                                        }} >
                                            <div className="result-btn green">Show Result</div>
                                        </Link> */}


                                    </div>




                                </div>
                            )
                        })

                        }
                    </div>

                </div>

                <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                    this.handleDialog()

                }} aria-labelledby="form-dialog-title">

                    <h1 className="center green regular" >Select Month</h1>

                    <DialogContent>
                        <div className="flex-justify center">
                            <MonthYearPicker
                                selectedMonth={this.state.monthNum}
                                selectedYear={this.state.year}
                                minYear={2000}
                                maxYear={2030}
                                onChangeYear={year => {

                                    this.setState({ year: year, monthKey: `${this.state.monthNum < 10 ? 0 : ""}${this.state.monthNum}-${year}` }, () => {
                                        this.getAttendanceMonth()

                                    })


                                }}
                                onChangeMonth={month => {
                                    this.setState({ monthNum: month, monthKey: `${month + 1 < 10 ? 0 : ""}${month}-${this.state.year}` }, () => {
                                        this.getAttendanceMonth()
                                        this.handleDialog()
                                    })


                                }}
                                style={{ color: '#6437A1' }}
                            />

                        </div>

                    </DialogContent>

                    {/* <DialogContent>
                        <div className="flex-justify center">
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `JAN ${new Date().getFullYear()}`, monthKey: `01-${new Date().getFullYear()}` })
                                this.handleDialog()

                                this.getAttendanceMonth()
                            }}>JAN {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `FEB ${new Date().getFullYear()}`, monthKey: `02-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>FEB {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `MAR ${new Date().getFullYear()}`, monthKey: `03-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>MAR {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `APR ${new Date().getFullYear()}`, monthKey: `04-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>APR {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `MAY ${new Date().getFullYear()}`, monthKey: `05-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>MAY {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `JUN ${new Date().getFullYear()}`, monthKey: `06-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>JUN {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `JUL ${new Date().getFullYear()}`, monthKey: `07-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>JUL {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `AUG ${new Date().getFullYear()}`, monthKey: `08-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>AUG {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `SEP ${new Date().getFullYear()}`, monthKey: `09-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>SEP {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `OCT ${new Date().getFullYear()}`, monthKey: `10-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>OCT {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `NOV ${new Date().getFullYear()}`, monthKey: `11-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>NOV {new Date().getFullYear()}</div>
                            <div className="btn-month" onClick={() => {
                                this.setState({ month: `DEC ${new Date().getFullYear()}`, monthKey: `12-${new Date().getFullYear()}` })
                                this.handleDialog()
                                this.getAttendanceMonth()
                            }}>DEC {new Date().getFullYear()}</div>

                        </div>

                    </DialogContent> */}

                    <DialogActions className="dialog-btns">

                    </DialogActions>
                </Dialog>


                <Dialog className="dialog" fullWidth="true" open={this.state.openCal} onClose={() => {
                    this.setState({ openCal: false })

                }} aria-labelledby="form-dialog-title">

                    <h1 className="center green regular" >Monthly Summary</h1>

                    <DialogContent style={{ margin: 'auto' }}>
                        <Calendar

                            nextLabel={null}
                            next2Label={null}
                            prev2Label={null}
                            prevLabel={null}
                            onViewChange={e => {

                                this.setState({
                                    monthKey: `${e.activeStartDate.getMonth() + 1 < 10 ? 0 : ""}${e.activeStartDate.getMonth() + 1}-${e.activeStartDate.getFullYear()}`,
                                }, () => this.studentSummary(localStorage.getItem('studentId')))
                            }}
                            value={new Date()}
                            tileClassName={({ date, view }) => {

                                if (this.state.absentDates.find(x => x == moment(date).format("DD-MM-YYYY"))) {

                                    return 'light'
                                }
                                if (this.state.presentDates.find(x => x == moment(date).format("DD-MM-YYYY"))) {
                                    return 'green'
                                }
                                if (this.state.leaveDates.find(x => x == moment(date).format("DD-MM-YYYY"))) {
                                    return 'yellow'
                                }

                            }}




                        />

                    </DialogContent>

                    <DialogActions className="dialog-btns">

                    </DialogActions>
                </Dialog>

            </div>

        )
    }
}

export default classDetails;