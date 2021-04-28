import React, { Component} from 'react';

import '../config'; 
import* as firebase from 'firebase'
import studentimg from '../ImagesEx/employee@2x.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import 'react-dates/lib/css/_datepicker.css';
import  greenhex from '../ImagesEx/greenhex.png'
import bluehex from '../ImagesEx/bluehex.png'
import yellowhex from '../ImagesEx/yellowhex.png'
import commentimg from '../ImagesEx/comment.png'
import Progress from 'react-progressbar';


class studentResults extends Component {
    constructor(){
        super()
        this.state = {
            className: '',
            student: '',
            studentId: '',
            test: [],
            comment: '',
            test: null,
            classId:'',
            results:[]

        }
    }

    componentWillMount(){
        const {test} = this.props.location.state;
        this.setState({test: test,classId:localStorage.getItem("classId")})
        
        this.getResults()
    }
    componentDidMount(){
        
    }

    getResults() {
        let { results } = this.state;
        results = []
        firebase.database().ref("Student_Result").once("value").then(snapshot => {
            snapshot.forEach(Class => {
               
                if(Class.key==localStorage.getItem("classId"))
                {
                    Class.forEach(student => {
                        console.log(student.key)
                        if(student.key==this.state.test.studentId){
                            student.forEach(test=>{
                                    if(test.key==this.state.test.id){
                                        results.push(test.val())
                                    }
                            })
                            
                        }
                    })
                }
                
           

            })
            console.log(results[0])
            this.setState({results:results[0] })
        })
    }


    render(){
        var test = this.state.results;
        var comment = '';
        if ((test.obtainMarks/test.totalMarks) >= 0.9) {
            comment = 'Excellent!'
        } else if ((test.obtainMarks/test.totalMarks) < 0.9 && (test.obtainMarks/test.totalMarks) >= 0.7 ){
            comment = 'Good!'
        } else if ((test.obtainMarks/test.totalMarks) < 0.7 && (test.obtainMarks/test.totalMarks) >= 0.4 ){
            comment = 'Average!'
        } else {
            comment = 'Poor!'
        }
        return(
            <div className="dashboard-ex">
                <div className="test-results-header">
                <h1 className="center " >Test Result</h1>

                </div>
                
                
                <div >
                    
                        
                            <div className="result-box" style={{maxWidth: '500px', margin: 'auto'}}>
                                <h2 className="center regular">{test.testTitle } </h2>
                                <div className="flex-justify">
                                    <h3 className="center regular">Total Marks: {test.totalMarks}</h3>
                                    <h3 className="center regular">Obtained Marks: {test.obtainMarks}</h3>
                                </div>
                                <div>
                                    <h3 className="regular center no-margin" >{(test.obtainMarks/test.totalMarks)*100}% </h3>
                                    <Progress className="progressbar" completed={(test.obtainMarks/test.totalMarks)*100} />

                                </div>
                                
                                <div className="flex-justify">
                                    <div className="result-in-box">
                                        <h3 className="regular padding-sides-20 center">Total M.C.Qs</h3>
                                        <h3 className="green">{test.multiChoiceTotalMarks}</h3>
                                        <div style={{position: "relative"}}>
                                            <img className="res-box" src={greenhex}></img>
                                            <div className="result-content">
                                                <h4 className="white marks-1" style={{zIndex: '2'}}>{test.multiChoiceTotalCorrect}</h4>
                                                <h4 className="label-1 white">Correct</h4>
                                                <h4 className="marks-2 white">{test.multiChoiceTotalWrong}</h4>
                                                <h4 className="label-2 white">Wrong</h4>

                                            </div>

                                        </div>
                                        


                                    </div>
                                    <div className="result-in-box">
                                        <h3 className="regular center">Total Short Questions</h3>
                                        <h3 className="blue">{test.totalShortQues}</h3>
                                        <div style={{position: "relative"}}>
                                            <img className="res-box" src={bluehex}></img>
                                            <div className="result-content">
                                                <h4 className="marks-1 white" style={{zIndex: '2'}}>{test.shortQueTotalMarks}</h4>
                                                <h4 className="label-12 white">Total</h4>
                                                <h4 className="marks-2 white">{test.shortQueObtianMarks}</h4>
                                                <h4 className="label-22 white">Obtained</h4>

                                            </div>

                                        </div>
                                        

                                    </div>
                                    <div className="result-in-box">
                                        <h3 className="regular center">Total Content Question</h3>
                                        <h3 className="yellow" >{test.totalContentQues}</h3>
                                        <div style={{position: "relative"}}>
                                            <img className="res-box" src={yellowhex}></img>
                                            <div className="result-content">
                                                <h4 className="marks-1 white" style={{zIndex: '2'}}>{test.contentQueTotalMarks}</h4>
                                                <h4 className="label-12 white">Total</h4>
                                                <h4 className="marks-2 white">{test.contentTotalObtainMarks}</h4>
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

                </div>
            </div>
            

        )
    }
}

export default studentResults;