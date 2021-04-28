import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import mycopys from '../Images/landingCover.png'

import team from '../Images/team.png'
import inventory from '../Images/inventory.png'
import stock from '../Images/stock.png'
import content from '../Images/content-management-system.png'

import logo from '../Images/naseemlogo.png'
import headerImg from '../Images/about-img.png'
import aboutImg from '../Images/team@2x.png'
import movie from '../Images/movie@2x.png'
import ruler from '../Images/ruler@2x.png'
import online_class from '../Images/online-class.png'
import video from '../Images/video.png'
import neuroscience from '../Images/neuroscience.png'
import Grid from '@material-ui/core/Grid';
import online_learning from '../Images/online-learning.png'
import Group_1 from '../Images/Group_1.png'
import Group_2 from '../Images/Group_2.png'
import student_1 from '../Images/student_1.png'
import new_student from '../Images/new_student.png'
import group_5 from '../Images/group_5.png'

import azme_logo from '../Images/azme_logo.png'
import ren from '../Images/ren.png'
import stellar from '../Images/stellar.png'
import Box from '@material-ui/core/Box';
import axios from 'axios'

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';

import ItemsCarousel from 'react-items-carousel';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';



import executive from '../Images/executive.png'
import teacher from '../Images/Teacher-c.png'
import student from '../Images/student-c.png'
import principal from '../Images/Principal.png'
import amaan from '../Images/amaan.png'
import ali from '../Images/ali.png'
import sibghat from '../Images/sibghat.png'
import ibrahim from '../Images/ibrahim.png'
import dawood from '../Images/Dawood.png'
import pin from '../Images/pin@2x.png'
import mail from '../Images/mail@2x.png'
import call from '../Images/call-answer@2x.png'
import facebook from '../Images/facebook-letter-logo@2x.png'
import insta from '../Images/instagram-symbol@2x.png'
import twitter from '../Images/twitter@2x.png'
import playstore from '../Images/playstore@2x.png'
import appstore from '../Images/app-store (1)@2x.png'
import { BrowserRouter as Redirect, Link } from "react-router-dom";
const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

class aboutComponent extends Component {
    constructor() {
        super();
        this.state = {
            width: window.innerWidth,
            items: [],
            activeItemIndex: 1,
            receiver_email: ''

        }
    }

    sendRequestQuery = () => {
        let self = this
        if (this.state.receiver_email != '') {
            axios.post(`https://secure-hollows-56009.herokuapp.com/email`, {
                "request": {
                    "method": "sendDemo",
                    "data": {
                        "to": "hello@naseem.education",
                        "from": "bakra@qurbaniapp.com",
                        "link": this.state.receiver_email

                    }
                }
            }).then(res => {
                alert("Request Sent")
                self.setState({ receiver_email: '' })

            })
                .catch(error => {
                    console.log(error)
                })
        }
        else {
            alert("Empty email field")

        }

    }

    render() {
        return (
            <div className="about-section">
                <div className="about-navbar">
                    <img className="about-logo" src={logo}></img>
                    <div className="app-bar" style={{ marginTop: '10px', marginRight: '10px' }}>
                        <Box class='navRes' className="flex" display={{ xs: 'none', sm: 'flex' }}>
                            <a href="/"><h3 className="white about-btn">Home</h3></a>
                            <a href="#about"><h3 className="white about-btn" >Features</h3></a>
                            <a href="#products"><h3 className="white about-btn" >Products</h3></a>
                            <a href="#team"><h3 className="white about-btn" >Contact Us</h3></a>
                            {/* <a href="/terms&conditions"><h3 className="grey about-btn" >Terms & Conditions</h3></a> */}

                        </Box>
                        {/* <Box className="flex" display={{ xs: 'flex', sm: 'none' }}>
                    <a href="/about"><h3 className="white about-btn">Home</h3></a>
                        <a href="#about"><h3 className="white about-btn" >Features</h3></a>
                        <a href="#products"><h3 className="white about-btn" >Products</h3></a>
                        <a href="#team"><h3 className="white about-btn" >Contact Us</h3></a>  

                    </Box> */}
                        <IconButton
                            class='burger'
                            color="inherit"
                            aria-label="open drawer"
                            onClick={e => this.setState({ draweropen: !this.state.draweropen })}
                            edge="start"

                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer


                            variant="persistent"
                            anchor="left"
                            open={this.state.draweropen}

                        >
                            <Box style={{ margin: '0px', height: "100%", width: '220px', background: '#3AB639' }} className="flex" display={{ xs: 'block' }}>
                                <img className="about-logo" src={logo}></img>
                                <div style={{ marginTop: '100px' }}>
                                    <a href="/"><h3 className="white about-btn">Home</h3></a>
                                    <a href="#about"><h3 className="white about-btn" >Features</h3></a>
                                    <a href="#products"><h3 className="white about-btn" >Products</h3></a>
                                    <a href="#team"><h3 className="white about-btn" >Contact Us</h3></a>
                                </div>
                            </Box>
                        </Drawer>
                    </div>

                </div>
                <div className="margstop" style={{ background: '#3AB639', position: 'relative', paddingRight: '0px' }}>

                    <img src={mycopys} style={{ marginTop: '50px', width: '100%' }}></img>
                    <Box display={{ xs: 'none', sm: 'block' }}>
                        {/* <Button style={{position:'absolute',left:'60%',top:'62%',background:'white'}} size="large"> <span className="text-succ"> <b>Get Started</b> </span> </Button> */}

                    </Box>
                    <Box display={{ xs: 'block', sm: 'none' }}>
                        {/* <Button style={{position:'absolute',fontSize:'9px',left:'60%',top:'62%',background:'white'}} size="small"> <span className="text-succ"> <b>Get Started</b> </span> </Button> */}

                    </Box>

                </div>


                <div style={{ marginTop: '90px' }}>

                    {/* <div className="about-header">
                    <div>
                        <h1 className="flex white header-text" >GET FREE LEARNING SOLUTIONS</h1>
                        <h2 className="flex white header-text regular" >A personalized digital tutor that contextually teaches world knowledge to each student independently.</h2>
                    </div>
                    <div>
                        <img className="about-header-img" src={headerImg}></img>
                    </div>
                </div> */}

                    <h1 className="text-succ  center">Engage Learners With</h1>

                    <div className="about-team">
                        <div className="engage-div">
                            <img src={online_class} className="member-img"></img>
                            <h3 className="text-succ">Contextualised Learning</h3>

                        </div>
                        <div className="engage-div">
                            <img src={video} className="member-img"></img>
                            <h3 className="text-succ">Collaborative Learning Environment</h3>

                        </div>
                        <div className="engage-div">
                            <img src={neuroscience} className="member-img"></img>
                            <h3 className="text-succ">Automated Evaluations And Feedback</h3>

                        </div>

                    </div>


                    <Container style={{ marginTop: '150px' }}>
                        <Grid container>
                            <Grid md={6} xs={12} style={{ textAlign: 'center', alignSelf: 'center' }}>
                                <img src={Group_1} style={{ marginTop: '10%', width: '50%' }} ></img>


                            </Grid>
                            <Grid md={6} xs={12}>
                                <h2 className="text-succ"  >About Us</h2>
                                <h2 className="para-text regular flex">Naseem is a research-backed startup working on Artificial Intelligence and Education. We build on the latest developments in artificial intelligence, neuroscience and learning sciences to empower trainers and learners with the right set of tools. We experiment,
                                iterate and then improve our products based on user evaluations. With more than 20 years of experience in education and technology, every member of our team works closely with schools,

                        universities, corporates, NGOs and governments to design and develop customised products. </h2>

                            </Grid>

                        </Grid>
                    </Container>
                    {/* <div className="about-us" id="about" style={{marginTop:'150px'}}>
                    <div style={{alignSelf:'center'}}>
                        <img src={Group_1} className="about-us-img" ></img>

                    </div>
                    <div >
                        <h1 className="text-succ">About Us</h1>
                        <h2 className="text-succ regular flex">Naseem is a research-backed startup working on Artificial Intelligence and Education. We are using the latest developments in neuroscience, cognitive science and learning sciences to develop a personalised digital tutor for primary school students.   We are trying to develop an AI powered personalised digital tutor for primary school students. A tutor that interacts with students, learns from its interactions and helps each student based on their learning background and social contexts. </h2>

                    </div>

                </div> */}
                    <div id="products"></div>
                    <div style={{ marginTop: '90px' }}>
                        <h2 style={{ paddingBottom: '50px' }} className="text-succ   center" >Our Products</h2>
                        <Box style={{ textAlign: 'center' }} >
                            {/* <img src={Group_2} style={{marginTop:'5px !important'}} className="about-us-img" ></img> */}

                            <div className="flex-responsive" style={{ justifyContent: 'center' }}>
                                <Link to='/executive' >

                                    <div className="products-card">
                                        <img src={executive} className="member-img"></img>

                                        <h4 className="regular bold">Naseem Executive</h4>


                                    </div>
                                </Link>
                                <Link to='/principal' >

                                    <div className="products-card">
                                        <img style={{ marginTop: '110px' }} src={principal} className="member-img"></img>

                                        <h4 className="regular bold">Naseem Principal</h4>


                                    </div>
                                </Link>
                                <Link to='/teacher' >
                                    <div className="products-card">
                                        <img src={teacher} className="member-img"></img>

                                        <h4 className="regular bold">Naseem Teacher</h4>


                                    </div>
                                </Link>
                                <Link to='/student' >
                                    <div className="products-card">
                                        <img src={student} className="member-img"></img>

                                        <h4 className="regular bold">Naseem Student</h4>


                                    </div>
                                </Link>

                            </div>

                        </Box>
                        {/* <Box style={{ textAlign: 'center' }} display={{ xs: 'block', sm: 'none' }}>
                            <img src={Group_2} style={{ marginTop: '5px !important' }} width="200" ></img>

                        </Box> */}

                        <h2 className="para-text regular flex center " style={{ marginRight: '20vw', marginLeft: '20vw', marginTop: '50px' }}>We believe every learner is unique, so is their learning trajectory. Hence,
                        we utilise the latest research in learning sciences, artificial intelligence and neuroscience to analyse how every learner interacts with and learns your content,
                        on our customised platform. These powerful learning analytics are a first step towards contextualised learning experiences for each individual: learning the same content,
                    but with different pedagogies in accordance with their needs.</h2>

                        <div id="about"></div>

                        <Container style={{ marginTop: '150px' }}>
                            <h2 className="text-succ  center" >One Platform Customised for you</h2>

                            <Grid container className='OurPlatform' style={{ marginTop: '50px' }}>
                                <Grid md={3} sm={12} className="text-center">
                                    <img class="img-platform" src={team}></img>
                                    <h2 style={{ fontWeight: 'bold' }} className="para-text green">Content Mangement</h2>

                                </Grid>

                                <Grid md={3} sm={12} className="text-center">
                                    <img class="img-platform" src={inventory}></img>
                                    <h2 style={{ fontWeight: 'bold' }} className="para-text green">Financial Management</h2>
                                </Grid>

                                <Grid md={3} sm={12} className="text-center">
                                    <img class="img-platform" src={stock}></img>
                                    <h2 style={{ fontWeight: 'bold' }} className="para-text green">Inventory Management</h2>
                                </Grid>

                                <Grid md={3} sm={12} className="text-center">
                                    <img class="img-platform" src={content}></img>
                                    <h2 style={{ fontWeight: 'bold' }} className="para-text green">HR Management</h2>
                                </Grid>

                            </Grid>
                        </Container>




                        {/* <h2 className="about-grey regular center" style={{margin:'0px 6vw'}}>Our PhD holders in AI have experience in training and implementing GANs, RNNs, CNNs and Deep Reinforcement Learning algorithms for the industry and academia </h2>
                    <div className="about-team">
                    
                    <div className="packages-div" style={{boxShadow: '0px 3px 6px #00000029'}}>
                            <div className="cardheads" style={{background:'#3AB639',height:'180px',boxShadow: '0px 3px 6px #00000029'}}>
                                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                        
                                <img src={new_student} width="100" style={{marginTop:'20px'}}></img>
                                </div>
                                <h3 style={{display:'block',color:'white'}}>Free Package</h3>
                            </div>
                            <div style={{marginLeft:'auto',marginRight:'auto'}}>
                                <h2 className="text-succ">PKR 0</h2>
                                <h2 className="regular" style={{textAlign:'left',marginLeft:'20px'}}>1) 2 Months free trial </h2>
                                <h2 className="regular" style={{textAlign:'left',marginLeft:'20px'}} >2) Full Technical Support</h2>
                                <h2 className="regular" style={{textAlign:'left',marginLeft:'20px'}}>3) Proper Training on LMS</h2>

                            </div>

                    </div>
                    <div className="packages-div" style={{boxShadow: '0px 3px 6px #00000029'}}>
                            <div className="cardheads"  style={{background:'#3AB639',height:'180px',boxShadow: '0px 3px 6px #00000029'}}>
                                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                        
                                <img src={student_1} width="100" style={{marginTop:'20px'}}></img>
                                </div>
                                <h3 style={{display:'block',color:'white'}}>Standard Package</h3>
                            </div>
                            <div style={{marginLeft:'auto',marginRight:'auto'}}>
                                <h2 className="text-succ">PKR 100/Student</h2>
                                <h2 className="regular" style={{textAlign:'left',marginLeft:'20px'}}>1) 2 Months free trial </h2>
                                <h2 className="regular" style={{textAlign:'left',marginLeft:'20px'}} >2) Full Technical Support</h2>
                                <h2 className="regular" style={{textAlign:'left',marginLeft:'20px'}}>3) Proper Training on LMS</h2>

                            </div>

                    </div>

                    </div> */}
                    </div>
                    <Container size="sm" style={{ marginTop: '150px' }}>
                        <h2 style={{ paddingBottom: '50px' }} className="text-succ  center" >Our Partners</h2>
                        <Carousel responsive={responsive}
                            infinite={true}
                            autoPlay={true}
                            autoPlaySpeed={2000}
                            removeArrowOnDeviceType={["tablet", "mobile"]}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <img src={azme_logo} style={{ width: 'unset' }} />

                            </div>
                            <div style={{ textAlign: 'center' }}><img src={stellar} style={{ width: 'unset' }} /></div>
                            <div style={{ textAlign: 'center' }}> <img src={ren} style={{ width: 'unset' }} /></div>

                        </Carousel>
                        {/* <Carousel showThumbs={false} autoPlay={1000} infiniteLoop={true}> 
                <div>
                <div style={{height:'325px'}}>
                    <img src={azme_logo} style={{width:'unset'}} />
                    <p className="legend">Legend 1</p>
                </div>
                </div>
                <div style={{height:'325px'}}> 
                    <img src={stellar} style={{width:'unset'}} />
                    <p className="legend">Legend 2</p>
                </div>
                <div style={{height:'325px'}}> 
                    <img src={ren} style={{width:'unset'}} />
                    <p className="legend">Legend 3</p>
                </div>
          
            </Carousel>
                                */}
                        {/* <ItemsCarousel
                                infiniteLoop={true}
                                gutter={2}
                                activePosition={'center'}
                                chevronWidth={60}
                                disableSwipe={false}
                                alwaysShowChevrons={false}
                                slidesToScroll={1}
                                numberOfCards={this.state.width >= 1700 ? 3 : this.state.width <= 1699 && window.innerWidth >= 1400 ? 3 : this.state.width <= 1399 && window.innerWidth >= 1080 ? 3 : this.state.width <= 1079 && window.innerWidth >= 760 ? 2 : 1}
                                outsideChevron={true}
                                leftChevron={<i style={{fontSize:'6rem'}} className="text-succ fas fa-caret-left"></i>}
                                rightChevron={<i style={{fontSize:'6rem'}} className="text-succ fas fa-caret-right"></i>}
                                showSlither={true}
                                firstAndLastGutter={false}
                                activeItemIndex={this.state.activeItemIndex}
                                requestToChangeActive={value => this.setState({ activeItemIndex: value })}
                              
                            >
                                <div>
                                    <img  src={azme_logo}></img>
                                </div>
                                <div>
                                <img  src={stellar}></img>
                                </div>
                                <div>
                                <img  src={ren}></img>
                                </div>
                    </ItemsCarousel> */}
                    </Container>
                    <Container maxWidth="md" style={{ marginTop: '50px' }} >
                        <Box component="span" display={{ xs: 'none', sm: 'none', md: 'block' }}>

                            <Grid container>
                                <Grid md={6} xs={12} className="text-right" style={{ alignSelf: 'center' }}>
                                    <h2 className="text-succ" style={{ marginRight: '15%' }} id="team">Contact us for demo</h2>
                                    <div>
                                        <Grid container spacing={1} justify="flex-end">

                                            <Grid item style={{ paddingRight: '0px' }}>


                                                <input value={this.state.receiver_email} onChange={(e) => {
                                                    this.setState({ receiver_email: e.target.value })
                                                }}
                                                    style={{
                                                        padding: '16px ', width: '300px', background: '#FFFFFF 0% 0% no-repeat padding-box',
                                                        boxShadow: '0px 9px 6px #00000029',
                                                        borderRadius: '3px', border: '1px solid white', outlineColor: 'white'
                                                    }} ></input>
                                                {/* <TextField className="myshadows" id="input-with-icon-grid" 
                                style={{background: '#FFFFFF 0% 0% no-repeat padding-box',
                                boxShadow: '0px 9px 6px #00000029',
                                borderRadius: '33px'}}  /> */}
                                            </Grid>
                                            <Grid item style={{ paddingLeft: '0px' }}>
                                                <Button onClick={this.sendRequestQuery} size="large" variant="contained" className=" sendbtn bg-succ" style={{ padding: '13px', borderRadius: '0px', color: 'white' }}>
                                                    SEND
                                    </Button>
                                            </Grid>
                                        </Grid>

                                    </div>
                                </Grid>
                                <Grid md={6} xs={12} style={{ textAlign: 'start' }}>

                                    <img src={online_learning} width='150'></img>

                                </Grid>
                            </Grid>
                        </Box>
                        <Box component="span" display={{ xs: 'block', sm: 'block', md: 'none' }}>

                            <Grid container>
                                <Grid md={6} xs={12} className="text-center">
                                    <h2 className="text-succ"  >Contact us for demo</h2>
                                    <div>
                                        <Grid container justify="center">

                                            <Grid xs={6} item style={{ paddingRight: '0px' }}>


                                                <input value={this.state.receiver_email} onChange={(e) => {
                                                    this.setState({ receiver_email: e.target.value })
                                                }} style={{
                                                    padding: '16px 10px 17px', width: '100%', background: '#FFFFFF 0% 0% no-repeat padding-box',
                                                    boxShadow: '0px 9px 6px #00000029',
                                                    borderRadius: '3px', border: '1px solid white', outlineColor: 'white'
                                                }} ></input>

                                            </Grid>
                                            <Grid item style={{ paddingLeft: '0px' }}>
                                                <Button onClick={this.sendRequestQuery} size="large" variant="contained" className="sendbtn bg-succ" style={{ padding: '13px', borderRadius: '0px', color: 'white' }}>
                                                    SEND
                                        </Button>
                                            </Grid>
                                        </Grid>

                                    </div>
                                </Grid>
                                <Grid md={6} xs={12} style={{ textAlign: 'center' }}>

                                    <img src={online_learning} style={{ marginBottom: '15px' }} width="150" ></img>

                                </Grid>
                            </Grid>
                        </Box>


                    </Container>

                    <div style={{ backgroundColor: '#3AB639' }}>
                        <Grid container>
                            <Grid md={4} className="center" xs={12}>
                                <h3 className="white" style={{ marginBottom: '0px' }}>Naseem Education</h3>
                                <h4 className="white" style={{ fontWeight: '500', marginTop: '10px', marginBottom: '10px' }}>Office 1206,National Science & <br />
                               Technology Park,H-12, Islamabad</h4>
                                <h4 className="white" style={{ fontWeight: '500', marginTop: '10px' }}>+92 306 5401886</h4>

                            </Grid>
                            <Grid md={4} xs={12} id='features' style={{ textAlign: 'center' }}>
                                <h3 className="white" style={{ marginBottom: '0px' }}>Top Features</h3>
                                <h4 className="white" style={{ fontWeight: '500', marginTop: '10px', marginBottom: '10px' }}>Content Management</h4>
                                <h4 className="white" style={{ fontWeight: '500', marginTop: '10px', marginBottom: '10px' }}>Financial Mangement</h4>
                                <h4 className="white" style={{ fontWeight: '500', marginTop: '10px', marginBottom: '10px' }}>Inventory Management</h4>
                                <h4 className="white" style={{ fontWeight: '500', marginTop: '10px' }}>HR Management</h4>

                            </Grid>
                            <Grid md={4} xs={12} style={{ textAlign: 'center' }}>
                                <h3 className="white" style={{ marginBottom: '0px' }}>Follow Us</h3>
                                <h4 className="white" style={{ fontWeight: '500', marginTop: '10px', marginBottom: '10px' }}>Content Management</h4>
                                <a href="https://www.linkedin.com/company/naseem/" target="_blank"><i class="white fab fa-linkedin"></i></a>
                                <a href="https://web.facebook.com/naseemeducation?_rdc=1&_rdr" target="_blank"><i style={{ marginLeft: '10px' }} className="white fab fa-facebook-f"></i></a>
                                <div style={{ marginTop: '10px' }}>
                                    <img style={{ borderRadius: '5px' }} width="50" src={logo}></img>
                                </div>


                            </Grid>

                        </Grid>
                    </div>
                    {/* <div className="about-footer">
                    <div className="footer-section"> 
                        <h3 className="white " style={{marginBottom:'0px'}}>Naseem Education</h3>

                        <div className="flex-no-wrap no-margin-padding justify-center-sm">
                            <img src={pin} className="about-icon"></img>
                            <h4 className="regular white">Office No: 1206, National Science & Technology Park, H-12</h4>
                        </div>
                        <Box className="flex-no-wrap " display={{ xs: 'flex', sm: 'none' }}>
                            <img src={mail} className="about-icon"></img>
                            <h4 className="regular white">hello@naseem.education</h4>
                        </Box>
                        <Box className="flex-no-wrap " display={{ xs: 'flex', sm: 'none' }}>
                            <img src={call} className="about-icon"></img>
                            <h4 className="regular white">+92 306 5401886</h4>
                        </Box>

                       

                    </div>
                    <Box className="footer-section" style={{marginTop:'20%'}} display={{ xs: 'none', sm: 'block' }}>
                    <div className="flex-no-wrap ">
                        <img src={mail} className="about-icon"></img>
                        <h4 className="regular white">hello@naseem.education</h4>
                    </div>
                    <div className="flex-no-wrap">
                        <img src={call} className="about-icon"></img>
                        <h4 className="regular white">+92 306 5401886</h4>
                    </div>

                    </Box>
                                 </div> */}

                </div>







            </div>
        )
    }
}

export default aboutComponent;