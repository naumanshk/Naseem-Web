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
import MonthYearPicker from 'react-month-year-picker';

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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import class_ico from '../ImagePrinci/class.png'
import user_ico from '../ImagePrinci/username.png'
import expense_ico from '../ImagePrinci/expense.png'
import dollar from '../ImagePrinci/dollar.png'
import paper from '../ImagePrinci/show result.png'
import calendar_ico from '../ImagePrinci/calendar.png'



class feeDetails extends Component {
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
            selectedDate: moment(),
            totalstudent: 0,
            totalclasses: 0,
            totalteachers: 0,
            classId: '',
            Tests: [],
            fee: [],
            totalFee: 0,
            remainingFee: 0,
            announcements: [],
            drawer: false,
            attendanceMarked: true,
            Notifications: [],
            checked: false,

            organization: "",
            open: false,
            addFee: false,
            updateFee: false,
            studentfee: "",
            discount: "",
            reason: "",
            feedate: "",
            expense: "",
            selectedStudent: [],
            err: false,
            filter: false,
            monthNum:new Date().getMonth()+1,
            year:new Date().getFullYear(),
            month_year:""


        }
    }

    componentDidMount() {
        console.log(new Date().toString().slice(3, 7))

        const { className, classId } = this.props.location.state;
        this.setState({ className: className, classId: classId});
        this.getSelectedDate()
        this.getStudents()
    }

     getSelectedDate() {
       
        return new Promise((resolve, reject) => {
            let { month_year } = this.state;
            let { date } = this.state;
           
            var month = this.state.monthNum;
            var year = this.state.year;
         
            if (month < 10) {
                month = '0' + month;
            }
            month_year =  month + '-' + year;

            this.setState({ month_year },()=>   this.getFees())
        
        })


    }


    getFees() {
        let { fee } = this.state;
        fee = []
        var totalFee = 0
        var remainingFee = 0

        firebase.database().ref("Fee").once("value").then(snapshot => {

            snapshot.forEach(school => {
                school.forEach(section => {
                    if (section.key == this.state.classId) {
                        console.log(section.val())


                        section.forEach(date => {
                            if (date.key == this.state.month_year) {
                                console.log(date.val())
                                date.forEach(student => {
                                    totalFee = Number(totalFee) + Number(student.val().fee)
                                    if (!student.val().status) {
                                        remainingFee = Number(remainingFee) + Number(student.val().fee)
                                    }

                                    fee.push(student.val())
                                })
                            }
                        })
                    }
                })



            })
            this.setState({ fee, totalFee, remainingFee })
            console.log(fee)

        })

    }

    getStudents() {
        firebase.database().ref("Student").once("value").then(snapshot => {
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



        })
    }

    studentFee(student) {
        let { fee } = this.state;
        if (student.status == false) {

            
            firebase.database().ref("Fee").child(localStorage.getItem("schoolId")).child(this.state.classId).child(this.state.month_year).child(student.id).child("status").set(true)

            fee.forEach(Student => {
                if (Student.id == student.id) {
                    Student.status = true
                }
            })
            this.setState({ fee })
        } 
        else {
            firebase.database().ref("Fee").child(localStorage.getItem("schoolId")).child(this.state.classId).child(this.state.month_year).child(student.id).child("status").set(false)
            fee.forEach(Student => {
                if (Student.id == student.id) {
                    Student.status = false
                }
            })
            this.setState({ fee })
        }
    }

    openForm() {
        this.setState({ open: !this.state.open })
    }
    handleDialog() {
        this.setState({ filter: !this.state.filter })

    }

    dateChange(e) {
        let date = e;
        var day = new Date(date).getDate();
        var month = new Date(date).getMonth() + 1;
        var year = new Date(date).getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        var selectedDate = day + '-' + month + '-' + year;
        this.setState({ selectedDate })
        console.log(selectedDate.slice(3, 10))
    }


    addFee() {
        if (this.state.selectedDate == "" || this.state.discount == "" || this.state.expense == "" || this.state.studentfee == "" || this.state.selectedStudent == "" || this.state.reason == "") {

            this.setState({ err: true })

        }
        else {
            firebase.database().ref("Fee").child(localStorage.getItem("schoolId")).child(this.state.classId).child(this.state.selectedDate.slice(3, 10)).child(this.state.selectedStudent[0]).set({



                date: this.state.selectedDate,
                discount: this.state.discount,
                fee: this.state.studentfee,
                id: this.state.selectedStudent[0],
                otherExpence: this.state.expense,
                reason: this.state.reason,
                status: false,
                studentName: this.state.selectedStudent[1]
            }).then(window.location.reload())
        }
    }

    render() {
        let attendance = this.state.attendance;
        let students = this.state.students

        return (
            <div className="dashboard-principal">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                        {/* <h1 className="center header-main-p">Welcome To Your Dashboard</h1> */}
                        <img src={principalHeader} className="header-img-p "></img>
                        {/* <div style={{ height: '98%', width: '100%' }} class='gradiant-p absolute no-margin'></div> */}
                    </div>



                    <div style={{ marginTop: '40px' }} className="justify-center flex flex-responsive padding-sides-20 margin-bottom-10 width-100 margin-auto" >


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





                    </div>

                    <div className='container flex justify-center'>


                        {/* list of classes */}
                        <div className="section-container-p width-80 width-100" >
                            <h2 class='center purple relative'>Students Fees  <Icon onClick={e => {
                                this.openForm()
                                this.setState({ addFee: true })
                            }} style={{ float: 'right', cursor: 'pointer', right: '15px' }} className="fa fa-plus-circle absolute purple" /></h2>
                            <div className="flex justify-center">

                                <h3 className="purple" >Select Month:  </h3>
                                <h3 onClick={() => { this.handleDialog() }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', color: 'white', backgroundColor: '#6437A1', padding: '10px', borderRadius: '5px' }}> {this.state.monthNum <= 9 ? 0 : ""}{this.state.monthNum}-{this.state.year}</h3>



                            </div>

                            <hr></hr>
                            <div class="student-fee-titles ">
                                <h3 class="purple center regular x-small-font">Names</h3>
                                <h3 class="purple center regular x-small-font">Date</h3>
                                <h3 class="purple center regular x-small-font">Amount</h3>

                                <h3 class="purple center regular x-small-font">Status</h3>
                                <h3 class="red center regular"> </h3>

                                <h3></h3>

                            </div>

                            <div class='student-attendance-container'>



                                {/* {/* <h3 className="purple center">{this.state.attendance.length == 0 ? "No Attendance marked for this day." : ''} </h3> */}
                                {this.state.fee.map(fee => {
                                    return (

                                        <div class='student-fee-box'>
                                            <div className="justify-left">
                                                <img src={studentimg} className="icon x-small-font" ></img>
                                                <h4 className="center purple x-small-font">{fee.studentName}</h4>

                                            </div>
                                            <h4 className=" center purple x-small-font">{fee.date}</h4>
                                            <h4 className=" center purple x-small-font">Rs./ {fee.fee}</h4>

                                            <h4 className={fee.status ? " center green x-small-font" : " center red x-small-font"} onClick={() => { this.studentFee(fee) }}>{fee.status ? "Paid" : "Unpaid"}</h4>
                                            <Icon style={{ cursor: 'pointer' }} onClick={e => {
                                                this.openForm()
                                                this.setState({ updateFee: true, selectedStudent: [fee.id, fee.studentName], studentfee: fee.fee, discount: fee.discount, expense: fee.otherExpence, selectedDate: fee.date, reason: fee.reason })
                                            }} className='fa fa-edit margin-auto x-small-font' />




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

                    <Dialog  fullWidth="true" open={this.state.open} onClose={e => this.setState({ err: false, open: false, updateFee: false, addFee: false, selectedStudent: [], studentfee: '', discount: '', expense: '', selectedDate: '', reason: '' })} aria-labelledby="form-dialog-title">
                        <img src={book} style={{ alignSelf: 'center', marginTop: '20px', backgroundColor: 'unset' }} className="icon" ></img>
                        <DialogTitle className="center purple" id="form-dialog-title">Student Fee Vouchere</DialogTitle>
                        <DialogContent  >

                            <div class='width-80 margin-auto margin-bottom-10'>
                                {this.state.err && <h3 className="red">Please Fill all the fileds!</h3>}

                                <InputLabel htmlFor="input-with-icon-adornment">Class</InputLabel>
                                <Input
                                    value={this.state.className}
                                    style={{ width: '100%' }}
                                    disabled
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={class_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>
                                    }
                                />

                            </div>
                            {this.state.addFee && <div class='width-80 margin-auto margin-bottom-10'>

                                <InputLabel id="demo-simple-select-label">Select Students</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    fullWidth
                                    onChange={e => {
                                        this.setState({ selectedStudent: e.target.value.toString().split(',') })

                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={user_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>
                                    }

                                >
                                    {this.state.students.map(student => {
                                        return (<MenuItem value={`${student.id},${student.userName}`} defaultValue={student.userName} >{student.userName}</MenuItem>)
                                    })}

                                </Select>

                            </div>}
                            {this.state.updateFee &&
                                <div class='width-80 margin-auto margin-bottom-10'>
                                    <InputLabel id="demo-simple-select-label">Select Students</InputLabel>

                                    <MenuItem value={this.state.selectedStudent[1]} selected>{this.state.selectedStudent[1]}</MenuItem>

                                </div>

                            }


                            <div class='width-80 margin-auto margin-bottom-10'>
                                <InputLabel htmlFor="input-with-icon-adornment">Total Fee:</InputLabel>
                                <Input
                                    value={this.state.updateFee ? this.state.studentfee : this.state.studentfee}
                                    onChange={e => this.setState({ studentfee: e.target.value })}
                                    type='Number'
                                    style={{ width: '100%' }}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={dollar} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>
                                    }
                                />
                            </div>

                            <div class='width-80 margin-auto margin-bottom-10' >
                                <InputLabel htmlFor="input-with-icon-adornment">Discount:</InputLabel>
                                <Input
                                    value={this.state.updateFee ? this.state.discount : this.state.discount}
                                    onChange={e => this.setState({ discount: e.target.value })}
                                    type='Number'
                                    style={{ width: '100%' }}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={dollar} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>
                                    }
                                />
                            </div>
                            <div class='width-80 margin-auto margin-bottom-10'>
                                <InputLabel htmlFor="input-with-icon-adornment">Reason</InputLabel>
                                <Input
                                    value={this.state.updateFee ? this.state.reason : this.state.reason}
                                    onChange={e => this.setState({ reason: e.target.value })}
                                    type='text'
                                    style={{ width: '100%' }}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={paper} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>
                                    }
                                />
                            </div>

                            <div class='width-80 margin-auto margin-bottom-10'>
                                <InputLabel htmlFor="input-with-icon-adornment">Date</InputLabel>
                                <Input
                                    defaultValue={this.state.updateFee ? `${this.state.selectedDate.slice(6, 10)}-${this.state.selectedDate.slice(3, 5)}-${this.state.selectedDate.slice(0, 2)}` : this.state.selectedDate}
                                    onChange={e => {
                                        this.dateChange(e.target.value)
                                    }}
                                    type='date'
                                    style={{ width: '100%' }}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={calendar_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>


                                    }
                                />
                            </div>
                            <div class='width-80 margin-auto margin-bottom-10'>
                                <InputLabel htmlFor="input-with-icon-adornment">Other Expense</InputLabel>
                                <Input
                                    value={this.state.updateFee ? this.state.expense : this.state.expense}
                                    type='Number'
                                    onChange={e => this.setState({ expense: e.target.value })}
                                    style={{ width: '100%' }}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={dollar} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>
                                    }
                                />
                            </div>

                        </DialogContent>
                        <DialogActions className="width-80 margin-auto">
                            <Button style={{color:'red'}} onClick={e => this.setState({ err: false, open: false, updateFee: false, addFee: false, selectedStudent: [], studentfee: '', discount: '', expense: '', selectedDate: '', reason: '' })} color="primary">
                                Cancel
                            </Button>
                            {this.state.addFee && <Button onClick={e => this.addFee()}style={{color:'#6437A1'}}>
                                Add
                            </Button>}
                            {this.state.updateFee && <Button onClick={e => this.addFee()} style={{color:'#6437A1'}}>
                                Update
                            </Button>}
                        </DialogActions>
                    </Dialog>



                    {/* Dialog box month/year filter */}
                    <Dialog className="dialog" fullWidth="true" open={this.state.filter} onClose={() => {
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
                                        this.setState({ year: year },()=>{this.getSelectedDate()
                                            
                                        })
                                
                                        
                                    }}
                                    onChangeMonth={month => {
                                        this.setState({ monthNum: month },()=>{this.getSelectedDate()
                                        })
                                
                                       
                                    }}
                                    style={{ color: '#6437A1' }}
                                />

                            </div>

                        </DialogContent>

                        <DialogActions className="dialog-btns">

                        </DialogActions>
                    </Dialog>

                    {/* Dialog box month/ yerar filter ends */}
                </div>




            </div >



        )
    }
}
export default feeDetails;