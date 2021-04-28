import React, { Component } from 'react';
import './AppEx.css';
import '../config';
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import totalfee from '../ImagesEx/totalfee.png'
import collected from '../ImagesEx/collected.png'
import remaining from '../ImagesEx/remaining.png'
import month from '../ImagesEx/month.png'
import classroom from '../ImagesEx/class.png'
import teacherimg from '../ImagesEx/teacher.png'
import ic_inventory_stockdefault from '../ImagesEx/ic_inventory_stockdefault.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import * as moment from 'moment';
import teachericon from '../ImagesEx/teacherimg.png'
import { isInclusivelyBeforeDay } from 'react-dates'
import schoolBanner from '../ImagesEx/school-banner.png'
import ic_inventory_chair from '../ImagesEx/chair.png'
import ic_inventory_desk from '../ImagesEx/desk.png'
import ic_inventory_fan from '../ImagesEx/fan.png'
import ic_inventory_sofa from '../ImagesEx/sofa.png'
import ic_inventory_bulb from '../ImagesEx/light-bulb.png'
import ic_inventory_camera from '../ImagesEx/camera.png'
import ic_inventory_circularclock from '../ImagesEx/circular-clock.png'
import ic_inventory_data from '../ImagesEx/data.png'
import ic_inventory_delete from '../ImagesEx/delete.png'
import ic_inventory_mouse from '../ImagesEx/mouse.png'
import ic_inventory_shoerack from '../ImagesEx/shoe-rack.png'
import ic_inventory_socket from '../ImagesEx/socket.png'
import ic_inventory_television from '../ImagesEx/television.png'
import ic_inventory_blackboard from '../ImagesEx/white-board.png'
import MonthYearPicker from 'react-month-year-picker';
import calender from '../ImagesEx/calendar.png'
import Calendar from 'react-calendar';
import dashboardBanner from '../ImagesEx/dashboard-ex.png'


class schoolDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schoolName: '',
            schoolId: '',
            totalFee: 0,
            collectedFee: 0,
            remainingFee: 0,
            month: '',
            monthKey: `0${new Date().getMonth() + 1}-${new Date().getUTCFullYear()}`,
            teachers: [],
            classes: [],
            inventory: [],
            expenditure: [],
            inventoryEmpty: '',
            expenditureEmpty: '',
            Open: false,
            date: moment(),
            selectedDate: '',
            attendance: [],
            noAttendance: '',
            totalStudents: 0,
            monthNum: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            openCal: false,
            absentDates: [],
            presentDates: [],
            leaveDates: []





        }
    }
    async componentDidMount() {
        await this.setMonth();
        var monthKey = this.state.monthNum < 10 ? `0${this.state.monthNum}-${this.state.year}` : `${this.state.monthNum}-${this.state.year}`
        var month = `${new Date().toDateString().slice(3, 7)}`

        const { school, schoolId } = this.props.location.state;

        this.setState({ schoolName: school, schoolId: schoolId, monthKey, month })
        this.getTeachers()
        this.getSchoolDetails();
        this.getInventory();
        await this.getExpenditure();
        this.currentMonthExpenditure();



    }

    componentWillReceiveProps(nextProps) {
        const { school, schoolId } = nextProps.location.state;
        this.setState({ schoolName: school, schoolId: nextProps.match.params.id })
        this.getTeachers()
        this.getSchoolDetails();
        this.getInventory();
        this.getExpenditure();

    }


    async setMonth() {

        await this.setState({ month: moment().format('MMM') })

    }

    async setMonthKey() {
        var monthKey = this.state.monthNum < 10 ? `0${this.state.monthNum}-${this.state.year}` : `${this.state.monthNum}-${this.state.year}`
        // var month = `${new Date().toDateString().slice(3, 7)}`
        var month = new Date(this.state.year, this.state.monthNum - 1, "01").toDateString().slice(3, 7)
        await this.setState({ monthKey, month })

    }

    async getSchoolDetails() {

        this.setState({ totalFee: 0, collectedFee: 0, remainingFee: 0 })

        //total Fee 
        await firebase.database().ref("Fee").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    let { totalFee } = this.state;
                    totalFee = 0;
                    school.forEach(section => {
                        section.forEach(month => {


                            if (month.key == this.state.monthKey) {

                                month.forEach(student => {
                                    if (student.val().fee != null) {
                                        totalFee = totalFee + parseInt(student.val().fee, 10)

                                    }

                                })

                            }

                        })

                    })
                    this.setState({ totalFee })
                }

            })

        })

        //collected fee

        await firebase.database().ref("Fee").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    let { collectedFee } = this.state;
                    collectedFee = 0;
                    school.forEach(section => {
                        section.forEach(month => {

                            if (month.key == this.state.monthKey) {

                                month.forEach(student => {
                                    if (student.val().status == true && student.val().fee != null) {
                                        collectedFee = collectedFee + parseInt(student.val().fee, 10)
                                    }
                                })
                            }
                        })
                    })
                    this.setState({ collectedFee })
                }
            })
        })

        //remaining fee 
        let { remainingFee } = this.state;
        remainingFee = 0
        remainingFee = this.state.totalFee - this.state.collectedFee;
        this.setState({ remainingFee })


        //Teachers
        let { teachers } = this.state;
        teachers = []
        await firebase.database().ref("Teachers").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    school.forEach(teacher => {
                        teachers.push(teacher.val())


                    })
                }

            })

        })
        this.setState({ teachers })

        //Classes
        let { classes } = this.state;
        classes = []
        await firebase.database().ref("Classes").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    school.forEach(schoolclass => {
                        classes.push(schoolclass.val())


                    })
                }

            })

        })
        this.setState({ classes })

        //total Students 
        let { totalStudents } = this.state;
        totalStudents = 0;
        firebase.database().ref("Student").once("value").then(snapshot => {
            classes.forEach(Class => {
                snapshot.forEach(section => {
                    if (section.key == Class.id) {
                        section.forEach(Student => {
                            totalStudents = totalStudents + 1;
                        })
                    }
                })
            })
            this.setState({ totalStudents })
        })



    }

    async getTeachers() {
        let { teachers } = this.state;
        teachers = []
        await firebase.database().ref("Teachers").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    school.forEach(teacher => {
                        teachers.push(teacher.val())


                    })
                }

            })
            this.setState({ teachers })
            this.getAttendanceMonth()
        })

    }

    async getInventory() {
        this.setState({ inventoryEmpty: '' })
        let { inventory } = this.state;
        inventory = []
        await firebase.database().ref("Inventory").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    school.forEach(date => {
                        var month = date.key

                        month = month.slice(month.length - 7)

                        if (this.state.monthKey == month) {
                            date.forEach(item => {
                                inventory.push({
                                    title: item.val().title,
                                    present: item.val().presentItems,
                                    missing: item.val().missingItems,
                                    repairing: item.val().repairtingItems,
                                    icon: item.val().icon
                                })
                            })
                        }


                    })
                }

            })
            this.setState({ inventory })

            if (inventory == []) {
                this.setState({ inventoryEmpty: "No Items" })
            }



        })


    }

    currentMonthExpenditure() {
        console.log(this.state.expenditure)
        let cnt = 0
        this.state.expenditure.forEach(item => {
            cnt = cnt + item.price
        })

        return cnt
    }

    async getExpenditure() {
        this.setState({ expenditureEmpty: '' })
        let { expenditure } = this.state;
        expenditure = []
        await firebase.database().ref("Expenditure").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    school.forEach(date => {
                        var month = date.key

                        month = month.slice(month.length - 7)

                        if (this.state.monthKey == month) {
                            date.forEach(item => {
                                expenditure.push({
                                    title: item.val().thing,
                                    quantity: item.val().quantity,
                                    price: item.val().price,
                                    totalPrice: item.val().totalprice,
                                    icon: item.val().icon
                                })
                            })
                        }



                    })
                }

            })
            this.setState({ expenditure })

            if (expenditure == []) {
                this.setState({ inventoryEmpty: "No Items" })
            }



        })


    }

    handleDialog() {
        this.setState({ Open: !this.state.Open })

    }
    handleDialogClose() {
        this.setState({ Open: false })
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

    async getAttendanceMonth() {
        this.setState({ attendance: [], noAttendance: '' })
        // this.getSelectedDate(date);

        let { attendance } = this.state;
        attendance = []
        this.state.teachers.forEach(Teacher => {

            var present = 0;
            var absent = 0;
            var leave = 0;
            var unmarked = 0;

            firebase.database().ref("Attendance").once("value").then(snapshot => {


                snapshot.forEach(section => {

                    if (section.key == 'TeacherAttendance') {
                        section.forEach(school => {

                            if (school.key == this.state.schoolId) {

                                school.forEach(date => {
                                    var Datee = date.key;

                                    var month = Datee.slice(3);

                                    if (this.state.monthKey == month) {

                                        date.forEach(teacher => {

                                            if (teacher.val().studentName == Teacher.userName) {


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

                                attendance.push({
                                    name: Teacher.userName,
                                    Present: present,
                                    Absent: absent,
                                    Leave: leave,
                                    Unmarked: unmarked,
                                    id:Teacher.id


                                })
                                if (attendance.length == 0) {

                                    this.setState({ noAttendance: "No attendance marked for this day." })
                                    this.state.teachers.map(teacher => {
                                        attendance.push({
                                            name: teacher.userName,
                                            Present: '-',
                                            Absent: '-',
                                            Leave: '-',
                                            Unmarked: '-'
                                        })

                                    })
                                }

                                this.setState({ attendance })

                            }
                        })
                    }
                })


            })



        })

    }

    async getAttendance(date) {
        this.setState({ attendance: [], noAttendance: '' })
        this.getSelectedDate(date);
        await firebase.database().ref("Attendance").once("value").then(snapshot => {
            let { attendance } = this.state;
            snapshot.forEach(section => {
                if (section.key == 'TeacherAttendance') {
                    section.forEach(school => {
                        if (school.key == this.state.schoolId) {
                            school.forEach(date => {
                                if (date.key == this.state.selectedDate) {
                                    date.forEach(teacher => {
                                        var present = 0;
                                        var absent = 0;
                                        var leave = 0;
                                        var unmarked = 0;

                                        if (teacher.val().status == 0) {
                                            absent = 1
                                        } else if (teacher.val().status == 1) {
                                            present = 1
                                        } else if (teacher.val().status == -1) {
                                            unmarked = 1
                                        } else if (teacher.val().status == 2) {
                                            leave = 1
                                        }
                                        attendance.push({
                                            name: teacher.val().studentName,
                                            Present: present,
                                            Absent: absent,
                                            Leave: leave,
                                            Unmarked: unmarked,
                                            id:teacher.val().id
                                        })
                                    })
                                }

                            })
                        }
                    })
                }
            })

            this.setState({ attendance })


            if (attendance.length == 0) {

                this.setState({ noAttendance: "No attendance marked for this day." })
            }
        })
    }



    teachersSummary(id) {
        this.setState({ openCal: true })
        localStorage.setItem("teacherId", id)

        let { absentDates, presentDates, leaveDates } = this.state;

        absentDates = []
        presentDates = [],
            leaveDates = []


        firebase.database().ref("Attendance").once("value").then(snapshot => {


            snapshot.forEach(section => {

                if (section.key == 'TeacherAttendance') {
                    section.forEach(school => {

                        if (school.key == this.state.schoolId) {

                            school.forEach(date => {
                                var Datee = date.key;

                                var month = Datee.slice(3);

                                if (this.state.monthKey == month) {

                                    date.forEach(teacher => {

                                        if (teacher.val().id == id) {


                                            if (teacher.val().status == 1) {

                                                presentDates.push(teacher.val().date)

                                            } else if (teacher.val().status == 0) {
                                                absentDates.push(teacher.val().date)

                                            } else if (teacher.val().status == 2) {
                                                leaveDates.push(teacher.val().date)

                                            }

                                        }


                                    })
                                }

                            })



                        }
                    })
                }
            })

            this.setState({ absentDates, presentDates, leaveDates })
        })

        // firebase.database().ref("Attendance").once("value").then(snapshot => {
        //     snapshot.forEach(section => {

        //         if (section.key == 'TeacherAttendance') {
        //             section.forEach(school => {
        //                 if (school.key == this.state.schoolId) {
        //                     school.forEach(date => {
        //                         var Datee = date.key;
        //                         var month = Datee.slice(3);

        //                 if (this.state.monthKey == month) {
        //                     date.forEach(teacher => {
        //                         if (teacher.key == id) {

        //                             if (teacher.val().status == 1) {

        //                                 presentDates.push(teacher.val().date)

        //                             } else if (teacher.val().status == 0) {
        //                                 absentDates.push(teacher.val().date)

        //                             } else if (teacher.val().status == 2) {
        //                                 leaveDates.push(teacher.val().date)

        //                             }
        //                         }
        //                     })
        //                 }
        //             })
        //             }
        //             })

        //         }
        //         this.setState({ absentDates, presentDates, leaveDates })

        //     })
        // })

    }


    render() {

        return (
            <div className="dashboard-ex">
             
             <div className="dashboard-header-ex">
                    <img src={window.innerWidth >= 900 ? dashboardBanner : dashboardBanner} className="title-img-ex"></img>
                    {/* <h1 className="white title">Welcome To Your Dashboard</h1> */}

                </div>


                <div className="school-box-container">
                    <div className="finances-card">
                        <h4 className="regular">Total Students</h4>
                        <h2 className="regular">{this.state.totalStudents}</h2>

                    </div>
                    <div className="finances-card">
                        <h4 className="regular">Total Classes</h4>
                        <h2 className="regular">{this.state.classes.length}</h2>

                    </div>
                    <div className="finances-card">
                        <h4 className="regular">Total Teachers</h4>
                        <h2 className="regular">{this.state.teachers.length}</h2>

                    </div>
                    

                </div>



                <div className="school-box-container">
                    <div className="school-box">
                        <h2 className="green regular">Total Fee</h2>
                        <img src={totalfee} alt="total" className="school-box-img"></img>
                        <h2 className="green regular">{this.state.totalFee}</h2>
                    </div>

                    <div className="school-box">
                        <h2 className="green regular">Collected</h2>
                        <img src={collected} alt="collected" className="school-box-img"></img>
                        <h2 className="green regular">{this.state.collectedFee}</h2>
                    </div>

                    <div className="school-box">
                        <h2 className="green regular">Remaining</h2>
                        <img src={remaining} alt="remaining" className="school-box-img"></img>
                        <h2 className="green regular">{this.state.remainingFee}</h2>
                    </div>

                    <div className="school-box" onClick={() => { this.handleDialog() }} style={{ cursor: "pointer" }} >
                        <h2 className="green regular">Select Month</h2>
                        <img src={month} alt="month" className="school-box-img"></img>
                        <h2 className="green regular">{this.state.month}</h2>
                    </div>
                </div>


                <div className="school-mid-container">
                    <div className="school-classes">
                        <h2 className="green center regular">Classes</h2>
                        <h3 className="green center regular">Click on classes to view students</h3>
                        <div className="classes-list">
                            {this.state.classes.map((schoolclass) => {
                                return (

                                    <div className="class-box" style={{ justifyContent: 'space-between' }} onClick={() => {
                                        return <Redirect to='/executive/school/class' />
                                    }}>
                                        <div className='justify-left'>
                                            <img className="school-icons" src={classroom} alt="classroom"></img>
                                            <h2 className="green regular">{schoolclass.className}</h2>
                                        </div>

                                        <div className='small-text-container-ex '>

                                            <Link to={{
                                                pathname: `${window.location.pathname}/${schoolclass.className}`,
                                                state: {
                                                    className: schoolclass.className,
                                                    classId: schoolclass.id
                                                }
                                            }} ><h2 className='white small-text-ex' >View Attendance</h2>
                                            </Link >

                                            <Link to={{
                                                pathname: `${window.location.pathname}/tests`,
                                                state: {
                                                    className: schoolclass.className,
                                                    classId: schoolclass.id
                                                }
                                            }} ><h2 className='white small-text-ex' >View Tests</h2>
                                            </Link >


                                        </div>

                                    </div>


                                )
                            })}

                        </div>


                    </div>
                    <div className="school-teachers">
                        <h2 className="green center regular">Teachers</h2>
                        <div className="teachers-list">
                            {this.state.teachers.map((teacher) => {
                                return (
                                    <Link to={{
                                        pathname: `${window.location.pathname}/tests`,
                                        state: {
                                            teacherName: teacher.userName,
                                            teacherId: teacher.id

                                        }
                                    }} >

                                        <div className="teacher-box">
                                            <img className="school-icons" src={teacherimg} alt="teacher"></img>
                                            <h3 className="green regular">Miss {teacher.userName}</h3>
                                        </div>
                                    </Link>
                                )
                            })}

                        </div>

                    </div>
                </div>


                <div className="attendance-container" >
                    <h2 className="center green regular">Teacher Attendance</h2>
                    <div className="flex-justify">
                        <div className="flex">
                            <h3 className="green">Select Date: </h3>
                            <SingleDatePicker

                                date={this.state.date}
                                onDateChange={date => {
                                    this.setState({ date })
                                    this.getAttendance(date)
                                }}
                                focused={this.state.focused}
                                onFocusChange={({ focused }) => this.setState({ focused })}
                                id="custom-cal-ex"
                                // isOutsideRange={() => false}
                                isOutsideRange={day => !isInclusivelyBeforeDay(day, moment())}
                                numberOfMonths="1"

                            />
                        </div>

                    </div>
                    <div className="student-attendance-titles center" >
                        <h2 className="green">Teacher</h2>
                        <h2 className="green ">Present</h2>
                        <h2 className="green ">Absent</h2>
                        <h2 className="green ">Leave</h2>
                    </div>

                    <div className="inventory-values">
                        <h3 className="center regular" >{this.state.noAttendance}</h3>


                        {this.state.attendance.map(teacher => {

                            return (
                                <div className="student-attendance-box green">

                                    <div className="justify-left no-margin-padding">
                                        <img className="icon" src={teacherimg} alt="icon"></img>
                                        <h3 className=" center regular" >{teacher.name}</h3>


                                    </div>

                                    <h3 className=" center regular" >{teacher.Present}</h3>
                                    <h3 className=" center red regular" >{teacher.Absent}</h3>
                                    <h3 className=" center yellow regular" >{teacher.Leave}</h3>
                                    <label onClick={() => { this.teachersSummary(teacher.id) }}><img className='icon' src={calender}></img></label>


                                </div>
                            )
                        })

                        }

                    </div>

                    <div className="teacher-attendance-container padding-20">




                        {/* {this.state.attendance.map(teacher => {
                            return (
                                <div >
                                    <div className="teachers-box">
                                        <img className="school-box-img" src={teacherimg}></img>
                                        <h3 className="regular">Miss {teacher.name}</h3>
                                     
                                        <div className="justify-between no-margin-padding">
                                            <p className="no-margin-padding">Present:</p>
                                            <p className="no-margin-padding">{teacher.Present}</p>

                                        </div>
                                        <div className="justify-between no-margin-padding">
                                            <p className="no-margin-padding">Absent:</p>
                                            <p className="no-margin-padding">{teacher.Absent}</p>

                                        </div>
                                        <div className="justify-between no-margin-padding">
                                            <p className="no-margin-padding">Leave:</p>
                                            <p className="no-margin-padding">{teacher.Leave}</p>

                                        </div>


                                    </div>

                                </div>
                            )
                        })
                        } */}

                    </div>
                </div>





                <div className="school-inventory-container">
                    <h2 className="green center regular">Inventory</h2>

                    <div className="inventory-titles" >
                        <h2 className="green">Items</h2>
                        <h2 className="green ">Present</h2>
                        <h2 className="green ">Missing</h2>
                        <h2 className="green ">Repairing</h2>
                    </div>
                    <div className="inventory-values">
                        <h2 className="regular">{this.state.inventoryEmpty}</h2>

                        {this.state.inventory.map((item) => {

                            return (
                                <div className="inventory-item green">
                                    <div className="justify-left no-margin-padding">
                                        <img className="icon" src={item.icon === 'ic_inventory_fan' ? ic_inventory_fan : item.icon === 'ic_inventory_chair' ? ic_inventory_chair :
                                            item.icon === 'ic_inventory_desk' ? ic_inventory_desk : item.icon === 'ic_inventory_sofa' ? ic_inventory_sofa : item.icon === 'ic_inventory_bulb' ? ic_inventory_bulb :
                                                item.icon === 'ic_inventory_camera' ? ic_inventory_camera : item.icon === 'ic_inventory_circularclock' ? ic_inventory_circularclock : item.icon === 'ic_inventory_data' ? ic_inventory_data :
                                                    item.icon === 'ic_inventory_delete' ? ic_inventory_delete : item.icon === 'ic_inventory_mouse' ? ic_inventory_mouse : item.icon === 'ic_inventory_shoerack' ? ic_inventory_shoerack :
                                                        item.icon === 'ic_inventory_socket' ? ic_inventory_socket : item.icon === 'ic_inventory_television' ? ic_inventory_television : item.icon === 'ic_inventory_blackboard' ? ic_inventory_blackboard : ic_inventory_stockdefault} alt="icon"></img>
                                        <h3 className=" regular" >{item.title}</h3>

                                    </div>

                                    <h3 className=" center regular" >{item.present}</h3>
                                    <h3 className=" center regular" >{item.missing}</h3>
                                    <h3 className=" center regular" >{item.repairing}</h3>
                                </div>
                            )
                        })

                        }

                    </div>

                </div>

                <div className="school-inventory-container">
                    <h2 className="green center regular">Expenditure</h2>

                    <p className="green center">Your expenditure {this.currentMonthExpenditure()} PKR </p>


                    <div className="inventory-titles " >
                        <h2 className="green">Items</h2>
                        <h2 className="green">Quantity</h2>
                        <h2 className="green">Price</h2>
                        <h2 className="green">Total Price</h2>
                    </div>
                    <div className="inventory-values">
                        <h2 className="regular">{this.state.expenditureEmpty}</h2>

                        {this.state.expenditure.map((item) => {

                            return (
                                <div className="inventory-item green">
                                    <div className="justify-left no-margin-padding">
                                        <img className="icon" src={item.icon === 'ic_inventory_fan' ? ic_inventory_fan : item.icon === 'ic_inventory_chair' ? ic_inventory_chair :
                                            item.icon === 'ic_inventory_desk' ? ic_inventory_desk : item.icon === 'ic_inventory_sofa' ? ic_inventory_sofa : item.icon === 'ic_inventory_bulb' ? ic_inventory_bulb :
                                                item.icon === 'ic_inventory_camera' ? ic_inventory_camera : item.icon === 'ic_inventory_circularclock' ? ic_inventory_circularclock : item.icon === 'ic_inventory_data' ? ic_inventory_data :
                                                    item.icon === 'ic_inventory_delete' ? ic_inventory_delete : item.icon === 'ic_inventory_mouse' ? ic_inventory_mouse : item.icon === 'ic_inventory_shoerack' ? ic_inventory_shoerack :
                                                        item.icon === 'ic_inventory_socket' ? ic_inventory_socket : item.icon === 'ic_inventory_television' ? ic_inventory_television : item.icon === 'ic_inventory_blackboard' ? ic_inventory_blackboard : ic_inventory_stockdefault} alt="icon"></img>
                                        <h3 className=" regular" >{item.title}</h3>

                                    </div>

                                    <h3 className=" center regular" >{item.quantity}</h3>
                                    <h3 className=" center regular" >{item.price}</h3>
                                    <h3 className=" center regular" >{item.totalPrice}</h3>
                                </div>
                            )
                        })

                        }

                    </div>

                </div>

                <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                    this.handleDialogClose()

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
                                    this.setState({ year: year }, () => {
                                        this.setMonthKey()
                                        this.getInventory()
                                        this.getExpenditure()
                                        this.getSchoolDetails()
                                        this.getAttendanceMonth()
                                    })


                                }}
                                onChangeMonth={month => {
                                    this.setState({ monthNum: month }, () => {
                                        this.setMonthKey()
                                        this.getInventory()
                                        this.getExpenditure()
                                        this.getSchoolDetails()
                                        this.getAttendanceMonth()
                                    })


                                }}

                            />

                        </div>

                        {/* <div className="flex-justify center">
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'JAN', monthKey: '01-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>JAN</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'FEB', monthKey: '02-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>FEB</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'MAR', monthKey: '03-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>MAR</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'APR', monthKey: '04-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>APR</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'MAY', monthKey: '05-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>MAY</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'JUN', monthKey: '06-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>JUN</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'JUL', monthKey: '07-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>JUL</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'AUG', monthKey: '08-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>AUG</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'SEP', monthKey: '09-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>SEP</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'OCT', monthKey: '10-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>OCT</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'NOV', monthKey: '11-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>NOV</div>
                            <div className="btn-month" onClick={()=> {
                                this.setState({month: 'DEC', monthKey: '12-2020'})
                                this.handleDialog()
                                this.getInventory()
                                this.getExpenditure()
                                this.getSchoolDetails()
                                this.getAttendanceMonth()
                            }}>DEC</div>

                        </div> */}

                    </DialogContent>

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
                                }, () => this.teachersSummary(localStorage.getItem('teacherId')))
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

export default schoolDetails;