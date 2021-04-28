import React, { Component } from 'react';
import './AppEx.css';
import '../config';
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import schoolImg from '../ImagesEx/school.png'

import dashboardBanner from '../ImagesEx/dashboard-ex.png'
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

class schoolDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            schools: [],
            selected: '',
            selectedSchool: '',
            schoolId: '',
            allprincipals: [],
            Open:false,
            deleteId:"",
            foreignKey:''

        }






    }
    async componentDidMount() {


        this.getSchools().then(
            this.getPrincipals()
        )



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

    async getPrincipals() {
        // let { allprincipals } = this.state;
        var allprincipals = []
        await firebase.database().ref("Principal").once("value").then(snapshot => {
            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    console.log(school.val())
                    school.forEach(principal => {
                        allprincipals.push(principal.val())
                    })

                }


            })
            this.setState({ allprincipals })

        })
    }

    getData(school) {
        this.setState({ selectedSchool: school.schoolName, selected: school.refId, schoolId: school.id }, () => { this.getPrincipals() })
    }


    verify(forigenKey, id) {

        firebase.database().ref("Principal").child(forigenKey).child(id).update(
            { verified: true }
        ).then(window.location.reload())
    }

    unverify(forigenKey, id) {

        firebase.database().ref("Principal").child(forigenKey).child(id).update(
            { verified: false }
        ).then(window.location.reload())
    }

    deletePrincipal(id,forigenKey) {

        firebase.database().ref("Principal").child(forigenKey).child(id).remove().then(window.location.reload())
    }
    openFormpop(){
        this.setState({ Open: !this.state.Open })
    }
    render() {

        return (
            <div className="dashboard-ex">

                <div className="dashboard-header-ex">
                    <img src={window.innerWidth >= 900 ? dashboardBanner : dashboardBanner} className="title-img-ex"></img>
                    {/* <h1 className="white title">Welcome To Your Dashboard</h1> */}

                </div>


                <Container >
                    <h2 className="padding-left-10 regular green">Select School to Verify Principals</h2>
                    <div className="horizontal-scroll">
                        {this.state.schools.map((school) => {

                            return (
                                <Link>
                                    <div style={{ position: 'relative' }} className={this.state.selected == school.refId ? 'selected-school-card' : "school-card"}
                                        onClick={() => {
                                            this.getData(school)
                                        }}>
                                        <h4 className="regular no-margin-padding">{school.schoolName}</h4>
                                        <p style={{ fontSize: '14px' }} className="regular no-margin-padding">{school.refId}</p>
                                        <img style={{ position: 'absolute', bottom: '25px' }} src={schoolImg} className="school-img" ></img>

                                    </div>

                                </Link>



                            )

                        })

                        }

                    </div>

                </Container>


                <div className="school-inventory-container">
                    <h2 className="green center regular">Verify Principals of {this.state.selectedSchool}</h2>





                    <div className="inventory-values">


                        {this.state.allprincipals.map((item) => {

                            return (
                                <div style={{ alignItems: 'center' }} className="inventory-titles-flex green">
                                    <div className="justify-left no-margin-padding">
                                        <img className="icon" src={item.profileImg ? item.profileImg : '/naseemlogo.png'}
                                            alt="icon"></img>
                                        <h3 className=" center regular" >{item.userName}</h3>

                                    </div>

                                    <h3 className=" center regular" >{item.email}</h3>
                                    <h3 className=" center regular" >{item.verified ? 'verified' : 'unverified'}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                <Button style={{ color: 'red' }} onClick={e => this.deletePrincipal(this.state.deleteId, this.state.forigenKey)} >
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