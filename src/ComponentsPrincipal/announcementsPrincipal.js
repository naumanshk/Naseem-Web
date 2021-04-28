import React, { Component } from 'react';
import './principal.css';
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


    }
    componentDidUpdate(prevProps) {
  
        
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
                this.setState({ Tests })
                console.log(Tests)

            })
        })
    }
    render() {
        return (
            <div className="announcements-p">
                <div className="announcement-header-p">
                    <h1 className="center white regular">Notifications</h1>

                </div>



                {/* {this.state.Tests.slice(0).reverse().map(test => {
                                    return ( */}
                                        <div className="announcement-box">
                        <img src={announcementImg} className="announcement-img" ></img>
                        <div>
                            <p className="white bold right">Approval Notificaion</p>
                            <p></p>
                            
                            <p className="red right">Start Time: </p>
                        </div>


                    </div>
                

                                    {/* )
                })
            } 
             */}
                  
    

    
              

            </div>
        )
    }
}

export default Announcements;