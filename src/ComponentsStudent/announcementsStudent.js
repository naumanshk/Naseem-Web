import React, { Component } from 'react';
import './AppStudent.css';
import '../config';
import * as firebase from 'firebase'
import announcementImg from '../Images/announcement.png'


class Announcements extends Component {
    constructor(props) {
        super(props)
        this.state = {
            announcements: [],
            class: '',
            schoolId: '',
            Tests: [],
        }
    }
    componentDidMount() {

        this.getAnnouncements()
        this.getTests()

    }
    componentDidUpdate(prevProps) {
        if (this.props != prevProps) {
            this.getAnnouncements()
        }
       
            clearInterval(this.lookupInterval)
        
    }

    getAnnouncements() {

        firebase.database().ref("Announcements").once("value").then(snapshot => {
            snapshot.forEach(parent => {
                if (parent.key == 'PrincipalAnnouncement') {
                    let { announcements } = this.state;
                    announcements = []
                    console.log(this.props.school)
                    parent.forEach(school => {
                        console.log(school.key)


                        if (school.key == this.props.school) {

                            school.forEach(announcement => {


                                announcements.push(announcement.val())

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
        Tests = []
        firebase.database().ref("Student_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == localStorage.getItem("classId")) {
                    Class.forEach(student => {
                        if (student.key == localStorage.getItem("studentId")) {
                            student.forEach(parent => {
                                parent.forEach(test => {
                                    Tests.push(test.val())
                                })
                            })
                        }
                    })
                }
                var date_a = []
                var date_b = []
                var sorted = Tests.sort((a, b) => {
                    date_a = a.date.split("-")
                    date_b = b.date.split("-")

                    var annouDate_a = new Date(date_a[2], date_a[1] - 1, date_a[0])
                    var annouDate_b = new Date(date_b[2], date_b[1] - 1, date_b[0])

                    return annouDate_a.getTime() -
                        annouDate_b.getTime()
                }).reverse();
                this.setState({ Tests: sorted })
                console.log(Tests)

            })
        })
    }
    render() {
        return (
            <div className="announcements">
                <div className="announcement-header-s">
                    <h1 className="center white regular">Notifications</h1>

                </div>



                {this.state.Tests.map(test => {
                                    return (
                                        <div className="announcement-box">
                        <img src={announcementImg} className="announcement-img" ></img>
                        <div>
                            <p className="green right">{test.subjectName} {test.date}</p>
                            <p>{test.title}</p>
                            
                            <p className="red right">Start Time: {test.date}-{test.testTime}</p>
                        </div>


                    </div>
                

                                    )
                })
            }
                  
    

    
              

            </div>
        )
    }
}

export default Announcements;