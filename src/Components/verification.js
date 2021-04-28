import React, { Component } from 'react';

import '../config';
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import schoolImg from '../ImagesEx/school.png'
import teacherHeader from '../Images/teacher-dashboards.png'


import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';


import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import classImg1 from '../Images/classImg1.png'


class schoolDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools: [],
            selected: '',
            selectedSchool: '',
            schoolId: '',
            allprincipals: [],
            Open: false,
            deleteId: "",
            foreignKey: '',
            classes: [],
            selectedClassId: '',
            roleId: '',
            assosiatedSubjects: [],
            subjectCheck: false,
            classCheck: false,
            roleChecked: false,
            verifiedstudents: [],
            unverifiedstudents: []

        }






    }
    async componentDidMount() {



        // this.getTeachers()

        this.getClasses()
        this.getStudents()

    }


    async getSchools() {
        let { schools } = this.state;

        await firebase.database().ref("School").once("value").then(snapshot => {
            snapshot.forEach(organization => {
                if (organization.key == localStorage.getItem('organizationId')) {
                    organization.forEach(item => {
                        schools.push(item.val())
                    })
                }

            })
            this.setState({ schools }, () => { this.setState({ selected: this.state.schools[0].refId, selectedSchool: this.state.schools[0].schoolName, schoolId: this.state.schools[0].id }) })


        })
    }

    async getStudents() {
        // let { allprincipals } = this.state;
        var verifiedstudents = []
        var unverifiedstudents = []

        await firebase.database().ref("Student").once("value").then(snapshot => {
            console.log(snapshot.val())
            snapshot.forEach(section => {
                console.log(section.val())
                if (section.key == this.state.selectedClassId) {
                    console.log(section.val())
                    section.forEach(student => {
                        if (student.val().verified) {
                            verifiedstudents.push(student.val())

                        }
                        else {
                            unverifiedstudents.push(student.val())

                        }
                    })

                }


            })
            this.setState({ verifiedstudents, unverifiedstudents })

        })
    }

    getData(school) {
        this.setState({ selectedSchool: school.schoolName, selected: school.refId, schoolId: school.id }, () => { this.getPrincipals() })
    }

    async getClasses() {
        var classes = []
        await firebase.database().ref("Classes").once("value").then(snapshot => {

            snapshot.forEach(School => {
                if (School.key == localStorage.getItem('schoolId')) {
                    School.forEach(section => {
                        classes.push(section.val())




                    })
                }
            })


            this.setState({ classes, selectedClassId: classes[0].id })

        })
    }

    assignClass(forigenKey, id) {
        this.state.classes.map(item => {
            if (item.id == this.state.selectedClassId) {
                console.log('entered')

                firebase.database().ref("Assosiated_Classes").child(forigenKey).child(id).child(this.state.selectedClassId).set({

                    assosiatedSubjects: this.state.assosiatedSubjects,
                    className: item.className,
                    forigenKey: item.forigenKey,
                    id: item.id,
                    refId: item.refId,
                    status: item.status,
                    teacherRole: this.state.roleId,
                    totalStudents: ''
                }).then(console.log(window.location.reload()))

            }
        })
    }

    verify(forigenKey, id) {

 
            firebase.database().ref("Student").child(forigenKey).child(id).update(
                { verified: true }
            ).then(window.location.reload())
    }

    unverify(forigenKey, id) {

        firebase.database().ref("Student").child(forigenKey).child(id).update(
            { verified: false }
        ).then(window.location.reload())
    }

    deleteTeacher(id, forigenKey) {

        firebase.database().ref("Student").child(forigenKey).child(id).remove().then(window.location.reload())
    }
    openFormpop() {
        this.setState({ Open: !this.state.Open })
    }
    render() {

        return (
            <div className="dashboard-ex">

                <div className="dashboard-header-ex">
                    <img src={window.innerWidth >= 900 ? teacherHeader : teacherHeader} className="title-img-ex"></img>
                    {/* <h1 className="white title">Welcome To Your Dashboard</h1> */}

                </div>




                <div className="school-inventory-container">
                    <h2 className="green center regular">Verify Students </h2>

                    <div >
                        <h2 className="grey regular">Select Class To View Details</h2>
                        <div className="flex flex-responsive" >
                            {this.state.classes.map(Class => {

                                return (
                                    <div className={this.state.selectedClassId == Class.id ? "class-box-green" : "class-box-white"} onClick={() => {

                                        this.setState({ selectedClassId: Class.id }, () => this.getStudents())
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



                    <div className="inventory-values">
                        {this.state.unverifiedstudents.map((item) => {

                            return (
                                <div style={{ alignItems: 'center', borderRadius: '10px', backgroundColor: '#f5f5f5', padding: '20px' }} className="inventory-titles-flex green">


                                    <div className='padding-left-30 width-70 width-100' >
                                        <div className='flex flex-wrap' >
                                            <div style={{ width: '50%' }} className="justify-left no-margin-padding">
                                                <img className="icon" src={item.profileImg ? item.profileImg : '/naseemlogo.png'}
                                                    alt="icon"></img>
                                                <h3 className=" center regular" >{item.userName}</h3>

                                            </div>
                                            <div>
                                                <h3 style={{ width: '50%' }} className=" center regular" >{item.email}</h3>
                                            </div>
                                        </div>


                                    </div>

                                    <div className='verification-btn'  style={{ width: '30%' }}>

                                        <div style={{ display: 'flex', width: '100px', alignItems: 'center' }}>
                                            <DeleteOutlinedIcon style={{ cursor: 'pointer', color: 'red', marginRight: '5px' }} onClick={e => this.setState({ Open: true, deleteId: item.id, forigenKey: item.forigenKey })} />

                                            {!item.verified ? <Button onClick={e => this.verify(item.forigenKey, item.id)} variant="contained" color="primary">
                                                Verify
                                             </Button>
                                                :
                                                <Button variant="contained" onClick={e => this.unverify(item.forigenKey, item.id)} color="secondary">
                                                    Unverify
                                                </Button>

                                            }

                                        </div>
                                    </div>


                                    {/* <h3  style={{width:'100px'}} className=" center regular" >{item.verified ? 'verified' : 'unverified'}</h3> */}



                                </div>
                            )
                        })

                        }

                        <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                            this.openFormpop()


                        }} aria-labelledby="form-dialog-title">

                            <DialogTitle className="center red" style={{ color: 'red' }} id="form-dialog-title">Delete Student</DialogTitle>

                            <DialogContent>

                                <div class='width-80 margin-auto margin-bottom-10'>
                                    < Typography style={{ textAlign: 'center' }}>Are you sure you want to delete this student ?</Typography>
                                </div>




                            </DialogContent>

                            <DialogActions className="width-80 margin-auto">
                                <Button onClick={e => this.setState({ Open: false })} >
                                    Cancel
</Button>
                                <Button style={{ color: 'red' }} onClick={e => this.deleteTeacher(this.state.deleteId, this.state.forigenKey)} >
                                    Delete
</Button>

                            </DialogActions>
                        </Dialog>
                    </div>

                </div>




                <div className="school-inventory-container">
                    <h2 className="green center regular">Verified Students </h2>


                    <div className="inventory-values">
                        {this.state.verifiedstudents.map((item) => {

                            return (
                                <div style={{ alignItems: 'center', borderRadius: '10px', backgroundColor: '#f5f5f5', padding: '20px' }} className="inventory-titles-flex green">


                                    <div className='padding-left-30 width-70 width-100' >
                                        <div className='flex flex-wrap' >
                                            <div style={{ width: '50%' }} className="justify-left no-margin-padding">
                                                <img className="icon" src={item.profileImg ? item.profileImg : '/naseemlogo.png'}
                                                    alt="icon"></img>
                                                <h3 className=" center regular" >{item.userName}</h3>

                                            </div>
                                            <div>
                                                <h3 style={{ width: '50%' }} className=" center regular" >{item.email}</h3>
                                            </div>
                                        </div>


                                    </div>

                                    <div className='verification-btn' style={{ width: '30%' }}>

                                        <div style={{ display: 'flex', width: '100px', alignItems: 'center' }}>
                                            <DeleteOutlinedIcon style={{ cursor: 'pointer', color: 'red', marginRight: '5px' }} onClick={e => this.setState({ Open: true, deleteId: item.id, forigenKey: item.forigenKey })} />

                                            {!item.verified ? <Button onClick={e => this.verify(item.forigenKey, item.id)} variant="contained" color="primary">
                                                Verify
                                             </Button>
                                                :
                                                <Button style={{padding:'5px'}} variant="contained" onClick={e => this.unverify(item.forigenKey, item.id)} color="secondary">
                                                    Unverify
                                                </Button>

                                            }

                                        </div>
                                    </div>


                                    {/* <h3  style={{width:'100px'}} className=" center regular" >{item.verified ? 'verified' : 'unverified'}</h3> */}



                                </div>
                            )
                        })

                        }

                        <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                            this.openFormpop()


                        }} aria-labelledby="form-dialog-title">

                            <DialogTitle className="center red" style={{ color: 'red' }} id="form-dialog-title">Delete Student</DialogTitle>

                            <DialogContent>

                                <div class='width-80 margin-auto margin-bottom-10'>
                                    < Typography style={{ textAlign: 'center' }}>Are you sure you want to delete this student ?</Typography>
                                </div>




                            </DialogContent>

                            <DialogActions className="width-80 margin-auto">
                                <Button onClick={e => this.setState({ Open: false })} >
                                    Cancel
</Button>
                                <Button style={{ color: 'red' }} onClick={e => this.deleteTeacher(this.state.deleteId, this.state.forigenKey)} >
                                    Delete
</Button>

                            </DialogActions>
                        </Dialog>
                    </div>

                </div>





            </div>

        )
    }
}

export default schoolDetails;