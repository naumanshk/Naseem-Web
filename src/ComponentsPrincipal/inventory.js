import React, { Component } from 'react';
import './principal.css';
import '../config';
import * as firebase from 'firebase'
import Announcements from './announcementsPrincipal'
import principalHeader from '../ImagePrinci/coverP.png'
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


import expense_ico from '../ImagePrinci/expense.png'
import quantity from '../ImagePrinci/add-objects.png'
import item_ico from '../ImagePrinci/itemName.png'


class inventory extends Component {
    constructor() {
        super()
        this.state = {
            expenditure: [],
            schoolId: "",
            classId: "",
            month: 'Feb',
            monthKey: '02-2021',
            monthNum: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            inventoryEmpty: "",
            Open: false,
            date: moment(),
            inventory:[],
            openform: false,
            icons:[],
            iconName:"ic_inventory_stockdefault",
            selectedDate:moment(),
            title:"",
            quantity:0,
            bgClr:'unset'


        }
    }

    componentDidMount() {
        var month = `${new Date().toDateString().slice(3, 7)} ${new Date().getFullYear()}`
        this.setState({ month: month,icons:iconsfile })
        this.setState({ schoolId: localStorage.getItem('schoolId'), classId: localStorage.getItem('classId') })
        this.getInventory()
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

    async getInventory(){
        this.setState({inventoryEmpty: ''})
        let {inventory} = this.state;
        inventory = []
        await firebase.database().ref("Inventory").once("value").then(snapshot => {
            
            snapshot.forEach(school => {   
                if (school.key == this.state.schoolId){
                    school.forEach(date => {
                        var month = date.key
                        
                        month = month.slice(month.length - 7)
                        
                        if (`0${this.state.monthNum}-${this.state.year}` == month) {
                            date.forEach(item => {
                                inventory.push({
                                    title: item.val().title,
                                    present: item.val().presentItems,
                                    missing: item.val().missingItems,
                                    repairing: item.val().repairtingItems,
                                    icon: item.val().icon
                                })
                            })
                        }
                        
                        
                        
                    })
                }     
                
            })
            this.setState({inventory})
            
            if (inventory == []){
                this.setState({inventoryEmpty: "No Items"})
            }
            
            
           
        })
        

    }
    handleDialog() {
        this.setState({ Open: !this.state.Open })

    }

    openFormpop() {
        this.setState({ openform: !this.state.openform })
    }

    iconSelected(iconName){
     
        this.setState({iconName:iconName})

    }

    addInventory() {
        let childKey = firebase.database().ref("Inventory").push().getKey();
        if(this.state.selectedDate=="" || this.state.quantity=="" || this.state.title=="" ){
        
                this.setState({err:true})

        }
       else
       { 
      

             firebase.database().ref("Inventory").child(localStorage.getItem("schoolId")).child(this.state.selectedDate).child(childKey).set({
 
                date: this.state.selectedDate,
                icon:this.state.iconName,
                id: childKey,
                ischecked: false,
                missingItems: 0,
                presentItems: Number(this.state.quantity),
                repairtingItems: 0,
                title: this.state.title,
                totalItems: Number(this.state.quantity)
                

            }).then(window.location.reload())
        }
       
    }
    render() {


        return (
            <div className="dashboard-principal">
                <div className="menu-icon-right" onClick={() => { this.setState({ drawer: true }) }}><MenuIcon /></div>
                <div className="container">
                    <div class='relative ' style={{ marginRight: '10px' }}>

                        {/* <h1 className="center header-main-p">Welcome To Your Dashboard</h1> */}
                        <img src={principalHeader} className="header-img-p "></img>
                        {/* <div style={{ height: '98%', width: '100%' }} class='gradiant-p absolute no-margin'></div> */}
                    </div>



                    <div style={{ marginTop: '40px' }} className="justify-center flex flex-responsive padding-sides-20 margin-bottom-10 width-100 margin-auto" >

                        {/* months panel */}


                    </div>

                    <div className='container flex justify-center'>


                        {/* list of classes */}
                        <div className="section-container-p width-80 width-100" >

                            <h2 class='center purple relative'>Inventory
                            <Icon onClick={e => {
                                    this.openFormpop()
                                  


                                }} style={{ float: 'right', cursor: 'pointer', right: '15px' }} className="fa fa-plus-circle absolute purple" /></h2>
                            <div className="flex justify-center">

                            <h3 className="purple" >Select Month:  </h3>
                            <h3 onClick={() => { this.handleDialog() }} style={{ cursor: "pointer", marginLeft: '10px', marginTop: '5px', color: 'white', backgroundColor: '#6437A1', padding: '10px', borderRadius: '5px' }}> {this.state.monthNum<=9 ? 0:""}{this.state.monthNum}-{this.state.year}</h3>



                        </div>


                            <hr></hr>
                            <div className="purple expenditure-titles-p " >
                                <h2 className="purple x-small-font">Items</h2>
                                <h2 className="purple x-small-font">Present</h2>
                                <h2 className="purple x-small-font">Missing</h2>
                                <h2 className="purple x-small-font">Repairing</h2>
                            </div>
                            <div className="inventory-values">
                                <h2 className="regular">{this.state.expenditureEmpty}</h2>

                                {this.state.inventory.map((item) => {

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

                                            <h3 className=" green center regular" >{item.present}</h3>
                                            <h3 className=" red center regular" >{item.missing}</h3>
                                            <h3 className=" yellow center regular" >{item.repairing}</h3>
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
                                    onChangeYear={year => {this.setState({ year: year })
                                    this.getInventory()
                                }}
                                    onChangeMonth={month => {this.setState({ monthNum: month })
                                    this.getInventory()
                                }}
                                    style={{color:'#6437A1'}}
                                />

                        </div>

                    </DialogContent>

                    <DialogActions className="dialog-btns">

                    </DialogActions>
                </Dialog>


                {/* Dialog box form entery */}

                <Dialog className="dialog" fullWidth="true" open={this.state.openform} onClose={() => {
                    this.openFormpop()
                    this.setState({iconName:"ic_inventory_stockdefault",err:false})


                }} aria-labelledby="form-dialog-title">

                    <img src={book} style={{ alignSelf: 'center', marginTop: '20px', backgroundColor: 'unset' }} className="icon" ></img>
                    <DialogTitle className="center purple" id="form-dialog-title">Add Inventory</DialogTitle>

                    <DialogContent>
                       
                        <div class='width-80 margin-auto margin-bottom-10'>
                           
                                {this.state.err && <h3 className="red">Please fill all the fields to continue!</h3>}

                                <InputLabel htmlFor="input-with-icon-adornment">Item Name</InputLabel>
                                <Input
                                    
                                    style={{ width: '100%' }}
                                    onChange={e=>{this.setState({title:e.target.value})}}
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <img src={item_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

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
                                       <img src={quantity} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                   </InputAdornment>
                               }
                           />

                       </div>
                       
                    
                       <div class='width-80 margin-auto margin-bottom-10'>


                             {this.state.icons.map((item)=>{ return( <img src={`/${item.iconName}.png`} id={this.state.iconName == item.iconName ? "bg-purple" : "bg-white"} name={item.iconName} onClick={e=>this.iconSelected(item.iconName)} style={{ backgroundColor: this.state.bgClr ,cursor:'pointer'}} className="icon"></img>)})}
                             
                           

                         

                       </div>


                                    

                    </DialogContent>

                    <DialogActions className="width-80 margin-auto">
                            <Button onClick={e => this.setState({ openform: false, addExpenditure: false,iconName:"ic_inventory_stockdefault",err:false})} color="primary">
                                Cancel
                            </Button>
                           <Button onClick={e=>this.addInventory()} color="primary">
                                Add
                            </Button>
                       
                        </DialogActions>
                </Dialog>

                {/* Diaolog box form entery ends */}


            </div >



        )
    }
}
export default inventory;