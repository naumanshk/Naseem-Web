import React, { Component } from 'react';
import './AppEx.css';
import '../config';
import * as firebase from 'firebase'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from "react-router-dom";
import Chart from './chart'
import MonthlyExpense from './monthlyExpense'

import MonthlyChart from './MonthlyChart'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import fire from '../config';
import principalImg from '../ImagesEx/principal.png'
import schoolImg from '../ImagesEx/school.png'
import dashboardBanner from '../ImagesEx/dashboard-ex.png'
import schoolDetails from '../ComponentsEx/schoolDetails'


class dashboardComponent extends Component {


    constructor() {
        super();
        this.state = {

            series: [{
                name: "Expenses",
            }],
            options: {
                data: [100, 10, 10, 10, 10, 10, 10, 10, 10, 10],

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

            months: [`01-${new Date().getFullYear()}`, `02-${new Date().getFullYear()}`, `03-${new Date().getFullYear()}`, `04-${new Date().getFullYear()}`, `05-${new Date().getFullYear()}`, `06-${new Date().getFullYear()}`,
            `07-${new Date().getFullYear()}`, `08-${new Date().getFullYear()}`, `09-${new Date().getFullYear()}`, `10-${new Date().getFullYear()}`, `11-${new Date().getFullYear()}`, `12-${new Date().getFullYear()}`],
            mothly_expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            monthly_revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            monthly_profit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            chart_props: [],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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
            years: [],
            selectedYear: new Date().getFullYear()

        }

    }

    componentDidMount() {
        this.getOrganization(),
            this.getYears(2010)

    }
    async emptyStates() {
        this.state.chart_props.length,
            await this.setState({
                mothly_expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                monthly_revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                monthly_profit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                expense: 0,
                revenue: 0,
                profit: 0,
                students: 0,

                teachers: 0,
            })

    }
    async filterYears() {
        await this.setState({
            months: [`01-${this.state.selectedYear}`, `02-${this.state.selectedYear}`, `03-${this.state.selectedYear}`, `04-${this.state.selectedYear}`, `05-${this.state.selectedYear}`, `06-${this.state.selectedYear}`,
            `07-${this.state.selectedYear}`, `08-${this.state.selectedYear}`, `09-${this.state.selectedYear}`, `10-${this.state.selectedYear}`, `11-${this.state.selectedYear}`, `12-${this.state.selectedYear}`],
        })
    }
    getYears(startYear) {
        var currentYear = new Date().getFullYear(), years = [];
        startYear = startYear || 1980;
        while (startYear <= currentYear) {
            years.push(startYear++);
        }
        this.setState({ years })
    }

    getOrganization() {
        firebase.database().ref("Organization").once("value").then(snapshot => {
            snapshot.forEach(organization => {
                if (organization.val().organizationName == localStorage.getItem("user")) {
                    this.setState({ organization: organization.key })

                }
            })

            this.getSchools();
            this.getPrincipals();



        })
    }

    async getSchools() {
        let { schools } = this.state;

        await firebase.database().ref("School").once("value").then(snapshot => {
            snapshot.forEach(organization => {
                if (organization.key == this.state.organization) {
                    organization.forEach(item => {
                        schools.push(item.val())
                    })
                }

            })
            this.setState({ schools })
            this.getFinances();
            this.getTotals();

        })
    }

    async getPrincipals() {
        let { principals } = this.state;

        await firebase.database().ref("Principal").once("value").then(snapshot => {
            this.state.schools.forEach(school => {
                snapshot.forEach(School => {
                    if (school.id == School.key) {
                        School.forEach(item => {
                            principals.push(item.val())
                        })
                    }

                })
            })

            this.setState({ principals })

        })
    }

    async getTotals() {
        let { students, classes, teachers, monthly_revenue } = this.state;

        students = 0;


        classes = [];
        await firebase.database().ref("Classes").once("value").then(snapshot => {
            this.state.schools.forEach(school => {
                snapshot.forEach(School => {
                    if (School.key == school.id) {
                        School.forEach(section => {
                            classes.push(section.val())

                        })

                    }

                })

            })

            this.setState({ classes })


            firebase.database().ref("Student").once("value").then(snapshot => {
                classes.forEach(Class => {
                    snapshot.forEach(section => {
                        if (section.key == Class.id) {
                            section.forEach(student => {
                                students = students + 1;

                            })
                        }

                    })

                })

                this.setState({ students })

            })

        })

        teachers = 0;
        await firebase.database().ref("Teachers").once("value").then(snapshot => {
            this.state.schools.forEach(school => {
                snapshot.forEach(School => {
                    if (School.key == school.id) {
                        School.forEach(teacher => {
                            teachers = teachers + 1;

                        })

                    }

                })

            })
            this.setState({ teachers })

        })


    }

    async getFinances() {
        // let { monthly_revenue } = this.state;
        // let { revenue } = this.state;
        var revenue = 0
        var monthly_revenue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let { series, options } = this.state;
        let expense = 0
        // let { revenue } = this.state;
        let profit = 0;
        let mothly_expense = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        let arrs = []

        // getting fees 
        await firebase.database().ref("Fee").once("value").then(snapshot => {

            this.state.schools.forEach(School => {
                snapshot.forEach(school => {
                    if (school.key == School.id) {
                        school.forEach(section => {
                            section.forEach(month => {

                                if (month.key == '12-2019') {
                                } else {
                                    month.forEach(student => {
                                        if (student.val().status == true && student.val().fee != null) {
                                            
                                            
                                            // comparing months and getting paid fees of every month of the selected year (month wise revenue is ganerated here)
                                            let ind = this.state.months.findIndex(it => it == month.key)
                                            monthly_revenue[ind] = monthly_revenue[ind] + parseInt(student.val().fee, 10)

                                            if (student.val().fee > 0 && month.key.slice(3) == this.state.selectedYear) {
                                                // total revenue of the selected year
                                                revenue = revenue + parseInt(student.val().fee, 10)

                                            }
                                        }
                                    })
                                }

                            })

                        })

                    }

                })

            })

            this.setState({ revenue })

        })


        await firebase.database().ref("Expenditure").once("value").then(async snapshot => {
            this.state.schools.forEach(School => {
                snapshot.forEach(school => {
                    if (school.key == School.id) {
                        school.forEach(date => {

                            date.forEach(async item => {

                                            // comparing months and getting month wise expenditure of the selected year 

                                let brokedate = item.val().date.split('-')
                                let ind = this.state.months.findIndex(it => it == brokedate[1] + '-' + brokedate[2])
                                mothly_expense[ind] = mothly_expense[ind] + parseInt(item.val().totalprice, 10)
                                if (brokedate[2] == this.state.selectedYear) {
                                    // total expense of the selected year
                                    expense = expense + parseInt(item.val().totalprice, 10)
                                }

                            })
                        })
                    }

                })

            })


            // calculating profite of the selected year
            profit = revenue - expense;
            this.setState({ expense })
            this.setState({ profit })
            await this.setState({ mothly_expense })
            series[0].data = mothly_expense

            this.setState({ monthly_revenue })
            this.setState({ series })
            console.log(series)
            this.setState({ options })

            // calculating monthly profit of the selected year 
            let monthly_profit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            monthly_profit.forEach(async (item, i) => {
                monthly_profit[i] = monthly_revenue[i] - mothly_expense[i];
                await this.setState({ monthly_profit })

            })
            // console.log("monthly revenue")
            // console.log(monthly_revenue)

            // console.log("monthly expense")
            // console.log(mothly_expense)

            // console.log("monthly profit")
            // console.log(monthly_profit)
            
            //setting data fir visualization of profit, loss and revenue graph  
            let data = []
            monthly_profit.forEach((item, i) => {

                data.push({
                    month: this.state.monthNames[i],
                    Revenue: monthly_revenue[i] >= 0 ? monthly_revenue[i] : monthly_profit[i],
                    Profit: monthly_profit[i] >= 0 ? monthly_profit[i] : 0,
                    loss: monthly_profit[i] >= 0 ? 0 : Math.abs(parseInt(monthly_profit[i], 10)),
                    color: "#bebebe"



                })

            })

            this.setState({ chart_props: data })






        })





    }



    render() {


        return (
            <div className="dashboard-ex" >

                <div className="dashboard-header-ex">
                    <img src={window.innerWidth >= 900 ? dashboardBanner : dashboardBanner} className="title-img-ex"></img>
                    {/* <h1 className="white title">Welcome To Your Dashboard</h1> */}

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
                                    <div style={{ position: 'relative' }} className="school-card" onClick={() => {
                                        return <Redirect to='/executive/school' />
                                    }}>
                                        <h4 className="regular no-margin-padding">{school.schoolName}</h4>
                                        <p style={{ fontSize: '14px' }} className="regular no-margin-padding">{school.refId}</p>
                                        <img style={{ position: 'absolute', bottom: '25px' }} src={schoolImg} className="school-img" ></img>

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
                                <Chart />

                            </div>
                        </Grid>

                        <Grid md={6} xs={12} lg={6}>
                            <h2 className="regular green center">Your School Principals</h2>
                            <div className="principal" >
                                <div className="principal-container">
                                    {this.state.principals.map((principal) => {
                                        return (
                                            <div className="principal-name">
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



                    <div className="flex-responsive" style={{ justifyContent: 'center' }}>

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

                    <div className="flex-responsive" style={{ justifyContent: 'center', marginBottom: '20px' }}>

                        <div className="yearFilter"><p style={{ fontSize: '18px', margin: 0, padding: 0, paddingRight: 10, color: '#919191' }}>Filter: </p>
                            <select onChange={e => {

                                this.setState({
                                    selectedYear: Number(e.target.value)

                                }, () => {
                                    this.emptyStates(),
                                        this.filterYears()
                                    this.getFinances()
                                })

                            }


                            }style={{width: '100px',border:'1px solid #14A73F ',color:'#14A73F '}}
                            >
                                {this.state.years.slice(0).reverse().map((item, i) => {
                                    return (<option value={Number(item)}>{item}</option>)

                                })}

                            </select>
                        </div>
                    </div>

                    <div className="flex-responsive" style={{ justifyContent: 'center' }}>
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
                                <MonthlyChart monthlyAnalytics={this.state.chart_props} />

                            </div>
                        </Grid>

                        <Grid md={6} xs={12} lg={6}>
                            <h2 className="regular green center">Monthly Expense</h2>
                            <div className="mychart">
                                {this.state.mothly_expense.length > 0 && <MonthlyExpense thedata={this.state.mothly_expense} months={this.state.monthNames} />}

                            </div>
                        </Grid>
                    </Grid>





                </Container>









            </div>
        );

    }
}

export default dashboardComponent;