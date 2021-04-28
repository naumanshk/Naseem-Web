import React, { Component } from 'react';
import './AppEx.css';

import '../config';
import * as firebase from 'firebase'
import classBanner from '../ImagesEx/class-banner.png'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import testImg from '../Images/test.png'
import fire from '../config';
import dashboardBanner from '../ImagesEx/dashboard-ex.png'



class testDetails extends Component {
    constructor() {
        super()
        this.state = {
            className: "",
            classId: "",
            Tests: []
        }
    }

    componentDidMount() {
        const { className, classId } = this.props.location.state;
        this.setState({ className: className, classId: classId });
        this.getTests()
    }



    getTests() {
        let { Tests } = this.state;

        Tests = []
        firebase.database().ref("Teacher_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == this.state.classId) {
                    Class.forEach(teacher => {

                        teacher.forEach(test => {
                            Tests.push(test.val())
                        })

                    })
                }

                console.log(Tests)
                this.setState({ Tests })

            })
        })
    }

    // getTests() {
    //     let { Tests } = this.state;
    //     let { content } = this.state;
    //     Tests = []
    //     firebase.database().ref("Student_Test").once("value").then(snapshot => {
    //         snapshot.forEach(Class => {
    //             if (Class.key == this.state.classId) {
    //                 Class.forEach(student => {

    //                     student.forEach(parent => {
    //                         parent.forEach(test => {

    //                                 Tests.push(test.val())



    //                         })
    //                     })

    //                 })
    //             }
    //             this.setState({ Tests })
    //             console.log(Tests)

    //         })
    //     })
    // }

    render() {


        return (
            <div className="dashboard-ex regular" >
                   <div className="dashboard-header-ex">
                    <img src={window.innerWidth >= 900 ? dashboardBanner : dashboardBanner} className="title-img-ex"></img>
                    {/* <h1 className="white title">Welcome To Your Dashboard</h1> */}

                </div>

                <div className='container flex justify-center'>


                    {/* list of classes */}
                    <div className="section-container width-80 width-100" >
                        <h2 class='center green relative'>Class Work </h2>


                        <hr></hr>


                        <div class='student-attendance-container'>
                            {this.state.Tests.slice(0).reverse().map(test => {
                                return (


                                    <div className="test-box" >
                                        <Link to={{
                                            pathname: `/executive/${test.id}/test/details`,
                                            state: {
                                                test: test,
                                                classId: this.state.classId,
                                                className: this.state.className

                                            }

                                        }}>
                                            <div className="test-box-header green" >
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





            </div>








        )
    }
}
export default testDetails;