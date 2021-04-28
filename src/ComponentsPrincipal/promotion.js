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

class promotion extends Component {
    constructor() {
        super()
        this.state = {
         
            classes: [],
            students: [],
            promoteTo:'',
            schoolId: '',
       

        }
    }

    componentDidMount() {
       
        const { className, classId } = this.props.location.state;
        this.setState({ className: className, classId: classId });

        this.getStudents()
     
        this.getClasses()


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

      
        })
    }

    async getClasses(){
        var classes = [];
        await firebase.database().ref("Classes").once("value").then(snapshot => {
            
                snapshot.forEach(School => {
                    if (School.key == localStorage.getItem('schoolId')) {
                        School.forEach(section => {
                            classes.push(section.val())

                        })

                    }

                    this.setState({classes})
                

            })
        })
    }


    promoteStudents(){
        var promoteToClass=[]
        this.state.classes.map(item=>{
            if(item.id==this.state.promoteTo){
                promoteToClass.push(item)
                console.log(promoteToClass)

                this.state.students.forEach(student=>{
                    if(student.status){
                        
                        firebase.database().ref("Student").child(this.state.promoteTo).child(student.id).set({
                            
                            email: student.email,
                            forigenKey: this.state.promoteTo,
                            gender: student.gender ? student.gender : "NA",
                            id: student.id,
                            profileImg: student.profileImg ? student.profileImg : null,
                            refId: item.refId,
                            status:false,
                            userName: student.userName,
                            userType:  4
 
                        }).then(firebase.database().ref("Student").child(student.forigenKey).child(student.id).remove().then(window.location.reload()))
                    
                        
                    }
                })
            }
        })
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
                        <h2 class='center purple'>Yearly Progress</h2>
                    
                        <div className='promotion-div'>

                        <select  onChange={e=>{this.setState({promoteTo:e.target.value}) }} className='purple promotion-select'>
                            <option value="">Select Class</option>
                            {this.state.classes.map(item => {
                                return (
                                    <option value={item.id}>{item.className}</option>
                                )
                            })
                        }

                            </select>
                        {this.state.promoteTo=="" ?
                         <button disabled onClick={e=>{this.promoteStudents()}} id='' className=' promotion-select'>
                         Promote
                      </button>
                      :
                      <button style={{cursor:'pointer'}} onClick={e=>{this.promoteStudents()}} id='bg-purple' className='white promotion-select'>
                      Promote
                     </button>
                        }
                       
                        
                        </div>
                        
                        <hr></hr>
                        {/* <div class="student-attendance-titles-p">
                            <h3 class="purple center regular x-small-font">Student</h3>
                            <h3 class="purple center regular x-small-font">Progress</h3>
                            <h3 class="purple center regular x-small-font">Absent</h3>
                            <h3 class="purple center regular x-small-font"></h3>
                        </div> */}

                        <div class='student-attendance-container-p'>
                            {this.state.students.map(student => {
                                return (
                                    <div class='student-promotion-box-p'>
                                        <div className="justify-left">
                                            <img src={student.profileImg ? student.profileImg : studentimg} style={{borderRadius:'50px'}} className="icon" ></img>

                                        </div>
                                        <h4 className="center purple">{student.userName}</h4>

                                        <h4 className=" center green">{student.status ? "Pass" : "Fail"}</h4>
                                      
                                    
                                        {/* <label onClick={() => { this.studentSummary(student.Id) }}><img className='icon' src={calender}></img></label> */}
                                   


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

         

            </div>



        )
    }
}
export default promotion;