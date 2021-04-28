import React, { Component} from 'react';
// import './AppEx.css';
import '../config'; 
import* as firebase from 'firebase'
import studentimg from '../ImagesEx/employee@2x.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController, toISODateString } from 'react-dates';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import 'react-dates/lib/css/_datepicker.css';
import  greenhex from '../ImagesEx/greenhex.png'
import bluehex from '../ImagesEx/bluehex.png'
import yellowhex from '../ImagesEx/yellowhex.png'
import commentimg from '../ImagesEx/comment.png'
import Progress from 'react-progressbar';


class results extends Component {
    constructor(){
        super()
        this.state = {
            className: '',
            student: '',
            studentId: '',
            results: [],
            comment: '',
            classId:'',
            testId:''

        }
    }

    componentWillMount(){
        const {className, name, studentId,classId,testId} = this.props.location.state;
        this.setState({className: className, student: name, studentId: studentId,classId:classId,testId:testId})
        this.getResults();

    }

    getResults() {
        let { results } = this.state;
        results = []
        firebase.database().ref("Student_Result").once("value").then(snapshot => {
            snapshot.forEach(Class => {
               
                if(Class.key==this.state.classId)
                {
                    Class.forEach(student => {
                        console.log(student.key)
                        if(student.key==this.state.studentId){
                            console.log(student.val())
                            student.forEach(test=>{
                                // console.log(test.val())
                                //   results.push(test.val())
                                    if(test.key==this.state.testId){
                                        results.push(test.val())
                                    }
                            })
                            
                        }
                    })
                }
                
           

            })
            console.log(results)
            this.setState({results:results })
        })
    }

    // async getResults(){
    //     await firebase.database().ref("Student_Test").once("value").then(snapshot => {
    //         let {results} = this.state;
    //         snapshot.forEach(parent => {
    //             parent.forEach(student => {
    //                 if(student.key == this.state.studentId){
    //                     student.forEach(teacher => {
    //                         teacher.forEach(test => {
    //                             results.push(test.val())
    //                         })
    //                     })
    //             }
    //             })
    //         })
    //         this.setState({results})
    //         console.log(results)
    //     })
    // }

    render(){
        return(
            <div className="dashboard-ex">
                <h1 className="center green" >Results</h1>
                <div className="flex-justify">
                    <h1 className="regular">Student Name: {this.state.student}</h1>
                    <h1 className="regular">Class: {this.state.className}</h1>
                </div>
                <div className="flex-justify">
                    {this.state.results.slice(0).reverse().map(result => {
                        let obtainedMarks = result.obtainMarks;
                   
                        let shortObtained = result.shortQueObtianMarks;
                        let shortTotal = result.shortQueTotalMarks;
                 
                        let contentObtained = result.contentQueObtainMarks;
                        let contentTotal = result.contentQueTotalMarks;
                        let comment = ''
                            // result.multiChoiceList.map(mcq => {
                            //     obtainedMarks = obtainedMarks + mcq.multiObtainMarks;
                            //     mcqTotal = mcqTotal + 1;
                            //     if (mcq.multiObtainMarks == mcq.marks) {
                            //         mcqTrue = mcqTrue + 1;
                            //     }
                            // })
                            // result.shortsList.map(question => {
                            //     obtainedMarks = obtainedMarks + question.shortObtainMarks;
                            //     short = short + 1;
                            //     shortObtained = shortObtained + question.shortObtainMarks;
                            //     shortTotal = shortTotal + question.marks;
                            // })

                        if ((obtainedMarks/result.totalMarks) >= 0.9) {
                            comment = 'Excellent!'
                        } else if ((obtainedMarks/result.totalMarks) < 0.9 && (obtainedMarks/result.totalMarks) >= 0.7 ){
                            comment = 'Good!'
                        } else if ((obtainedMarks/result.totalMarks) < 0.7 && (obtainedMarks/result.totalMarks) >= 0.4 ){
                            comment = 'Average!'
                        } else {
                            comment = 'Poor!'
                        }

                        return (
                            <div className="result-box">
                                <h2 className="center regular">{result.testTitle + ' ' + result.classWorkType} </h2>
                                <div className="flex-justify">
                                    <h3 className="center regular">Total Marks: {result.totalMarks}</h3>
                                    <h3 className="center regular">Obtained Marks: {obtainedMarks}</h3>
                                </div>
                                <div>
                                    <h3 className="regular center no-margin" >{(obtainedMarks/result.totalMarks)*100}% </h3>
                                    <Progress className="progressbar" completed={(obtainedMarks/result.totalMarks)*100} />

                                </div>
                                
                                <div className="flex-justify">
                                    <div className="result-in-box">
                                        <h3 className="regular padding-sides-20 center">Total M.C.Qs</h3>
                                        <h3 className="green">{result.totalMCQues}</h3>
                                        <div style={{position: "relative"}}>
                                            <img className="res-box" src={greenhex}></img>
                                            <div className="result-content">
                                                <h4 className="white marks-1" style={{zIndex: '2'}}>{result.multiChoiceTotalCorrect}</h4>
                                                <h4 className="label-1 white">Correct</h4>
                                                <h4 className="marks-2 white">{result.multiChoiceTotalWrong}</h4>
                                                <h4 className="label-2 white">Wrong</h4>

                                            </div>

                                        </div>
                                        


                                    </div>
                                    <div className="result-in-box">
                                        <h3 className="regular center">Total Short Questions</h3>
                                        <h3 className="blue">{result.totalShortQues}</h3>
                                        <div style={{position: "relative"}}>
                                            <img className="res-box" src={bluehex}></img>
                                            <div className="result-content">
                                                <h4 className="marks-1 white" style={{zIndex: '2'}}>{shortTotal}</h4>
                                                <h4 className="label-12 white">Total</h4>
                                                <h4 className="marks-2 white">{shortObtained}</h4>
                                                <h4 className="label-22 white">Obtained</h4>

                                            </div>

                                        </div>
                                        

                                    </div>
                                    <div className="result-in-box">
                                        <h3 className="regular center">Total Content Question</h3>
                                        <h3 className="yellow" >{result.totalContentQues}</h3>
                                        <div style={{position: "relative"}}>
                                            <img className="res-box" src={yellowhex}></img>
                                            <div className="result-content">
                                                <h4 className="marks-1 white" style={{zIndex: '2'}}>{contentTotal}</h4>
                                                <h4 className="label-12 white">Total</h4>
                                                <h4 className="marks-2 white">{contentObtained}</h4>
                                                <h4 className="label-22 white">Obtained</h4>

                                            </div>

                                        </div>
                                        

                                    </div>
                                </div>

                                <div className="flex-justify">
                                    <div className="flex">
                                        <div className="padding-20">
                                            <h3 className="regular green center " >Remarks</h3>
                                            <h3 className="center regular">{comment}</h3>

                                        </div>
                                        <img className="comment-img" src={commentimg} ></img>

                                    </div>
                                    
                                </div>



                            </div>
                        )
                    })

                    }

                </div>
            </div>
            

        )
    }
}

export default results;