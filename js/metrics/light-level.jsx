// -------------------------------------------------------------
// This file contains a page that allows users to check domain
// registration details including expiry date.
// -------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import apiLayer from '../libs/api-layer'
import recess from 'react-recess'
import moment from 'moment'
import timezone from 'moment-timezone'
import sharedStyles from '../libs/shared-styles'
import Highcharts from 'highcharts';
import AnimatedNumber from 'react-animated-number'
import io from 'socket.io-client'

export default class LightLevel extends React.Component {

    constructor (props) {
        super(props);
        this.state = { metrics: '', groupingSeconds: 300, title: 'Light Level', currentValue: 0, dayAverage: 0, units: 'lm' };
    }

    componentDidMount () {
        Highcharts.setOptions({
            global: {
                timezoneOffset: -moment(new Date(), moment.tz.guess()).utcOffset()
            }
        });

        let chart;
        apiLayer.metrics.getMetrics('A9560361-CC9F-4C7A-9965-C31A9E344EA8', 'lightLevel', this.state.groupingSeconds, moment().subtract(this.state.groupingSeconds * 15, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            chart = Highcharts.chart(this.refs.chart, {
                title: {
                    text: '',
                },
                zoomType: 'x',
                xAxis: {
                    type: 'datetime',
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    },
                    dateTimeLabelFormats: {
                        second: '%H:%M:%S',
                        minute: '%I:%M %p',
                    },
                    gridLineWidth: 1,
                    gridLineColor: '#f5f5f5'
                },
                yAxis: {
                    gridLineWidth: 1,
                    title: '',
                    labels: {
                        style: {
                            fontSize: '12px'
                        }
                    },
                    min: 0
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    showInLegend: false,
                    name: 'Light Level',
                    data: data.metrics.map((metric) => {
                        return [moment(metric.timestamp).valueOf(), parseInt(metric.value)]
                    }),
                    lineColor: '#83AF9B',
                    lineWidth: 3,
                    color: '#83AF9B',
                    marker: {
                        fillColor: '#fff',
                        lineColor: '#83AF9B',
                        lineWidth: '1.5px'
                    }
                }],
                tooltip: {
                    backgroundColor: '#6C9180',
                    borderWidth: 0,
                    borderRadius: 5,
                    shadow: false,
                    style: {
                        color: '#fff',
                        padding: '8px',
                        'text-align': 'left'
                    }
                },
                chart: {
                    style: {
                        'font-family': 'Open Sans',
                        'font-size': '14px',
                    }
                },
                credits: {
                    enabled: false
                }
            });
        });

        // Get the average value from the last 24 hours
        apiLayer.metrics.getMetrics('A9560361-CC9F-4C7A-9965-C31A9E344EA8', 'lightLevel', 86400, moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            this.setState({ dayAverage: parseInt(data.metrics[0].value) })
        });

        // Get the max value from the last 24 hours
        apiLayer.metrics.getMetricMax('A9560361-CC9F-4C7A-9965-C31A9E344EA8', 'lightLevel', moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            this.setState({ dayMax: parseInt(data.maxValue) })
        });

        // Get the max value from the last 24 hours
        apiLayer.metrics.getMetricMin('A9560361-CC9F-4C7A-9965-C31A9E344EA8', 'lightLevel', moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            this.setState({ dayMin: parseInt(data.minValue) })
        });

        // Based on the interval of grouping, we can get refreshed data to update the graph
        setInterval(() => {
            apiLayer.metrics.getMetrics('A9560361-CC9F-4C7A-9965-C31A9E344EA8', 'lightLevel', this.state.groupingSeconds, moment().subtract(this.state.groupingSeconds, 'seconds').toISOString(), moment().toISOString())
            .then((data) => {
                chart.series[0].addPoint([ moment(data.metrics[0].timestamp).valueOf(), parseInt(data.metrics[0].value) ], true, true);
            })
        }, this.state.groupingSeconds * 1000);

        const socket = io.connect(process.env.SOCKET_URL);
        socket.on('metric', (data) => {
            this.setState({ currentValue: data.value });
        });
    }

    render () {
        const chartStyles = {
            '.lightLevelOuter': {
                background: '#fff',
                display: 'flex',
                width: '740px',

                '.info': {
                    background: '#83AF9B',
                    width: '130px',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',

                    '.valueOuter': {
                        borderBottom: '1px solid #95BDAB',
                        flexBasis: '25%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',

                        '.largeValue': {
                            fontSize: '30px',
                            color: '#fff',
                        },

                        '.label': {
                            color: '#eee',
                        }
                    }
                },

                '.chartOuter': {
                    flexGrow: 1,
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',

                    '.title': {
                        padding: '5px 10px',
                        marginBottom: '5px',
                        font: '400 16px "Open Sans"',
                        color: '#999'
                    },

                    '.chart': {
                        height: '340px'
                    }
                }
            }
        };

        let chart = (
            <div className='lightLevelOuter'>
                <div className='info'>
                    <div className='valueOuter'>
                        <div className='largeValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.currentValue} duration={300} formatValue={(n) => { return n + ' lm' }} />
                        </div>
                        <div className='label'>Current Value</div>
                    </div>
                    <div className='valueOuter'>
                        <div className='largeValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayAverage} duration={300} formatValue={(n) => { return n + ' lm' }} />
                        </div>
                        <div className='label'>Avg / 24 hours</div>
                    </div>
                    <div className='valueOuter'>
                        <div className='largeValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayMin} duration={300} formatValue={(n) => { return n + ' lm' }} />
                        </div>
                        <div className='label'>Min / 24 hours</div>
                    </div>
                    <div className='valueOuter' style={{ borderBottom: 'none' }}>
                        <div className='largeValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayMax} duration={300} formatValue={(n) => { return n + ' lm' }} />
                        </div>
                        <div className='label'>Max / 24 hours</div>
                    </div>
                </div>
                <div className='chartOuter'>
                    <div className='title'>{this.state.title}</div>
                    <div className='chart' ref='chart'></div>
                </div>
            </div>
        );

        chart = recess(chart, chartStyles, this);
        
        return chart;
    }
};