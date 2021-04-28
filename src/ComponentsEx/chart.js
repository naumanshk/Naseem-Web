import React, {Component} from 'react';
import { Bar } from 'react-chartjs-2';
import * as firebase from 'firebase'
import './AppEx.css';
import '../config'; 
import fire from '../config';
import { options } from 'date-fns/locale/af';

class Chart extends Component {
    constructor(){
        super();
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
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            oct: 0,
            nov: 0,
            dec: 0,
            years:[],
            selectedYear:new Date().getFullYear()

        }
    }
    componentWillMount(){
        this.getTotalFee()
        this.getPaidFee()
        this.getYears(2010)
    }

    async getTotalFee(){
        
        
        await firebase.database().ref("Fee").once("value").then(snapshot => {
            
            snapshot.forEach(school => {        
                school.forEach(section => {
                    section.forEach(month => {

                        
                        if (month.key == `01-${this.state.selectedYear}`){
                            let {Jan} = this.state;

                            month.forEach(student => {
                                if(student.val().fee != null){
                                Jan = Jan + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Jan})
                        } else if(month.key == `02-${this.state.selectedYear}`) {
                            let {Feb} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Feb = Feb + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Feb})
                            
                        }else if(month.key == `03-${this.state.selectedYear}`) {
                            let {Mar} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Mar = Mar + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Mar})
                            
                        }else if(month.key == `04-${this.state.selectedYear}`) {
                            let {Apr} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Apr = Apr + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Apr})
                            
                        }else if(month.key == `05-${this.state.selectedYear}`) {
                            let {May} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                May = May + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({May})
                            
                        }else if(month.key == `06-${this.state.selectedYear}`) {
                            let {Jun} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Jun = Jun + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Jun})
                            
                        }
                        else if(month.key == `07-${this.state.selectedYear}`) {
                            let {Jul} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Jul = Jul + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Jul})
                            
                        }
                        else if(month.key == `08-${this.state.selectedYear}`) {
                            let {Aug} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Aug = Aug + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Aug})
                            
                        }
                        else if(month.key == `09-${this.state.selectedYear}`) {
                            let {Sep} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Sep = Sep + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Sep})
                            
                        }
                        else if(month.key == `10-${this.state.selectedYear}`) {
                            let {Oct} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Oct = Oct + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Oct})
                            
                        }
                        else if(month.key == `11-${this.state.selectedYear}`) {
                            let {Nov} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Nov = Nov + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Nov})
                            
                        }
                        else if(month.key == `12-${this.state.selectedYear}`) {
                            let {Dec} = this.state;
                            month.forEach(student => {
                                if(student.val().fee != null){
                                Dec = Dec + parseInt(student.val().fee, 10)
                                }
                            })
                            this.setState({Dec})
                            
                        }
                    })
                    
                })
            })
           
        })
    }


    async getPaidFee(){
        await firebase.database().ref("Fee").once("value").then(snapshot => {
            
            snapshot.forEach(school => {        
                school.forEach(section => {
                    section.forEach(month => {

                        
                        if (month.key == `01-${this.state.selectedYear}`){
                            let {jan} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    jan = jan + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({jan})
                        } else if (month.key == `02-${this.state.selectedYear}`){
                            let {feb} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    feb = feb + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({feb})

                        }else if (month.key == `03-${this.state.selectedYear}`){
                            let {mar} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    mar = mar + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({mar})

                        }else if (month.key == `04-${this.state.selectedYear}`){
                            let {apr} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    apr = apr + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({apr})

                        }else if (month.key == `05-${this.state.selectedYear}`){
                            let {may} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    may = may + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({may})

                        }else if (month.key == `06-${this.state.selectedYear}`){
                            let {jun} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    jun = jun + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({jun})

                        }
                        else if (month.key == `07-${this.state.selectedYear}`){
                            let {jul} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    jul = jul + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({jul})

                        }
                        else if (month.key == `08-${this.state.selectedYear}`){
                            let {aug} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    aug = aug + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({aug})

                        }
                        else if (month.key == `09-${this.state.selectedYear}`){
                            let {sep} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    sep = sep + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({sep})

                        }
                    
           
                        else if (month.key == `10-${this.state.selectedYear}`){
                            let {oct} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    oct = oct + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({oct})

                        }
                        else if (month.key == `11-${this.state.selectedYear}`){
                            let {nov} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    nov = nov + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({nov})

                        }
                        else if (month.key == `12-${this.state.selectedYear}`){
                            let {dec} = this.state;
                            month.forEach(student => {
                                
                                if (student.val().status == true && student.val().fee != null){
                                    dec = dec + parseInt(student.val().fee, 10)

                                }
                                
                               
                            })
                            this.setState({dec})

                        }
                    })
                    
                })
            })
           
        })
        

    }
    emptyStates(){
        this.setState({
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
            jan: 0,
            feb: 0,
            mar: 0,
            apr: 0,
            may: 0,
            jun: 0,
            jul: 0,
            aug: 0,
            sep: 0,
            oct: 0,
            nov: 0,
            dec: 0,
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

    render(){
        const chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Total Fee',
                    data: [
                        this.state.Jan,
                        this.state.Feb,
                        this.state.Mar,
                        this.state.Apr,
                        this.state.May,
                        this.state.Jun,
                        this.state.Jul,
                        this.state.Aug,
                        this.state.Sep,
                        this.state.Oct,
                        this.state.Nov,
                        this.state.Dec

                    ],
                    backgroundColor: '#919191'
                },
                {
                    label: 'Fee Paid',
                    data: [
                        this.state.jan,
                        this.state.feb,
                        this.state.mar,
                        this.state.apr,
                        this.state.may,
                        this.state.jun,
                        this.state.jul,
                        this.state.aug,
                        this.state.sep,
                        this.state.oct,
                        this.state.nov,
                        this.state.dec
                        
                        
                    ],
                    backgroundColor: '#14A73F',
                    
                }
                
            ],
            
        }

        return(
            <div >
                <div className="yearFilter"><p style={{margin:0, padding:0,paddingRight:10,color:'#919191'}}>Filter: </p>
                <select style={{border:'1px solid #14A73F ',color:'#14A73F '}} onChange={e=>{this.setState({selectedYear:e.target.value
                  
                })
                this.emptyStates()
                this.getTotalFee()
                this.getPaidFee()
                }
                
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

export default Chart;