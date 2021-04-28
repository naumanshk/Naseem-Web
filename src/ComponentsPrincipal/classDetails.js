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
import Calendar from 'react-calendar';
import MonthYearPicker from 'react-month-year-picker';

import classPurpleIcon from '../ImagePrinci/class-purple-icon.svg'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import calender from '../ImagePrinci/calendar.png'
import { tr } from 'date-fns/locale';

class classDetails extends Component {
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
            month: 'Jan',
            monthKey: `${new Date().getMonth() + 1 < 10 ? 0 : ""}${new Date().getMonth() + 1}-${new Date().getUTCFullYear()}`,
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

            organization: "",
            openCal: false.userName,
            absentDates: [],
            presentDates: [],
            leaveDates: [],
            monthNum: new Date().getMonth() + 1,
            year: new Date().getFullYear(),

        }
    }

    componentDidMount() {
        var month = `${new Date().toDateString().slice(3, 7)} ${new Date().getFullYear()}`
        this.setState({ month: month })
        const { className, classId } = this.props.location.state;
        this.setState({ className: className, classId: classId });

        this.getStudents()
     
    


    }


    handleDialog() {
        this.setState({ Open: !this.state.Open })

    }

    handleCalDialog() {
        this.setState({ openCal: !this.state.openCal })

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

                                if (student.val().id == Student.id) {


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

    async getAttendance(date) {
        this.setState({ attendance: [], noAttendance: '' })

        this.getSelectedDate(date);



        await firebase.database().ref("Attendance").once("value").then(snapshot => {
            let { attendance, absentDates, presentDates, leaveDates } = this.state;
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

            this.setState({ attendance, })
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
                        <h2 class='center purple'>Students Progress</h2>
                        <div className="flex-justify">
                            <div className="flex" >
                                <h3 className="purple">Select Specific Date: </h3>
                                <SingleDatePicker
                              
                                    date={this.state.date}
                                    onDateChange={date => {
                                        this.setState({ date })


                                        this.getAttendance(date)

                                    }}
                                    focused={this.state.focused}
                                    onFocusChange={({ focused }) => this.setState({ focused })}
                                    id="custom-cal-p"
                                    isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                    numberOfMonths="1"
                                    style={{ color: '#6437A1' }}
                                
                                />

                            </div>


                            <div className="flex">
                                <h3 className="purple" >Select Month:  </h3>
                                <h3 onClick={() => { this.handleDialog() }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', color: 'white', backgroundColor: '#6437A1', padding: '10px', borderRadius: '5px' }}> {this.state.month}</h3>



                            </div>

                        </div>
                        <hr></hr>
                        <div class="student-attendance-titles-p">
                            <h3 class="purple center regular x-small-font">Names</h3>
                            <h3 class="purple center regular x-small-font">Present</h3>
                            <h3 class="purple center regular x-small-font">Absent</h3>
                            <h3 class="purple center regular x-small-font">Leave</h3>
                        </div>

                        <div class='student-attendance-container-p'>
                            <h3 className="purple center">{this.state.attendance.length == 0 ? "No Attendance marked for this day." : ''} </h3>
                            {this.state.attendance.map(student => {
                                return (
                                    <div class='student-attendance-box-p'>
                                        <div className="justify-left">
                                            <img src={studentimg} className="icon" ></img>
                                            <h4 className="center purple">{student.name}</h4>

                                        </div>
                                        <h4 className=" center green">{student.Present}</h4>
                                        <h4 className=" center red">{student.Absent}</h4>
                                        <h4 className="center blue">{student.Leave}</h4>
                                        {/* <Link to={{
                                            pathname: `${window.location.pathname}/result`,
                                            state: {
                                                name: student.name,
                                                studentId: student.Id,
                                                className: this.state.className,
                                                classId: this.state.classId
                                            }
                                        }} > */}
                                        {/* <div className="result-btn-p white">Show Results</div> */}
                                        <label onClick={() => { this.studentSummary(student.Id) }}><img className='icon' src={calender}></img></label>
                                        {/* </Link> */}


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

                    </DialogContent> */}

                    <DialogActions className="dialog-btns">

                    </DialogActions>
                </Dialog>

                <Dialog className="dialog" fullWidth="true" open={this.state.openCal} onClose={() => {
                    this.setState({ openCal: false })

                }} aria-labelledby="form-dialog-title">

                    <h1 className="center purple regular" >Monthly Summary</h1>

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