import React, {Component} from 'react';
import { ResponsiveBar } from '@nivo/bar'

 

class MonthlyChart extends Component {
    constructor(props){
        super(props);
        this.state = {
            

        }
    }
    componentWillMount(){
        console.log(this.props)

    }


                    

    render(){
        // const data = [
        //     {
        //         "month": "Jan",
        //         "Revenue": this.props.monthlySales.jan.sale,
             
        //         "Profit": this.props.monthlySales.jan.profit >= 0 ? this.props.monthlySales.jan.profit : 0,
        //         "loss": this.props.monthlySales.jan.profit >= 0 ? 0 : Math.abs(parseInt(this.props.monthlySales.jan.profit, 10)),
        //         "color": "#bebebe"
              
        //     },
        //     // {
        //     //     "month": "Feb",
        //     //     "Revenue": this.props.monthlySales.feb.sale,
               
        //     //     "Profit": this.props.monthlySales.feb.profit >= 0 ? this.props.monthlySales.feb.profit : 0,
        //     //     "loss": this.props.monthlySales.feb.profit >= 0 ? 0 : Math.abs(parseInt(this.props.monthlySales.feb.profit, 10)),
        //     //     "color": "#bebebe"
                
                
        //     // },{
        //     //     "month": "Mar",
        //     //     "Revenue": this.props.monthlySales.mar.sale,
             
        //     //     "Profit": this.props.monthlySales.mar.profit >= 0 ? this.props.monthlySales.mar.profit : 0,
        //     //     "loss": this.props.monthlySales.mar.profit >= 0 ? 0 : Math.abs(parseInt(this.props.monthlySales.mar.profit, 10)),
        //     //     "color": "#bebebe"

                
                
        //     // },{
        //     //     "month": "Apr",
        //     //     "Revenue": this.props.monthlySales.apr.sale,
           
        //     //     "Profit": this.props.monthlySales.apr.profit >= 0 ? this.props.monthlySales.apr.profit : 0,
        //     //     "loss": this.props.monthlySales.apr.profit >= 0 ? 0 : Math.abs(parseInt(this.props.monthlySales.apr.profit, 10)),
                
        //     //     "color": "#bebebe"

             
                
        //     // },{
        //     //     "month": "May",
        //     //     "Revenue": this.props.monthlySales.may.sale,
                
        //     //     "Profit": this.props.monthlySales.may.profit >= 0 ? this.props.monthlySales.may.profit : "0",
        //     //     "loss": this.props.monthlySales.may.profit >= 0 ? 0 : Math.abs(parseInt(this.props.monthlySales.may.profit, 10)),
        //     //     "color": "#ebebbe"
                
                
        //     // },{
        //     //     "month": "Jun",
        //     //     "Revenue": this.props.monthlySales.jun.sale,
       
        //     //     "Profit": this.props.monthlySales.jun.profit >= 0 ? this.props.monthlySales.jun.profit : 0,
        //     //     "loss": this.props.monthlySales.jun.profit >= 0 ? 0 : Math.abs(parseInt(this.props.monthlySales.jun.profit, 10)),
        //     //     "color": "#bebebe"

             
                
        //     // }
        // ]

        return(
            <div className="" style={{height: '300px', width: '100%'}}>
                
                {/* <Bar
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
                /> */}

                <ResponsiveBar
                        data={this.props.monthlyAnalytics}
                        keys={[ 'Revenue', 'Profit', 'loss']}
                        indexBy="month"
                        margin={{ top: 5, right: 60, bottom: 50, left: 60 }}
                        padding={0.9}
                        colors={ ['#757575', '#4CAF50', '#e50000']}
                        
                        defs={[
                            {
                                id: 'dots',
                                type: 'patternDots',
                                background: 'inherit',
                                color: '#38bcb2',
                                size: 4,
                                padding: 1,
                                stagger: true
                            },
                            {
                                id: 'lines',
                                type: 'patternLines',
                                background: 'inherit',
                                color: '#eed312',
                                rotation: -45,
                                lineWidth: 6,
                                spacing: 10
                            }
                        ]}
                        fill={[
                            
                        ]}
                        borderColor={{ from: 'color', modifiers: [ [ 'darker', '1.4' ] ] }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '',
                            legendPosition: 'middle',
                            legendOffset: 32
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: '',
                            legendPosition: 'middle',
                            legendOffset: -40
                        }}
                        enableGridY={false}
                        labelSkipWidth={11}
                        labelSkipHeight={12}
                        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
                        legends={[
                            {
                                dataFrom: 'keys',
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 80,
                                translateY: -65,
                                itemsSpacing: 2,
                                itemWidth: 102,
                                itemHeight: 20,
                                itemDirection: 'left-to-right',
                                itemOpacity: 0.85,
                                symbolSize: 20,
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                    />
            </div>
        )
    }

}

export default MonthlyChart;