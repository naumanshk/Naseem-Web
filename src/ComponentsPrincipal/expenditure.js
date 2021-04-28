import React, { Component } from 'react';
import './principal.css';
import '../config';
import * as firebase from 'firebase'
import 'firebase/storage';
import storage from '../config'
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
import downloadIcon from '../ImagePrinci/download.png'
import download from 'downloadjs'


import expense_ico from '../ImagePrinci/expense.png'
import dollar from '../ImagePrinci/dollar.png'

import quantity from '../ImagePrinci/add-objects.png'
import item_ico from '../ImagePrinci/itemName.png'



class expenditure extends Component {
    constructor() {
        super()
        this.state = {
            expenditure: [],
            icons: [],
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
            selectedDate: moment(),
            title: "",
            quantity: 0,
            price: 0,
            totalprice: 0,
            iconName: "ic_inventory_stockdefault",
            image: '',
            imgURL: "",
            uploaded: ""



        }
    }

    componentDidMount() {
        var childKey = firebase.database().ref("Expenditure").push().getKey();
        console.log(childKey)

        var month = `${new Date().toDateString().slice(3, 7)} ${new Date().getFullYear()}`
        this.setState({ month: month, icons: iconsfile })
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
        console.log(selectedDate.toString().slice(6, 10))


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
                                    icon: item.val().icon,
                                    receipturi: item.val().receipturi
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

    iconSelected(iconName) {

        this.setState({ iconName: iconName })

    }

    fileUpload() {
        let { image } = this.state;
        const upload = storage.ref(image.name).put(image);
        upload.on('state_changed',
            (snapshot) => {

            },
            (error) => {
                console.log(error);
            },
            () => {
                storage.ref(image.name).getDownloadURL().then(url => {
                    console.log(url);
                    this.setState({ imgURL: url });
                    this.setState({ uploaded: "Uploaded" })
                })
            });
    }

    addExpenditure() {
        let childKey = firebase.database().ref("Expenditure").push().getKey();
        if (this.state.selectedDate == "" || this.state.title == "" || this.state.quantity == "" || this.state.price == "" || this.state.iconName == "") {

            this.setState({ err: true })

        }
        else {
            if (this.state.imgURL != "") {
                firebase.database().ref("Expenditure").child(localStorage.getItem("schoolId")).child(this.state.selectedDate).child(childKey).set({

                    thing: this.state.title,
                    id: childKey,
                    quantity: Number(this.state.quantity),
                    price: Number(this.state.price),
                    totalprice: Number(this.state.price) * Number(this.state.quantity),
                    icon: this.state.iconName,
                    date: this.state.selectedDate,
                    receipturi: this.state.imgURL

                }).then(window.location.reload())

            } else {

                firebase.database().ref("Expenditure").child(localStorage.getItem("schoolId")).child(this.state.selectedDate).child(childKey).set({

                    thing: this.state.title,
                    id: childKey,
                    quantity: Number(this.state.quantity),
                    price: Number(this.state.price),
                    totalprice: Number(this.state.price) * Number(this.state.quantity),
                    icon: this.state.iconName,
                    date: this.state.selectedDate

                }).then(window.location.reload())
            }
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

                            <h2 class='center purple relative' >Expenditure
                            <Icon onClick={e => {
                                    this.openFormpop()
                                    this.setState({ addExpenditure: true })


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
                                                <h3 className="center regular" style={{ width: '50px' }}  >{item.title}</h3>

                                            </div>

                                            <h3 className=" center regular"  >{item.quantity}</h3>
                                            <h3 className=" center regular" >{item.price}</h3>
                                            <h3 className=" center regular" >{item.totalPrice}</h3>
                                            {item.receipturi != null && <img style={{ width: '18px', margin: 'auto', cursor: 'pointer' }} src={downloadIcon} nClick={async () => {

                                                // Get the download URL

                                                var xhr = new XMLHttpRequest();
                                                xhr.responseType = 'blob';
                                                xhr.onload = function (event) {
                                                    var blob = xhr.response;

                                                    download(blob)
                                                };
                                                xhr.open('GET', item.receipturi);
                                                xhr.send();

                                                // Or inserted into an <img> element:
                                                // var img = document.getElementById('myimg');
                                                // img.src = url;




                                            }}></img>}



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
                    this.setState({ iconName: "ic_inventory_stockdefault", err: false })

                }} aria-labelledby="form-dialog-title">

                    <img src={book} style={{ alignSelf: 'center', marginTop: '20px', backgroundColor: 'unset' }} className="icon" ></img>
                    <DialogTitle className="center purple" id="form-dialog-title">Add Expenditure</DialogTitle>

                    <DialogContent>

                        <div class='width-80 margin-auto margin-bottom-10'>

                            {this.state.err && <h3 className="red">Please fill all the fields to continue!</h3>}

                            <InputLabel htmlFor="input-with-icon-adornment">Item Name</InputLabel>
                            <Input

                                style={{ width: '100%' }}
                                onChange={e => { this.setState({ title: e.target.value }) }}
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <img src={item_ico} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                    </InputAdornment>
                                }
                            />

                        </div>

                        <div class='width-80 margin-auto margin-bottom-10'>


                            <InputLabel htmlFor="input-with-icon-adornment">Item Amount</InputLabel>
                            <Input

                                style={{ width: '100%' }}
                                type='Number'
                                onChange={e => { this.setState({ price: e.target.value }) }}
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <img src={dollar} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                    </InputAdornment>
                                }
                            />

                        </div>

                        <div class='width-80 margin-auto margin-bottom-10'>


                            <InputLabel htmlFor="input-with-icon-adornment">Item Quantity</InputLabel>
                            <Input
                                type='Number'
                                style={{ width: '100%' }}
                                onChange={e => { this.setState({ quantity: e.target.value }) }}
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <img src={quantity} style={{ backgroundColor: 'unset' }} className="icon-input-form" ></img>

                                    </InputAdornment>
                                }
                            />

                        </div>
                        <div class='width-80 margin-auto margin-bottom-10'>
                            <input class="upload-img" style={{ height: '30px' }} type="file" onChange={(e) => {
                                var { image } = this.state;
                                image = e.target.files[0]
                                this.setState({ image })
                                console.log(image)
                            }}></input>
                            <p>{this.state.uploaded}</p>

                            <button style={{ background: "#6437A1" }} className="content-btn" onClick={() => { this.fileUpload() }}>Upload</button>
                        </div>
                        <div class='width-80 margin-auto margin-bottom-10'>


                            {this.state.icons.map((item) => { return (<img src={`/${item.iconName}.png`} id={this.state.iconName == item.iconName ? "bg-purple" : "bg-white"} onClick={e => this.iconSelected(item.iconName)} style={{ backgroundColor: 'unset', cursor: 'pointer' }} className="icon"></img>) })}





                        </div>




                    </DialogContent>

                    <DialogActions className="width-80 margin-auto">
                        <Button style={{color:'red'}} className='purple' onClick={e => this.setState({ openform: false, addExpenditure: false, iconName: "ic_inventory_stockdefault", err: false })} >
                            Cancel
                            </Button>
                        <Button style={{color:'#6437A1'}}  onClick={e => this.addExpenditure()} >
                            Add
                            </Button>

                    </DialogActions>
                </Dialog>

                {/* Diaolog box form entery ends */}




            </div >



        )
    }
}
export default expenditure;