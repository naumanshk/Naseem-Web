import React, { Component } from 'react';
import '../App.css';
import '../config';
import * as firebase from 'firebase'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import print from '../Images/print.png'
import downloadIcon from '../Images/download.png'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import headerleft from '../Images/presentation@2x.png'
import studentimg from '../Images/student.png'
import headerright from '../Images/test@2x.png'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import download from 'downloadjs'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class test extends Component {
    constructor() {
        super()
        this.state = {
         students:[],
         Open:false,
         deleteId:"",
         classId:''
        }
    }

    componentWillMount() {
      
        this.getStudents()
    }
    async getStudents() {
        await firebase.database().ref("Student").once("value").then(snapshot => {
            let { students } = this.state;
            students = []
            snapshot.forEach(section => {
                if (section.key == localStorage.getItem('classId')) {
                    section.forEach(student => {
                        students.push(student.val())
                    })
                }
            })
            this.setState({ students })

      
        })
    }

    deleteStudent(id,classId){
            console.log(id)
            firebase.database().ref("Student").child(classId).child(id).remove().then(window.location.reload())
    }
    openFormpop(){
        this.setState({ Open: !this.state.Open })
    }

    render() {
        return (
            <div className='teacherTest'>
  
          <h1 className="grey center">Students Record</h1>
          <h2 className='grey center font'>Total Students: {this.state.students.length}</h2>
                <div className="tests-status-container">
                    <div className="tests-status-grid center">
                        <div></div>
                        <div>
                            <h2 className='font'>Name</h2>
                        </div>
                        <div>
                            <h2 className='font'>Contact</h2>
                        </div>
                        <div>
                            <h2 className='font'>Delete</h2>
                        </div>

                    </div>

                    {this.state.students.map(student => {
                        return (
                           
                                <div style={{marginBottom:'10px'}} className="tests-status-grid center x-small-font" >
                                    <div>
                                        <img src={studentimg} className="student-icon" ></img>
                                    </div>
                                    <div >

                                        <h3 className="grey">{student.userName}</h3>
                                    </div>
                                    <div>
                                    <h3 className="grey">{student.email}</h3>
                                    </div>
                                    <div>
                                       
                                    <DeleteOutlinedIcon  style={{cursor:'pointer',color:'red'}} onClick={e=>this.setState({Open:true,deleteId:student.id,classId:student.forigenKey})} />
                                    </div>

                                </div>
                  
                        )
                    })

                    }




<Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                    this.openFormpop()
                  

                }} aria-labelledby="form-dialog-title">

                    <DialogTitle className="center red" style={{color:'red'}}  id="form-dialog-title">Delete Student</DialogTitle>

                    <DialogContent>

                        <div class='width-80 margin-auto margin-bottom-10'>
                       < Typography style={{textAlign:'center'}}>Are you sure you want to delete this student ?</Typography>
                        </div>




                    </DialogContent>

                    <DialogActions className="width-80 margin-auto">
                        <Button  onClick={e => this.setState({ Open: false})} >
                            Cancel
                            </Button>
                        <Button style={{color:'red'}}   onClick={e => this.deleteStudent(this.state.deleteId,this.state.classId)} >
                            Delete
                            </Button>

                    </DialogActions>
                </Dialog>

                </div>


            </div>


        )
    }
}

export default test;