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

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

export default class LightLevel extends React.Component {

    constructor (props) {
        super(props);
        this.state = { metrics: '', groupingSeconds: 1800, currentValue: 0, dayAverage: 0, dayMax: 0, dayMin: 0 };
    }

    updateGroupingSeconds (seconds) {
        if (seconds !== this.state.groupingSeconds) {
            this.setState({ groupingSeconds: seconds }, () => {
                this.syncData();
            });
        }
    }

    syncData () {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        let chart;
        apiLayer.metrics.getMetrics('A9560361-CC9F-4C7A-9965-C31A9E344EA8', this.props.metricName, this.state.groupingSeconds, moment().subtract(this.state.groupingSeconds * 12, 'seconds').toISOString(), moment().toISOString())
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
                    name: this.props.title,
                    data: data.metrics.map((metric) => {
                        return [moment(metric.timestamp).valueOf(), parseInt(metric.value)]
                    }),
                    lineColor: this.props.highlightColor,
                    lineWidth: 3,
                    color: this.props.highlightColor,
                    marker: {
                        fillColor: '#fff',
                        lineColor: this.props.highlightColor,
                        lineWidth: '1.5px'
                    }
                }],
                tooltip: {
                    backgroundColor: shadeColor(this.props.highlightColor, -15),
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

        // Based on the interval of grouping, we can get refreshed data to update the graph
        this.syncInterval = setInterval(() => {
            apiLayer.metrics.getMetrics('A9560361-CC9F-4C7A-9965-C31A9E344EA8', this.props.metricName, this.state.groupingSeconds, moment().subtract(this.state.groupingSeconds, 'seconds').toISOString(), moment().toISOString())
            .then((data) => {
                const series = chart.series[0],
                shift = series.data.length > 12;
                chart.series[0].addPoint([ moment(data.metrics[0].timestamp).valueOf(), parseInt(data.metrics[0].value) ], true, shift);
            })
        }, this.state.groupingSeconds * 1000);
    }

    componentDidMount () {
        Highcharts.setOptions({
            global: {
                timezoneOffset: -moment(new Date(), moment.tz.guess()).utcOffset()
            }
        });

        // Get the average value from the last 24 hours
        apiLayer.metrics.getMetrics('A9560361-CC9F-4C7A-9965-C31A9E344EA8', this.props.metricName, 86400, moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            this.setState({ dayAverage: this.props.formatValue ? this.props.formatValue(data.metrics[0].value) : parseInt(data.metrics[0].value) })
        });

        // Get the max value from the last 24 hours
        apiLayer.metrics.getMetricMax('A9560361-CC9F-4C7A-9965-C31A9E344EA8', this.props.metricName, moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            this.setState({ dayMax: this.props.formatValue ? this.props.formatValue(data.maxValue) : parseInt(data.maxValue) })
        });

        // Get the max value from the last 24 hours
        apiLayer.metrics.getMetricMin('A9560361-CC9F-4C7A-9965-C31A9E344EA8', this.props.metricName, moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            this.setState({ dayMin: this.props.formatValue ? this.props.formatValue(data.minValue) : parseInt(data.minValue) })
        });

        const socket = io.connect(process.env.SOCKET_URL);
        socket.on('metric-' + this.props.metricName, (data) => {
            const value = this.props.formatValue ? this.props.formatValue(data.value) : parseInt(data.value);
            this.setState({ currentValue: value });
        });

        this.syncData();
    }

    render () {
        const chartStyles = {
            '.lightLevelOuter': {
                background: '#fff',
                display: 'flex',
                maxWidth: '680px',
                minWidth: '500px',
                flexGrow: 1,
                border: '1px solid #eee',
                margin: '7.5px',

                '.info': {
                    background: '#eee',
                    width: '120px',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',

                    '.valueOuter': {
                        flexBasis: '20%',
                        display: 'flex',
                        padding: '0 15px',
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',

                        '.largeValue': {
                            fontSize: '26px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: this.props.highlightColor,
                        },

                        '.mediumValue': {
                            fontSize: '18px',
                            marginBottom: '5px',
                            fontWeight: 400,
                            color: '#888'
                        },

                        '.label': {
                            color: '#999',
                        }
                    }
                },

                '.chartOuter': {
                    flexGrow: 1,
                    padding: '5px',
                    display: 'flex',
                    flexDirection: 'column',

                    '.upper': {
                        display: 'flex',
                        alignItems: 'center',

                        '.title': {
                            padding: '5px 10px',
                            marginBottom: '5px',
                            font: '400 16px "Open Sans"',
                            color: '#999',
                            flexGrow: 1
                        },

                        '.granularity': {
                            display: 'flex',
                            alignItems: 'center',

                            '.button': {
                                color: this.props.highlightColor,
                                margin: '5px',
                                cursor: 'pointer'
                            },

                            '.active': {
                                fontWeight: 400,
                                textDecoration: 'underline'
                            }
                        }
                    },

                    '.chart': {
                        height: '340px'
                    }
                }
            }
        };

        let chart = (
            <div className='lightLevelOuter'>
                <div className='chartOuter'>
                    <div className='upper'>
                        <div className='title'>{this.props.title}</div>
                        <div className='granularity'>
                            <div className={'button' + (this.state.groupingSeconds === 7200 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 7200)}>24hr</div>
                            <div className={'button' + (this.state.groupingSeconds === 1800 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 1800)}>6hr</div>
                            <div className={'button' + (this.state.groupingSeconds === 300 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 300)}>1hr</div>
                            <div className={'button' + (this.state.groupingSeconds === 120 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 120)}>30m</div>
                            <div className={'button' + (this.state.groupingSeconds === 5 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 5)}>1m</div>
                        </div>
                    </div>
                    <div className='chart' ref='chart'></div>
                </div>
                <div className='info'>
                    <div className='valueOuter'>
                        <div className='largeValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.currentValue} duration={300} formatValue={(n) => { return n + this.props.units }} />
                        </div>
                        <div className='label'>Current Value</div>
                    </div>
                    <div className='valueOuter'>
                        <div className='mediumValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayAverage} duration={300} formatValue={(n) => { return n + this.props.units }} />
                        </div>
                        <div className='label'>Avg / 24hr</div>
                    </div>
                    <div className='valueOuter'>
                        <div className='mediumValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayMin} duration={300} formatValue={(n) => { return n + this.props.units }} />
                        </div>
                        <div className='label'>Min / 24hr</div>
                    </div>
                    <div className='valueOuter' style={{ borderBottom: 'none' }}>
                        <div className='mediumValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayMax} duration={300} formatValue={(n) => { return n + this.props.units }} />
                        </div>
                        <div className='label'>Max / 24hr</div>
                    </div>
                </div>
            </div>
        );

        chart = recess(chart, chartStyles, this);
        
        return chart;
    }
};