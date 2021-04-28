import React, {Component} from 'react';
import { Bar } from 'react-chartjs-2';
import * as firebase from 'firebase'
import './AppEx.css';
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

        }
    }
    componentDidMount(){
        

        setInterval(() => {
            this.getPaidFee()
            
        }, 3000);

    }


    async getPaidFee() {
        
        this.props.months.forEach(async (item,i)=>{

            await this.setState({[item]:this.props.thedata[i]})

        })

    }

    render(){
        var chartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Monthly Expense',
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
                    backgroundColor: '#14A73F',
                },
                
                
            ],
            
        }

        return(
            <div className="">
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