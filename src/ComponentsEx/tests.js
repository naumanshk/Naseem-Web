import React, { Component} from 'react';
import './AppEx.css';
import '../config'; 
import* as firebase from 'firebase'
import studentimg from '../ImagesEx/employee@2x.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import 'react-dates/lib/css/_datepicker.css';
// import  greenhex from '../Images/greenhex.png'
// import bluehex from '../Images/bluehex.png'
// import yellowhex from '../Images/yellowhex.png'
// import commentimg from '../Images/comment.png'
// import Progress from 'react-progressbar';
import print from '../ImagesEx/print.png'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'


class tests extends Component {
    constructor(){
        super()
        this.state = {
            teacherName: '',
            teacherId: '',
            tests: [],
        }
    }

    componentWillMount(){
        const {teacherName, teacherId} = this.props.location.state;
        this.setState({teacher: teacherName, teacherId: teacherId})
        this.getTests();
        console.log(teacherId)

    }

    async getTests(){
        await firebase.database().ref("Teacher_Test").once("value").then(snapshot => {
            let {tests} = this.state;
            snapshot.forEach(parent => {
                
                    
                        parent.forEach(teacher => {
                            if(teacher.key == this.state.teacherId){
                            teacher.forEach(test => {
                                tests.push(test.val())
                            })}
                        })
                })
                
                this.setState({tests})
                console.log(tests)
            })
            
        
    }

    print(id){
        // html2canvas(document.getElementById(id), ).then(function(canvas) {
        //     var img = canvas.toDataURL("image/png");
        //         var doc = new jsPDF();
                
        //         doc.addImage(img, 'JPEG', 1, 1);
                
        //         doc.save('test.pdf');
        //         doc.autoPrint();
                
        //         window.open(doc.output('bloburl'), '_blank');
                
            
        // });

        var quotes = document.getElementById(id);
                html2canvas(quotes)
            .then((canvas) => {
                var imgData = canvas.toDataURL('image/png');
                var imgWidth = 210; 
                var pageHeight = 295;  
                var imgHeight = canvas.height * imgWidth / canvas.width;
                var heightLeft = imgHeight;
                var doc = new jsPDF('p', 'mm');
                var position = 10; // give some top padding to first page
                
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
                }
            );
    }

    render(){
        var mcqsr = 0;
        var mcqoption = 0;
        var shortsr = 0;
        return(
            <div className="dashboard-ex">
                <h1 className="center green">TESTS</h1>
                {this.state.tests.map(test => {
                    mcqsr = 0;
                    shortsr = 0;
                    mcqoption = 0;
                    return (
                        <div className="test" id={test.id}>
                            <img className="print"  src={print} onClick={this.print.bind(this, test.id)}></img>
                            <h1 className=" center">{test.subjectName}</h1>
                            <h2 className=" center">{test.classWorkTpye}</h2>

                            <div className="flex-justify">
                            <h4 >Teacher Name: {test.teacherName}</h4>
                            <h4 >Date: {test.date}</h4>

                            </div>

                            <div className="flex-justify">
                            <h4 >Test Duration: {test.testDuration}</h4>
                            <h4  >Total Marks: {test.totalMarks}</h4>

                            </div>

                            <div>

                            </div>

                            
                            {test.multiChoiceList != undefined && <h3>MULTIPLE CHOICE QUESTIONS:</h3>
                            }

                            {test.multiChoiceList != undefined && test.multiChoiceList.map(mcq => {
                                mcqsr = mcqsr +1
                                mcqoption = 0;
                                return(
                                    <div className="mcq">
                                        <div className="justify-between">
                                        <p >{mcqsr + '. ' + mcq.question }</p>
                                        <p style={{paddingRight: '10px'}}>{mcq.marks}</p>

                                        </div>
                                        
                                        {mcq.options.map(option => {
                                            mcqoption = mcqoption + 1;
                                            return (
                                                <div className="flex no-margin-padding">
                                                    <p className="mcq-option">{mcqoption == 1 ? "A." : mcqoption == 2 ? "B." : mcqoption == 3 ? "C." : mcqoption == 4 ? "D." : mcqoption == 5 ? "E." : null }</p>
                                                    
                                                    <p className="mcq-option">{option.option}</p>

                                                </div>
                                            )
                                        })
                                        
                                        }
                                        


                                    </div>
                                )
                            })}

                            {test.shortsList !== undefined && <h3>SHORT QUESTIONS:</h3>}

                            {test.shortsList !== undefined && test.shortsList.map(short => {
                                shortsr = shortsr +1
                                return(
                                    <div className="short">
                                        <div className="justify-between">
                                        <p >{shortsr + '. ' + short.question }</p>
                                        <p style={{paddingRight: '10px'}}>{short.marks}</p>

                                        </div>
                                        <br/>
                                        <hr/>
                                        


                                    </div>
                                )
                            })}

                            
                            

                        </div>
                    )
                })

                }
                            
            </div>
            

        )
    }
}

export default tests;