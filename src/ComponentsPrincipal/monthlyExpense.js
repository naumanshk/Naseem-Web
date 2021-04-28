import React, {Component} from 'react';
import { Bar } from 'react-chartjs-2';
import * as firebase from 'firebase'

import '../config'; 
import fire from '../config';

class monthlyExpense extends Component {
    constructor(props){
        super(props);
        this.state = {
           
            
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,

            revenue:0,
            months: [`01-${new Date().getFullYear()}`, `02-${new Date().getFullYear()}`, `03-${new Date().getFullYear()}`, `04-${new Date().getFullYear()}`, `05-${new Date().getFullYear()}`, `06-${new Date().getFullYear()}`,
            `07-${new Date().getFullYear()}`, `08-${new Date().getFullYear()}`, `09-${new Date().getFullYear()}`, `10-${new Date().getFullYear()}`, `11-${new Date().getFullYear()}`, `12-${new Date().getFullYear()}`],
            mothly_expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            monthly_revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            monthly_profit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ],
            expense: 0,
            revenue: 0,
            profit: 0,
            years: [],
            selectedYear: new Date().getFullYear(),
            schools:[]

        }
    }
    componentDidMount(){
        

      this.getYears(2010)
        this.getSchools()
            
        
    }
    async filterYears() {
        await this.setState({
            months: [`01-${this.state.selectedYear}`, `02-${this.state.selectedYear}`, `03-${this.state.selectedYear}`, `04-${this.state.selectedYear}`, `05-${this.state.selectedYear}`, `06-${this.state.selectedYear}`,
            `07-${this.state.selectedYear}`, `08-${this.state.selectedYear}`, `09-${this.state.selectedYear}`, `10-${this.state.selectedYear}`, `11-${this.state.selectedYear}`, `12-${this.state.selectedYear}`],
        })
    }
    async getSchools() {
        let { schools } = this.state;

        await firebase.database().ref("School").once("value").then(snapshot => {
            snapshot.forEach(organization => {
             
     
                    organization.forEach(item => {
                        if (item.key == localStorage.getItem('schoolId') ){
                        schools.push(item.val())
                        }
                    })
                

            })
            this.setState({ schools })
            this.getFinances();
     

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
                if(school.key==localStorage.getItem('schoolId')){
                    
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
                    if(school.key==localStorage.getItem('schoolId')){
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
       

            this.setState({ monthly_revenue })
           
            this.setState({ options })

            // calculating monthly profit of the selected year 
            let monthly_profit = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            monthly_profit.forEach(async (item, i) => {
                monthly_profit[i] = monthly_revenue[i] - mothly_expense[i];
                await this.setState({ monthly_profit })

            })
      

        })





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
            revenue:0,
         
            mothly_expense: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            monthly_revenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            monthly_profit: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            expense: 0,
            revenue: 0,
            profit: 0,
        
        })
    }

    render(){
        var chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Monthly Expense',
                    data: this.state.mothly_expense,
                    backgroundColor: '#6437A1',
                },
                
                
            ],
            
        }

        return(
            <div className="">
                <div className="yearFilter"><p style={{margin:0, padding:0,paddingRight:10,color:'#919191'}}>Filter: </p>
                <select style={{border:'1px solid #6437A1',color:'#6437A1'}} onChange={e=>
                
                
                    this.setState({
                        selectedYear: Number(e.target.value)

                    }, () => {
                        this.emptyStates(),
                            this.filterYears()
                        this.getFinances()
                    })

                
                }>
                    {this.state.years.slice(0).reverse().map((item,i)=>{
                       return( <option value={Number(item)}>{item}</option>)

                    })}
                </select>
                </div>
                <Bar
                data={chartData}
                width={100}
                height={50}
                options={{
                    scales: {
                        xAxes: [{
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                drawOnChartArea: false
                            }
                        }]
                    }
                 }}
                />
            </div>
        )
    }

}

export default monthlyExpense;