// -------------------------------------------------------------
// This file contains a page that allows users to check domain
// registration details including expiry date.
// -------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import apiLayer from '../libs/api-layer'
import recess from 'react-recess'
import moment from 'moment'
import sharedStyles from '../libs/shared-styles'
import Chart from 'chart.js'
import _ from 'lodash'
import io from 'socket.io-client'
import AnimatedNumber from 'react-animated-number'


export default class MetricsOuter extends React.Component {

    constructor (props) {
        super(props);
        this.state = { metrics: [], liveMetric: 0 };
    }

    componentDidMount () {
        apiLayer.metrics.getMetrics('A9560361-CC9F-4C7A-9965-C31A9E344EA8', 'lightLevel', 300, moment().subtract(30, 'minutes').toISOString(), moment().toISOString())
        .then((data) => {
            const chart = new Chart(document.getElementById("chart"), {
                type: 'line',
                data: {
                    labels: data.metrics.map((metric) => {
                        return metric.timestamp;
                    }),
                    datasets: [
                        {
                            label: 'Light Level',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 3,
                            pointHitRadius: 10,
                            spanGaps: false,
                            data: data.metrics.map((metric) => {
                                return parseFloat(metric.value).toFixed(1);
                            })
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        xAxes: [{
                            type: 'time',
                            time: {
                                displayFormats: {
                                    minute: 'h:mm a'
                                },
                                unit: 'minute',
                                unitStepSize: 5
                                // min: moment(data.metrics[0].metric_timestamp).subtract(5, 'seconds').toISOString(),
                                // max: moment(data.metrics[data.metrics.length - 1].metric_timestamp).add(10, 'seconds').toISOString(),
                                // round: 'minute'
                            },
                            gridLines: {
                                color: 'rgba(243, 243, 243, 1)'
                            }
                        }],
                        yAxes: [{
                            gridLines: {
                                color: 'rgba(243, 243, 243, 1)'
                            }
                        }]
                    }
                }
            });
        });

        var socket = io(process.env.SOCKET_URL);
        socket.on('metric', (data) => {
            this.setState({ liveMetric: parseInt(data) });
        });
    }

    render () {
        const chartStyles = {
            '.chart-outer': {
                width: '700px',
                height: '500px',
                padding: '10px',

                'div': {
                    marginTop: '30px',
                    fontSize: '24px'
                }
            }
        };
        

        let chart = (
            <div className='chart-outer' ref='chart'>
                <canvas id='chart' ref='chart'></canvas>
                <div className='live-data'>
                    Currently: <AnimatedNumber stepPrecision={0} component='text' style={{ transition: '0.5s ease out' }} value={this.state.liveMetric} duration={300} /> lumens.
                </div>
            </div>
        );

        chart = recess(chart, chartStyles, this);
        
        return chart;
    }
};