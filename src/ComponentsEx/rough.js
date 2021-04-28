import React, {Component} from 'react';
import './AppEx.css';
import '../config'; 
import* as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import Chart from './chart'
import MonthlyExpense from './monthlyExpense'

import MonthlyChart from './MonthlyChart'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import fire from '../config';
import principalImg from '../ImagesEx/principal.png'
import schoolImg from '../ImagesEx/school.png'
import dashboardBanner from '../ImagesEx/dashboard-banner.png'
import schoolDetails from '../ComponentsEx/schoolDetails'


class dashboardComponent extends Component {

    
    constructor(){
        super();
        this.state = {
            selectedYear:new Date().getFullYear().toString(),
            series: [{
                name: "Expenses",
              }],
            options: {
                data: [100,10,10,10,10,10,10,10,10,10],

                chart: {
                  type: 'bar',
                  height: 350
                },
                plotOptions: {
                  bar: {
                    horizontal: false,
                  }
                },
                dataLabels: {
                  enabled: false,
                  style: {
                    colors: ['#F44336', '#E91E63', '#9C27B0']
                  } 
                },
                xaxis: {
                  categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov"],
                }
              },

            
            mothly_expense:[0,0,0,0,0,0,0,0,0,0,0,0],
            monthly_revenue:[0,0,0,0,0,0,0,0,0,0,0,0],
            monthly_profit:[0,0,0,0,0,0,0,0,0,0,0,0],
            chart_props:[],
            monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov"
            ],

            schools: [],
            principals: [],
            expense: 0,
            revenue: 0,
            profit: 0,
            students: 0,
            classes: [],
            teachers: 0,
            organization: '',
            years:[]
            
            
        }

    }

    componentDidMount(){
        this.getOrganization()
        this.getYears()
        
    }

    getYears(startYear) {
        var currentYear = new Date().getFullYear(), years = [];
        startYear = startYear || 1980;  
        while ( startYear <= currentYear ) {
            years.push(startYear++);
        }   
        this.setState({years})
    }
    emptyStates(){
        this.setState({
            mothly_expense:[0,0,0,0,0,0,0,0,0,0,0,0],
            monthly_revenue:[0,0,0,0,0,0,0,0,0,0,0,0],
            monthly_profit:[0,0,0,0,0,0,0,0,0,0,0,0],
            expense: 0,
            revenue: 0,
            profit: 0,
        })
    }


    getOrganization(){
        firebase.database().ref("Organization").once("value").then(snapshot=> {
            snapshot.forEach(organization => {
                if (organization.val().organizationName == localStorage.getItem("user")){
                    this.setState({organization: organization.key})

                }
            })

            this.getSchools();
            this.getPrincipals();
        
            

        })
    }

    async getSchools(){
        let {schools} = this.state;
        
        await firebase.database().ref("School").once("value").then(snapshot => {
            snapshot.forEach(organization => {  
                if (organization.key == this.state.organization ){
                    organization.forEach(item => {
                        schools.push(item.val())
                    })
                }      
                
            })
            this.setState({schools})
            this.getFinances();
            this.getTotals();
            
        })
    }

    async getPrincipals(){
        let {principals} = this.state;
        
        await firebase.database().ref("Principal").once("value").then(snapshot => {
            this.state.schools.forEach(school=> {
                snapshot.forEach(School => {
                    if (school.id == School.key ){
                        School.forEach(item => {
                            principals.push(item.val())
                        })
                    }        
                    
                })
            })
            
            this.setState({principals})
            
        })
    }

    async getTotals(){
        let {students, classes, teachers,monthly_revenue} = this.state;

        students = 0;
        

        classes = [];
        await firebase.database().ref("Classes").once("value").then(snapshot => {
            this.state.schools.forEach(school=> {
                snapshot.forEach(School => {  
                    if(School.key == school.id){
                        School.forEach(section => {
                            classes.push(section.val())
                            
                        })

                    }
                    
                })

            })
            
            this.setState({classes})

            
            firebase.database().ref("Student").once("value").then(snapshot => {
                classes.forEach(Class=> {
                    snapshot.forEach(section => {   
                        if (section.key == Class.id){
                            section.forEach(student => {
                                students = students + 1;
                                
                            })
                        }     
                        
                    })
                
                })
                
                this.setState({students})
                
            })
            
        })

        teachers = 0;
        await firebase.database().ref("Teachers").once("value").then(snapshot => {
            this.state.schools.forEach(school=> {
                snapshot.forEach(School => {   
                    if (School.key == school.id){
                        School.forEach(teacher => {
                            teachers = teachers + 1;
                            
                        })

                    }     
                    
                })

            })
            this.setState({teachers})
            
        })


    }

    async getFinances(){
        let {monthly_revenue} = this.state;
       let months=[`01-${this.state.selectedYear}`,`02-${this.state.selectedYear}`,`03-${this.state.selectedYear}`,`04-${this.state.selectedYear}`,`05-${this.state.selectedYear}`,`06-${this.state.selectedYear}`,
       `07-${this.state.selectedYear}`,`08-${this.state.selectedYear}`,`09-${this.state.selectedYear}`,`10-${this.state.selectedYear}`,`11-${this.state.selectedYear}`,`12-${this.state.selectedYear}`]
        
        await firebase.database().ref("Fee").once("value").then(snapshot => {
            let {revenue} = this.state;
            this.state.schools.forEach(School => {
                snapshot.forEach(school => { 
                    if(school.key == School.id ){
                        school.forEach(section => {
                            section.forEach(month => {
                                if (month.key == this.state.selectedYear){
                                } else {
                                    month.forEach(student => {
                                        if(student.val().status == true && student.val().fee != null){
                                            let ind=months.findIndex(it=>it==month.key)
                                            monthly_revenue[ind]=monthly_revenue[ind]+parseInt(student.val().fee, 10)

                                            if(student.val().fee>0){
                                                
                                                    revenue = revenue + parseInt(student.val().fee, 10)
                                                    console.log(revenue)
                                                
                                          
                                            }
                                        } 
                                    })
                                }
                                
                            })
                            
                        })

                    }       
                    
                })

            })
            
            this.setState({revenue})
            
        })

        
        let {expense,series,options} = this.state;
        let {revenue} = this.state;
        let {profit} = this.state;
        let {mothly_expense}=this.state

        let arrs=[]

        

        await firebase.database().ref("Expenditure").once("value").then(async snapshot => {
            this.state.schools.forEach(School => {
                snapshot.forEach(school => {   
                    if(school.key == School.id){
                        school.forEach(date => {
                          
                            date.forEach(async item => {

                                let brokedate=item.val().date.split('-')
                                let ind=months.findIndex(it=>it==brokedate[1]+'-'+brokedate[2])
                                if(item.val().totalprice !=null){
                                    mothly_expense[ind]=mothly_expense[ind]+parseInt(item.val().totalprice, 10)
                                    expense = expense + parseInt(item.val().totalprice, 10)
                                    
                                }
                            
        
                            })
                        })
                    }     
                    
                })

            })
            
            
            
            profit = revenue - expense;
            this.setState({expense})
            this.setState({profit})
            await this.setState({mothly_expense})
            series[0].data=mothly_expense

            this.setState({monthly_revenue})
            this.setState({series})
            console.log(series)
            this.setState({options})

            let {monthly_profit}=this.state
            monthly_profit.forEach(async (item,i)=>{
                monthly_profit[i] = monthly_revenue[i] - mothly_expense[i];
                await this.setState({monthly_profit})

            })
            // console.log("monthly revenue")
            // console.log(monthly_revenue)

            // console.log("monthly expense")
            // console.log(mothly_expense)

            // console.log("monthly profit")
            // console.log(monthly_profit)
            let data=[]
            monthly_profit.forEach((item,i)=>{

                data.push({
                    month:this.state.monthNames[i],
                    Revenue:monthly_revenue[i]>=0 ?monthly_revenue[i]:monthly_profit[i],
                    Profit:monthly_profit[i] >= 0 ? monthly_profit[i] : 0,
                    loss: monthly_profit[i] >= 0 ? 0 : Math.abs(parseInt(monthly_profit[i], 10)),
                    color: "#bebebe"



                })

            })

            this.setState({chart_props:data})


          


            
        })

        



    }



    render(){
        

        return (
            <div className="dashboard-ex" >
                
                <div className="dashboard-header">
                <img src={window.innerWidth >= 900 ? dashboardBanner : dashboardBanner} className="title-img"></img>
                <h1 className="white title">Welcome To Your Dashboard</h1>

                </div>
                

                
                
                

                <Container >
                    <h2 className="padding-left-10 regular green">Your List Of Schools</h2>
                    <div className="horizontal-scroll">
                        {this.state.schools.map((school) => {
                            
                            return (
                                <Link to={{
                                    pathname: `${window.location.pathname}${school.id}`,   
                                    state: {
                                      school: school.schoolName,
                                      schoolId: school.id
                                    }
                                  }}>
                                        <div style={{position:'relative'}} className="school-card" onClick={()=>{
                                            return <Redirect to='/executive/school' />
                                        }}>
                                            <h4 className="regular no-margin-padding">{school.schoolName}</h4>
                                            <p style={{fontSize:'14px'}} className="regular no-margin-padding">{school.refId}</p>
                                            <img style={{position:'absolute', bottom:'25px'}} src={schoolImg} className="school-img" ></img>

                                        </div>
                                      
                                    </Link>
                                
                                
                                
                            )
                        
                        })
                        
                        }

                    </div>

                </Container>
                
                <Container>
                         <Grid container>
                            <Grid md={6} xs={12} lg={6}>
                            <h2 className="regular green center">Check your profit loss</h2>
                            <div className="mychart">
                            <Chart/>

                            </div>                                
                            </Grid>

                            <Grid md={6} xs={12} lg={6}>
                            <h2 className="regular green center">Your School Principals</h2>
                            <div className="principal" >
                            <div className="principal-container">
                            {this.state.principals.map((principal)=> {
                            return (
                                <div className= "principal-name">
                                    <img src={principalImg} className="principal-img"></img>
                                    <h4 className="regular">Miss: {principal.userName}</h4>
                                </div>
                            )
                            })

                            }

                        </div>
                        </div>
                            </Grid>
                         </Grid>

                        
                          
                

               
                
                {/* <div className="flex-responsive-ex">
                    <div className="container-ex">
                        <h2 className="regular green center">Your Fee Detail Of All Schools</h2>
                        <div className="chart">
                        <Chart/>

                        </div>
                        
                    </div>
                    <div className="container-ex ">
                        <h2 className="regular green center">Your School Principals</h2>
                        <div className="principal-container">
                            {this.state.principals.map((principal)=> {
                            return (
                                <div className= "principal-name">
                                    <img src={principalImg} className="principal-img"></img>
                                    <h4 className="regular">Miss: {principal.userName}</h4>
                                </div>
                            )
                            })

                            }

                        </div>
                        
                    </div>

                    
                

                </div> */}


                

                <div className="flex-responsive" style={{justifyContent:'center'}}>
                    <div className="totals-card">
                        <h4 className="regular">Total Students</h4>
                        <h2 className="regular">{this.state.students}</h2>

                    </div>
                    <div className="totals-card">
                        <h4 className="regular">Total Classes</h4>
                        <h2 className="regular">{this.state.classes.length}</h2>

                    </div>
                    <div className="totals-card">
                        <h4 className="regular">Total Teachers</h4>
                        <h2 className="regular">{this.state.teachers}</h2>

                    </div>

                </div>

             
                        
                <div className="flex-responsive" style={{justifyContent:'center'}}>
                    <div className="finances-card">
                        <h4 className="regular">Your Expense</h4>
                        <h2 className="regular">{this.state.expense}</h2>

                    </div>
                    <div className="finances-card">
                        <h4 className="regular">Your Revenue</h4>
                        <h2 className="regular">{this.state.revenue}</h2>

                    </div>
                    <div className="finances-card">
                        <h4 className="regular">Your Profit</h4>
                        <h2 className="regular">{this.state.profit}</h2>

                    </div>

                </div>
             
                </Container>


                <Container>
                         <Grid container>
                            <Grid md={6} xs={12} lg={6}>
                            <h2 className="regular green center">Check your profit loss</h2>
                            <div className="mychart">
                            <MonthlyChart  monthlyAnalytics={this.state.chart_props}/>

                            </div>                                
                            </Grid>

                            <Grid md={6} xs={12} lg={6}>
                            <h2 className="regular green center">Monthly Expense</h2>
                            <div className="mychart">
                            <div className="yearFilter"><p style={{margin:0, padding:0,paddingRight:10,color:'#919191'}}>Filter: </p>
                <select onChange={e=>{this.setState({selectedYear:e.target.value
                                
                                })
                                this.emptyStates()
                                this. getOrganization()
                                }
                                
                                }>
                                    {this.state.years.slice(0).reverse().map((item,i)=>{
                                    return( <option value={Number(item)}>{item}</option>)

                                    })}
                                </select>
                                </div>
                                {this.state.mothly_expense.length>0 && <MonthlyExpense thedata={this.state.mothly_expense} months={this.state.monthNames}/>}
                      
                            </div>
                            </Grid>
                         </Grid>

                        
                          
                

                </Container>

        

                   
                


                
             
            </div>
          );

    }
}

export default dashboardComponent;