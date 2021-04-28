import React, { Component } from 'react';
// import './AppEx.css';
import '../config';
import * as firebase from 'firebase'
import studentimg from '../ImagesEx/employee@2x.png'
import 'react-dates/initialize';

import 'react-dates/lib/css/_datepicker.css';

import Header from '../ImagesStudent/student-profile.png'


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

class suggestions extends Component {
    constructor() {
        super()
        this.state = {

            suggestions: [],
            questionsBank: [],
            types: '',
            score: 0,
            Open: false,
            testsBank: [],
            onlyEnglish: [],
            weakSubs:[]

        }
    }

    componentWillMount() {


        this.getSuggestios();
        this.getTestsFromDB()

    }



    handleDialog() {
        this.setState({ Open: !this.state.Open })

    }


    getTestsFromDB() {

        firebase.database().ref("Teacher_Test").once("value").then(snapshot => {
            let { testsBank } = this.state;
            testsBank = []
            snapshot.forEach(classes => {
                classes.forEach(student => {
                    student.forEach(tests => {

                        testsBank.push(tests.val())
                    })

                })
            })
            this.setState({ testsBank })
            this.filterTest()


        })

    }


    filterTest() {
        console.log('filter')
        let { testsBank } = this.state;
        let { onlyEnglish } = this.state;


        onlyEnglish = []
       


        //    testsBank.filter(test => test.subjectName=='English')
        this.setState({ onlyEnglish: this.state.testsBank.filter(item => item.subjectName == 'English' )  })  //&& item.classLevel==localStorage.getItem('class')
    }

    getSuggestios() {

        firebase.database().ref("progressive_suggestions").once("value").then(snapshot => {
            let { suggestions } = this.state;
        let { weakSubs } = this.state;

            suggestions = []
            weakSubs = []
            snapshot.forEach(classId => {
                if (classId.key == localStorage.getItem("classId")) {
                    classId.forEach(student => {
                        if (student.key == localStorage.getItem("studentId")) {
                            student.forEach(studentId => {
                                weakSubs.push(studentId.key)
                                studentId.forEach(sugg => {
                                suggestions.push(sugg.val())
                                })
                            })

                        }
                    })
                }
            })
            this.setState({ suggestions , weakSubs})


        })
    }

    emptyStates() {
        this.setState({ questionsBank: [] })

    }

    showTypesSuggestion(sub) {
        this.setState({ types: sub, questionsBank: [] })
    }

    testGeneration(questionType,subject,classLevel){
        if(subject=='Maths' ){
            this.generateMaths(questionType)
        }
        if(subject=="English"){
            this.generateEnglish(questionType)
        }
    }

    generateMaths(questionType) {
  
        let { questionsBank } = this.state;

        questionsBank = []
      

            if (questionType == "addition") {

                for (let i = 0; i < 10; i++) {
                    const min = 1;
                    const max = 22100;
                    const rand1 = Math.floor(min + Math.random() * (max - min));
                    const rand2 = Math.floor(min + Math.random() * (max - min));


                    questionsBank.push(
                        {
                            question:
                                `${rand1}+${rand2}`,

                            answers: [{ option: `${rand1 + rand2}` }, { option: `${rand1 + 12 * 2 / 2}` }, { option: `${rand2 + 12 * 2 / 2}` }],
                            correct: `${rand1 + rand2}`,
                            questionId: "099099"
                        }
                    )

                }



                this.setState({ questionsBank })
            }
            if (questionType == "multiplication") {

                for (let i = 0; i < 10; i++) {
                    const min = 1;
                    const max = 22100;
                    const rand1 = Math.floor(min + Math.random() * (max - min));
                    const rand2 = Math.floor(min + Math.random() * (max - min));


                    questionsBank.push(
                        {
                            question:
                                `${rand1}x${rand2}`,

                            answers: [{ option: `${rand1 * rand2}` }, { option: `${rand1 + 12 * 2 / 2}` }, { option: `${rand2 + 12 * 2 / 2}` }],
                            correct: `${rand1 * rand2}`,
                            questionId: "099099"
                        }
                    )

                }



                this.setState({ questionsBank })
            }


    }

    shuffle(arr) {
        let mcqs = []
        let clean = []
        var i,
            j,
            temp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            if (arr[i].multiChoiceList ) {
              
                mcqs.push(arr[i].multiChoiceList)

               



            }
        }

        for (i = mcqs.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            if (mcqs[i][0].options.length == 2 && mcqs[i][0].awnserId != null) {
                clean.push(mcqs[i][0])

            }


            // temp = arr[i];
            // arr[i] = arr[j];
            // arr[j] = temp;
        }
        return clean;
    };

    generateEnglish(questionType, subject) {
        console.log(questionType)
        let { questionsBank } = this.state;

        questionsBank = []

        let shuffledArr = []
        let mcqs = []
        shuffledArr = this.shuffle(this.state.onlyEnglish)

        console.log(shuffledArr)
        for (let i = 0; i < shuffledArr.length; i++) {
            if(shuffledArr[i].questionType==questionType && shuffledArr[i].classLevel=='Class 3'  ){
                console.log(shuffledArr[i].classLevel)
               


            
            questionsBank.push(
                {

                   
                    question: shuffledArr[i].question,

                    
                    answers: [shuffledArr[i].options[0], shuffledArr[i].options[1]],
                    correct: shuffledArr[i].awnserId == shuffledArr[i].options[0].id ? shuffledArr[i].options[0].option : shuffledArr[i].options[1].option,
                    questionId: "099099"
                }
            )
            }
        }

        //       questionsBank.push(
        //     {

        //         question:mcqs[i][0].question,


        //         answers: [mcqs[i][0].options[0],mcqs[i][0].options[1]],
        //         correct: mcqs[i][0].answerId ,
        //         questionId: "099099"
        //     }
        // )

        // if (questionType == "addition") {

        //   for (let i = 0; i < 10; i++) {

        //         console.log(shuffledArr[i])

        //         if(shuffledArr[i].multiChoiceList!=null){

        //          mcqs.push(shuffledArr[i].multiChoiceList)
        //         }


        //     }

        // for(let i=0; i<10 ; i++){


        //     if(mcqs[i]!=null){
        //         if(mcqs[i][0].options.length==2 && mcqs[i][0].awnserId !=null){
        //             console.log(mcqs[i][0])

        //                  questionsBank.push(
        //         {

        //             question:mcqs[i][0].question,


        //             answers: [mcqs[i][0].options[0],mcqs[i][0].options[1]],
        //             correct: mcqs[i][0].answerId ,
        //             questionId: "099099"
        //         }
        //     )
        //         }


        //     }
        //     console.log(questionsBank)


        // }



        this.setState({ questionsBank })
        // }



    }
    computeResult() {

        var count = 0
        for (let i = 0; i < this.state.questionsBank.length; i++) {
            if (this.state.questionsBank[i].correct == this.state.questionsBank[i].studentanswer) {
                count = count + 1


            }

        }
        this.setState({ score: count }, () => this.handleDialog())

    }


    render() {
        return (
            <div style={{ marginRight: '0px' }} className="dashboard">

                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                        <img src={Header} className="dashboard-header-student"></img>

                    </div>

                    <div className="section-container-p width-60 width-100" style={{ margin: 'auto' }} >


                        <h2 class='center  student-grey relative' >This week you are suppose to practise</h2>


                        <div>

                            <div>
                            {this.state.weakSubs.map((item ,i)=> {
                                return(
                                    <button onClick={e => this.showTypesSuggestion(item)} className='login-btn-s'>{item}</button>


                                )

                            }
                            )}
                               {/* <button onClick={e => this.generateEnglish(item.questionType, item.subject)} className='login-btn-s'>English</button> */}

                            </div>
                            <div  style={{display:'flex'}}>
                            {this.state.suggestions.map(item => {
                                return (
                                    <div>

                                        {this.state.types != "" && this.state.types==item.subject &&

                                            <button className='white small-text ' style={{ background: "grey" }} onClick={e => this.testGeneration(item.questionType, item.subject,item.classLevel)}>{item.questionType}</button>
                                }
                                    </div>

                                )
                            })}
                            </div>
                         
                                </div>


                       


                        {this.state.questionsBank != "" && <div className="content-container">
                            <h3 className="green center">Multiple Choice Questions</h3>

                            {this.state.questionsBank.map((mcq, index) => {
                                return (
                                    <div className="question">
                                        <div className="flex">
                                            <h4>Question No: {index + 1} </h4>
                                            {/* <div className="flex">
                                       <h4 className="regular green-s">Marks: </h4>
                                       <input value={mcq.marks} className="input-marks-s" placeholder="Enter marks" type="number" />

                                   </div> */}


                                        </div>
                                        <div>

                                            <p>{mcq.question}</p>


                                        </div>


                                        <FormControl component="fieldset" >

                                            <RadioGroup name="options" onChange={(e) => {
                                                mcq.studentanswer = e.target.value

                                                this.setState({ studentSelectedAwnserId: e.target.value })



                                            }}>
                                                <div className="flex-justify">

                                                    {mcq.answers.map((option, index) => {
                                                        return (
                                                            <div className="flex">
                                                                <FormControlLabel value={option.option} control={<Radio />} />
                                                                <input className="option-input-s" value={option.option} />


                                                            </div>
                                                        )
                                                    })

                                                    }

                                                </div>
                                            </RadioGroup>
                                        </FormControl>





                                    </div>
                                )
                            })}

                            <div style={{ textAlign: 'center' }}><button onClick={e => this.computeResult()} className='login-btn-s'>Submit</button></div>

                        </div>

                        }



                    </div>
                    <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                        this.handleDialog()

                    }} aria-labelledby="form-dialog-title">

                        <h1 className="center green regular" >Your Score is {this.state.score}</h1>

                        <DialogContent>
                            <div className="flex-justify center">

                                <h1 className="center green regular" >Corrent answers: {this.state.score}</h1>
                                <h1 className="center red regular" >Incorrect answers: {10 - this.state.score}</h1>



                            </div>

                        </DialogContent>

                        <DialogActions className="dialog-btns">

                        </DialogActions>
                    </Dialog>
                </div >
            </div >



        )
    }
}

export default suggestions;