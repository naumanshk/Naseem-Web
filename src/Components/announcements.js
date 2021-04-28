import React, { Component } from 'react';
import '../App.css';
import '../config';
import * as firebase from 'firebase'
import announcementImg from '../Images/announcement.png'
import { Link } from 'react-router-dom';

class Announcements extends Component {
    constructor() {
        super()
        this.state = {
            announcements: [],
            school: []
        }
    }
    // componentDidMount(){

    //     this.setState({school: this.props.school})

    //     this.getTests()

    // }
    componentDidUpdate(prevProps) {
        if (prevProps.school !== this.props.school) {
            var sortedActivities = this.props.school.sort((a, b) =>{ b.date.split('-').reverse().join().localeCompare(b.datesplit('/').reverse().join()
            
            )
            console.log(a)
        } )
            console.log(sortedActivities)
         
            this.setState({ school: this.props.school })
            // console.log("mei "+this.props)
            // this.setState({school: this.props.school})
            // this.getAnnouncements();
          
        }
    }

    getAnnouncements() {


        firebase.database().ref("Announcements").once("value").then(snapshot => {
            snapshot.forEach(parent => {
                if (parent.key == 'PrincipalAnnouncement') {
                    let { announcements } = this.state;
                    announcements = []
                    parent.forEach(school => {
                        console.log(school.key)
                        console.log(this.props.school)
                        if (school.key == this.props.school) {
                            console.log('ma')
                            school.forEach(announcement => {
                                console.log(announcement.val().annoucementfor)
                                if (announcement.val().annoucementfor == "Teachers") {
                                    announcements.push(announcement.val())
                                }
                            })
                        }

                    })
                    this.setState({ announcements })
                    console.log(announcements)
                }

            })
        })
    }

    getTests() {
        let { Tests } = this.state;
        let { content } = this.state;
        Tests = []
        firebase.database().ref("Student_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {

                if (Class.key == localStorage.getItem("classId")) {
                    console.log(Class.val())
                }
                // Class.forEach(student => {

                //     student.forEach(parent => {
                //         parent.forEach(test => {
                //             if (test.val().id == this.state.test.id) {
                //                 Tests.push(test.val())

                //             }

                //         })
                //     })

                // })
            })


        })
    }

    render() {
        let submitted = this.props.school.filter(function (test) {
            return test.testSolvedStatus === true
        });
        return (
            <div className="announcements">
                <div className="announcement-header">
                    <h1 className="center white regular">Notifications</h1>

                </div>

                {this.state.school.slice(0).reverse().map(test => {
                    return (
                        <Link
                            to={{
                                pathname: '/teacher/test/check',
                                state: {
                                    test: test
                                }
                            }}
                        >
                            <div className="announcement-box">
                                <img src={announcementImg} className="announcement-img" ></img>
                                <div>
                                    <p className="green right">{test.subjectName} {test.date}</p>
                                    <p>{test.title}</p>

                                    {test.testTeacherChecked ? <p className="green right"> Checked</p> : <p className="red right">Unchecked</p>}
                                    <p className="green right">Submitted</p>

                                </div>


                            </div>
                        </Link>
                        // <div className="tests-status-grid" >
                        //     <div>
                        //         {/* <img src={studentimg} className="student-icon" ></img> */}
                        //     </div>
                        //     <div >

                        //         <h3 className="grey">{student.studentName}</h3>
                        //     </div>
                        //     <div>
                        //         {student.testSolvedStatus == false ? <h3 className="regular red">Not Submitted</h3> : <h3 className="regular green">Submitted</h3>}

                        //     </div>
                        //     <div>
                        //         {student.testTeacherChecked == false ? <h3 className="regular red">Not Marked</h3> : <h3 className="regular green">Marked</h3>}


                        //     </div>

                        // </div>


                    )
                })

                }

            </div>
        )
    }
}

export default Announcements;