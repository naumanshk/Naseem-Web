import React, { Component } from 'react';
import './principal.css';
import '../config';
import * as firebase from 'firebase'
import Announcements from './announcementsPrincipal'
import principalHeader from '../ImagePrinci/headerPrincipal.png'
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import { isInclusivelyBeforeDay } from 'react-dates'
import MonthYearPicker from 'react-month-year-picker';
import * as moment from 'moment';
import teachericon from '../ImagePrinci/teacher-box-icon.png'

import studentImg from '../ImagePrinci/student-box-icon.png'
import studentimg from '../ImagesEx/employee@2x.png'
import book from '../ImagePrinci/reading-book.png'

import classIcon from '../ImagePrinci/class-box-icon.png'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
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

// import announcementImg from '../Images/announcement.png'
import ic_inventory_chair from '../ImagesEx/chair.png'
import ic_inventory_desk from '../ImagesEx/desk.png'
import ic_inventory_fan from '../ImagesEx/fan.png'
import ic_inventory_sofa from '../ImagesEx/sofa.png'
import ic_inventory_bulb from '../ImagesEx/light-bulb.png'
import ic_inventory_camera from '../ImagesEx/camera.png'
import ic_inventory_circularclock from '../ImagesEx/circular-clock.png'
import ic_inventory_data from '../ImagesEx/data.png'
import ic_inventory_delete from '../ImagesEx/delete.png'
import ic_inventory_mouse from '../ImagesEx/mouse.png'
import ic_inventory_shoerack from '../ImagesEx/shoe-rack.png'
import ic_inventory_socket from '../ImagesEx/socket.png'
import ic_inventory_television from '../ImagesEx/television.png'
import ic_inventory_blackboard from '../ImagesEx/white-board.png'
import ic_inventory_stockdefault from '../ImagesEx/ic_inventory_stockdefault.png'
import Icon from '@material-ui/core/Icon';
import iconsfile from './icon_names.json'

class expenditure extends Component {
    constructor() {
        super()
        this.state = {
            expenditure: [],
            icons:[],
            schoolId: "",
            classId: "",
            month: 'Feb',
            monthKey: '02-2021',
            monthNum: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            inventoryEmpty: "",
            Open: false,
            date: moment(),
            openform: false,
            addExpenditure: false,
            updateExpenditure: false,
            selectedDate:moment(),
            title:"",
            quantity:0,
            price:0,
           totalprice:0,
           iconName:"",
           


        }
    }

    componentDidMount() {
        
        var month = `${new Date().toDateString().slice(3, 7)} ${new Date().getFullYear()}`
        this.setState({ month: month,icons:iconsfile })
        this.setState({ schoolId: localStorage.getItem('schoolId'), classId: localStorage.getItem('classId') })
        this.getExpenditure()
        this.getSelectedDate()
    }
    getSelectedDate() {
        let { selectedDate } = this.state;
        let { date } = this.state;
        // date = date._d;

        var day = date.toDate().getDate();
        var month = date.toDate().getMonth() + 1;
        var year = date.toDate().getFullYear();
        if (day < 10) {
            day = '0' + day;
        }
        if (month < 10) {
            month = '0' + month;
        }
        selectedDate = day + '-' + month + '-' + year;

        this.setState({ selectedDate })
        console.log(selectedDate.toString().slice(6,10))


    }

    async getExpenditure() {
        this.setState({ expenditureEmpty: '' })
        let { expenditure } = this.state;
        expenditure = []
        console.log(`0${this.state.monthNum}-${this.state.year}`)
        await firebase.database().ref("Expenditure").once("value").then(snapshot => {

            snapshot.forEach(school => {
                if (school.key == this.state.schoolId) {
                    console.log(school.val())
                    school.forEach(date => {
                        var month = date.key

                        month = month.slice(3, 10)
                        console.log(month)
                        if (`0${this.state.monthNum}-${this.state.year}` == month) {
                            date.forEach(item => {
                                expenditure.push({
                                    title: item.val().thing,
                                    quantity: item.val().quantity,
                                    price: item.val().price,
                                    totalPrice: item.val().totalprice,
                                    icon: item.val().icon
                                })
                            })
                        }



                    })
                }

            })
            this.setState({ expenditure })

            if (expenditure == []) {
                this.setState({ inventoryEmpty: "No Items" })
            }



        })


    }
    handleDialog() {
        this.setState({ Open: !this.state.Open })

    }
    openFormpop() {
        this.setState({ openform: !this.state.openform })
    }

    addExpenditure() {
        if(this.state.selectedDate=="" || this.state.discount=="" || this.state.expense=="" || this.state.studentfee=="" || this.state.selectedStudent=="" || this.state.reason=="" ){
        
                this.setState({err:true})

        }
       else{ 
             firebase.database().ref("Expenditure").child(localStorage.getItem("schoolId")).child(this.state.selectedDate).set({

               

                thing: this.state.title,
                quantity: this.state.quantity,
                price: this.state.price,
                totalprice: this.state.totalprice*this.state.quantity,
                icon: this.state.iconName,
                date:this.state.selectedDate
            }).then(window.location.reload())
       }
    }

    render() {


        return (
            <div className="dashboard-principal">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                        <h1 className="center header-main-p">Welcome To Your Dashboard</h1>
                        <img src={principalHeader} className="header-img-p "></img>
                        <div style={{ height: '98%', width: '100%' }} class='gradiant-p absolute no-margin'></div>
                    </div>



                    <div style={{ marginTop: '40px' }} className="justify-center flex flex-responsive padding-sides-20 margin-bottom-10 width-100 margin-auto" >

                        {/* months panel */}


                    </div>

                    <div className='container flex justify-center'>


                        {/* list of classes */}
                        <div className="section-container-p width-80 width-100" >

                            <h2 class='center purple relative' >Expenditure
                            <Icon onClick={e => {
                                    this.openFormpop()
                                    this.setState({addExpenditure:true})


                                }} style={{ float: 'right', cursor: 'pointer', right: '15px' }} className="fa fa-plus-circle absolute purple" />
                            </h2>
                            <div className="flex justify-center">

                                <h3 className="purple" >Select Month:  </h3>
                                <h3 onClick={() => { this.handleDialog() }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', color: 'white', backgroundColor: '#6437A1', padding: '10px', borderRadius: '5px' }}> {this.state.monthNum <= 9 ? 0 : ""}{this.state.monthNum}-{this.state.year}</h3>



                            </div>



                            <hr></hr>
                            <div className="purple expenditure-titles-p " >
                                <h2 className="purple">Items</h2>
                                <h2 className="purple">Quantity</h2>
                                <h2 className="purple">Price</h2>
                                <h2 className="purple">Total Price</h2>
                            </div>
                            <div className="inventory-values">
                                <h2 className="regular">{this.state.expenditureEmpty}</h2>

                                {this.state.expenditure.map((item) => {

                                    return (
                                        <div className="expenditure-item-p purple">
                                            <div className="justify-center flex no-margin-padding">
                                                <img className="icon" src={item.icon === 'ic_inventory_fan' ? ic_inventory_fan : item.icon === 'ic_inventory_chair' ? ic_inventory_chair :
                                                    item.icon === 'ic_inventory_desk' ? ic_inventory_desk : item.icon === 'ic_inventory_sofa' ? ic_inventory_sofa : item.icon === 'ic_inventory_bulb' ? ic_inventory_bulb :
                                                        item.icon === 'ic_inventory_camera' ? ic_inventory_camera : item.icon === 'ic_inventory_circularclock' ? ic_inventory_circularclock : item.icon === 'ic_inventory_data' ? ic_inventory_data :
                                                            item.icon === 'ic_inventory_delete' ? ic_inventory_delete : item.icon === 'ic_inventory_mouse' ? ic_inventory_mouse : item.icon === 'ic_inventory_shoerack' ? ic_inventory_shoerack :
                                                                item.icon === 'ic_inventory_socket' ? ic_inventory_socket : item.icon === 'ic_inventory_television' ? ic_inventory_television : item.icon === 'ic_inventory_blackboard' ? ic_inventory_blackboard : ic_inventory_stockdefault} alt="icon"></img>
                                                <h3 className="center regular" >{item.title}</h3>

                                            </div>

                                            <h3 className=" center regular" >{item.quantity}</h3>
                                            <h3 className=" center regular" >{item.price}</h3>
                                            <h3 className=" center regular" >{item.totalPrice}</h3>
                                        </div>
                                    )
                                })

                                }

                            </div>
                        </div>
                    </div>



                    <div className="announcement-div">
                        <Announcements school={this.state.Notifications} />
                        <Drawer anchor="right" open={this.state.drawer} onClose={() => { this.setState({ drawer: false }) }} >
                            <Announcements school={this.state.Notifications} />
                        </Drawer>

                    </div>


                </div>

                {/* Dialog box month/year filter */}
                <Dialog className="dialog" fullWidth="true" open={this.state.Open} onClose={() => {
                    this.handleDialog()

                }} aria-labelledby="form-dialog-title">

                    <h1 className="center purple regular" >Select Month</h1>

                    <DialogContent>
                        <div className="flex-justify center">
                            <MonthYearPicker
                                selectedMonth={this.state.monthNum}
                                selectedYear={this.state.year}
                                minYear={2000}
                                maxYear={2030}
                                onChangeYear={year => {
                                    this.setState({ year: year })
                                    this.getExpenditure()
                                }}
                                onChangeMonth={month => {
                                    this.setState({ monthNum: month })
                                    this.getExpenditure()
                                }}
                                style={{ color: '#6437A1' }}
                            />

                        </div>

                    </DialogContent>

                    <DialogActions className="dialog-btns">

                    </DialogActions>
                </Dialog>

                {/* Dialog box month/ yerar filter ends */}

                {/* Dialog box form entery */}

                <Dialog className="dialog" fullWidth="true" open={this.state.openform} onClose={() => {
                    this.openFormpop()

                }} aria-labelledby="form-dialog-title">

                    <img src={book} style={{ alignSelf: 'center', marginTop: '20px', backgroundColor: 'unset' }} className="icon" ></img>
                    <DialogTitle className="center purple" id="form-dialog-title">Add Expenditure</DialogTitle>

                    <DialogContent>
                       
                        <div class='width-80 margin-auto margin-bottom-10'>
                           

                                <InputLabel htmlFor="input-with-icon-adornment">Item Name</InputLabel>
                                <Input
                                    
                                    style={{ width: '100%' }}
                                    onChange={e=>{this.setState({title:e.target.value})}}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={book} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                        </InputAdornment>
                                    }
                                />

                            </div>

                            <div class='width-80 margin-auto margin-bottom-10'>
                           

                           <InputLabel htmlFor="input-with-icon-adornment">Item Amount</InputLabel>
                           <Input
                               
                               style={{ width: '100%' }}
                               type='Number'
                               onChange={e=>{this.setState({price:e.target.value})}}
                               id="input-with-icon-adornment"
                               startAdornment={
                                   <InputAdornment position="start">
                                       <img src={book} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                   </InputAdornment>
                               }
                           />

                       </div>

                       <div class='width-80 margin-auto margin-bottom-10'>
                           

                           <InputLabel htmlFor="input-with-icon-adornment">Item Quantity</InputLabel>
                           <Input
                               type='Number'    
                               style={{ width: '100%' }}
                               onChange={e=>{this.setState({quantity:e.target.value})}}
                               id="input-with-icon-adornment"
                               startAdornment={
                                   <InputAdornment position="start">
                                       <img src={book} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                   </InputAdornment>
                               }
                           />

                       </div>
                       <div class='width-80 margin-auto margin-bottom-10'>


                             {this.state.icons.map((item)=>{ return( <img src="/naseemlogo.png" style={{ backgroundColor: 'unset' }} className="icon-input-form"></img>)})}
                             
                           

                         

                       </div>


                                    

                    </DialogContent>

                    <DialogActions className="width-80 margin-auto">
                            <Button onClick={e => this.setState({err:false, open: false, updateExpenditure: false, addExpenditure: false})} color="primary">
                                Cancel
                            </Button>
                            {this.state.addExpenditure && <Button onClick={e=>this.addExpenditure()} color="primary">
                                Add
                            </Button>}
                            {this.state.updateExpenditure && <Button  color="primary">
                                Update
                            </Button>}
                        </DialogActions>
                </Dialog>

                {/* Diaolog box form entery ends */}




            </div >



        )
    }
}
export default expenditure;