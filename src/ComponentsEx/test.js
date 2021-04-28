import React, { Component } from 'react';
import './AppEx.css';
import '../config';
import * as firebase from 'firebase'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import print from '../Images/print.png'
import downloadIcon from '../Images/download.png'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import studentimg from '../ImagesEx/employee@2x.png'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import result from '../Images/test.png'
import classBanner from '../ImagesEx/class-banner.png'
import download from 'downloadjs'
import dashboardBanner from '../ImagesEx/dashboard-ex.png'


class test extends Component {
    constructor() {
        super()
        this.state = {
            teacherName: '',
            teacherId: '',
            test: null,
            classId: '',
            className: "",
            Tests: [],
            contentQuestionList: null,
            content: false,
            contentURL: "",
            shortORmulti: false
        }
    }

    componentWillMount() {
        const { test, classId, className } = this.props.location.state;
        this.setState({ test: test, classId: classId, className })
        this.getTests()

        if (test.contentQuestionList) {
            this.setState({ contentQuestionList: test.contentQuestionList[0], contentURL: test.contentQuestionList[0].contents[0].fileUri, content: true })

        }
        if (test.shortsList || test.multiChoiceList) {
            this.setState({ shortORmulti: true })

        }

    }

    getTests() {
        let { Tests } = this.state;
        let { content } = this.state;
        Tests = []
        firebase.database().ref("Student_Test").once("value").then(snapshot => {
            snapshot.forEach(Class => {
                if (Class.key == this.state.classId) {
                    Class.forEach(student => {

                        student.forEach(parent => {
                            parent.forEach(test => {
                                if (test.val().id == this.state.test.id) {
                                    Tests.push(test.val())

                                }

                            })
                        })

                    })
                }
                this.setState({ Tests })
                console.log(Tests)

            })
        })
    }

    print(id) {


        var quotes = document.getElementById(id)
        document.getElementById("printImg").style.display = "none";
        quotes.style.height = 'fit-content';
        quotes.style.maxHeight = 'fit-content';
        html2canvas(quotes)
            .then((canvas) => {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210;
                var pageHeight = 320;
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                var doc = new jsPDF('p', 'mm');
                var position = 10; // give some top padding to first page
                console.log(imgHeight)
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                while (heightLeft >= 0) {
                    position += heightLeft - imgHeight; // top padding for other pages
                    doc.addPage();
                    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                }


                doc.save("reciept")




                window.open(doc.output('bloburl'), '_blank');
                window.location.reload()

            }
            );
    }


    render() {


        return (

            <div className="dashboard-ex regular" >
                 <div className="dashboard-header-ex">
                    <img src={window.innerWidth >= 900 ? dashboardBanner : dashboardBanner} className="title-img-ex"></img>
                    {/* <h1 className="white title">Welcome To Your Dashboard</h1> */}

                </div>


                <div className="container">





                    <div className='container  justify-center' >

                        <h1 className="center green">Question Paper</h1>

                        <div className="test" style={{ width: '80%   ' }} id={this.state.test.id} >

                            <img className="print" id="printImg" src={print} onClick={this.print.bind(this, this.state.test.id)}></img>

                            <h1 className=" center">{this.state.test.subjectName}</h1>
                            <h2 className=" center">{this.state.test.classWorkTpye}</h2>

                            <div className="flex-justify">
                                <h4 >Teacher Name: {this.state.test.teacherName}</h4>
                                <h4 >Date: {this.state.test.date}</h4>

                            </div>

                            <div className="flex-justify">
                                <h4>Test Duration: {this.state.test.testDuration}</h4>

                                <h4>Total Marks: {this.state.test.totalMarks}</h4>

                            </div>

                            <div>

                            </div>

                            {this.state.shortORmulti &&
                                <div style={{ padding: '20px' }} >

                                    {this.state.test.multiChoiceList != undefined && <h3>MULTIPLE CHOICE QUESTIONS:</h3>
                                    }

                                    {this.state.test.multiChoiceList != undefined && this.state.test.multiChoiceList.map((mcq, index) => {

                                        return (
                                            <div className="mcq">
                                                <div className="justify-between">
                                                    <p >{index + 1 + '. ' + mcq.question}</p>
                                                    <p style={{ paddingRight: '10px' }}>{mcq.marks}</p>

                                                </div>

                                                {mcq.options.map((option, index) => {

                                                    return (
                                                        <div className="flex no-margin-padding">
                                                            <p className="mcq-option">{index + 1 == 1 ? "A." : index + 1 == 2 ? "B." : index + 1 == 3 ? "C." : index + 1 == 4 ? "D." : index + 1 == 5 ? "E." : null}</p>

                                                            <p className="mcq-option">{option.option}</p>

                                                        </div>
                                                    )
                                                })

                                                }



                                            </div>
                                        )
                                    })}

                                    {this.state.test.shortsList !== undefined && <h3>SHORT QUESTIONS:</h3>}

                                    {this.state.test.shortsList !== undefined && this.state.test.shortsList.map((short, index) => {

                                        return (
                                            <div className="short">
                                                <div className="justify-between">
                                                    <p >{index + 1 + '. ' + short.question}</p>
                                                    <p style={{ paddingRight: '10px' }}>{short.marks}</p>

                                                </div>
                                                <br />
                                                <hr />



                                            </div>
                                        )
                                    })}
                                </div>}
                            {/* enter content */}
                            {this.state.content &&

                                <div style={{ padding: '20px', height: 'auto' }}  >
                                    <img className="print" style={{ right: '77px', background: 'white' }} src={downloadIcon} onClick={async () => {

                                        // Get the download URL

                                        var xhr = new XMLHttpRequest();
                                        xhr.responseType = 'blob';
                                        xhr.onload = function (event) {
                                            var blob = xhr.response;

                                            download(blob)
                                        };
                                        xhr.open('GET', this.state.contentURL);
                                        xhr.send();

                                        // Or inserted into an <img> element:
                                        // var img = document.getElementById('myimg');
                                        // img.src = url;




                                    }}></img>


                                    {this.state.contentQuestionList.multiChoices != undefined && <h3>MULTIPLE CHOICE QUESTIONS:</h3>}
                                    {this.state.contentQuestionList.multiChoices != undefined && this.state.contentQuestionList.multiChoices.map((mcq, index) => {

                                        return (
                                            <div className="mcq">
                                                <div className="justify-between">
                                                    <p >{index + 1 + '. ' + mcq.question}</p>
                                                    <p style={{ paddingRight: '10px' }}>{mcq.marks}</p>

                                                </div>

                                                {mcq.options.map((option, index) => {

                                                    return (
                                                        <div className="flex no-margin-padding">
                                                            <p className="mcq-option">{index + 1 == 1 ? "A." : index + 1 == 2 ? "B." : index + 1 == 3 ? "C." : index + 1 == 4 ? "D." : index + 1 == 5 ? "E." : null}</p>

                                                            <p className="mcq-option">{option.option}</p>

                                                        </div>
                                                    )
                                                })

                                                }



                                            </div>
                                        )
                                    })}

                                    {this.state.contentQuestionList.shorts !== undefined && <h3>SHORT QUESTIONS:</h3>}

                                    {this.state.contentQuestionList.shorts !== undefined && this.state.contentQuestionList.shorts.map((short, index) => {

                                        return (
                                            <div className="short">
                                                <div className="justify-between">
                                                    <p >{index + 1 + '. ' + short.question}</p>
                                                    <p style={{ paddingRight: '10px' }}>{short.marks}</p>

                                                </div>
                                                <br />
                                                <hr />



                                            </div>
                                        )
                                    })}

                                </div>}
                        </div>

                    </div>



                    <div className='container flex justify-center'>


                        {/* list of classes */}
                        <div className="section-container width-80 width-100" >
                            <h2 class='center green relative'>Class Work Status </h2>


                            <hr></hr>

                            <div class="student-result-titles-ex">
                                <h3 class="green center regular x-small-font">Student</h3>
                                <h3 class="green center regular x-small-font">Submittion</h3>
                                <h3 class="green center regular x-small-font">Status</h3>
                                <h3 class="green center regular x-small-font">Result</h3>
                            </div>


                            <div class='student-result-container-ex'>

                                {this.state.Tests.map(student => {
                                    return (
                                        <div class='student-result-box-ex'>
                                            <div className="justify-left">
                                                <img src={studentimg} className="icon hide-img" ></img>
                                                <h4 className="center green">{student.studentName}</h4>

                                            </div>
                                            <h4 className={student.testSolvedStatus ? "center green" : "center red"}>{student.testSolvedStatus ? "Submitted" : "Unsubmitted"}</h4>
                                            <h4 className={student.testTeacherChecked ? "center green" : "center red"}>{student.testTeacherChecked ? "Checked" : "Unchecked"}</h4>


                                            {student.testTeacherChecked && <Link style={{ textAlign: 'center', }} to={{
                                                pathname: `/executive/${student.id}/${student.studentId}/result`,
                                                state: {
                                                    name: student.studentName,
                                                    testId: student.id,
                                                    studentId: student.studentId,
                                                    className: this.state.className,
                                                    classId: this.state.classId
                                                }
                                            }} > <label style={{ cursor: 'pointer' }} className='center'><img className=' icon' src={result}></img></label>
                                            </Link>
                                            }




                                        </div>
                                    )
                                })

                                }

                            </div>


                        </div>
                    </div>




                </div>




            </div >



        )
    }
}
export default test;