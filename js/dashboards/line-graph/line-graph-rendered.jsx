// -------------------------------------------------------------
// Single line graph for arbitary metrics.
// -------------------------------------------------------------

import React from 'react'
import apiLayer from '../../libs/api-layer'
import recess from 'react-recess'
import moment from 'moment'
import timezone from 'moment-timezone'
import sharedStyles from '../../libs/shared-styles'
import Highcharts from 'highcharts';
import AnimatedNumber from 'react-animated-number'
import io from 'socket.io-client'
import ShadowDropdown from '../../components/shadow-dropdown.jsx'
import unitsHelper from '../../libs/units'

export default class LineGraphRendered extends React.Component {

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

    toggleExpanded () {
        this.props.toggleExpanded(() => {
            this.syncData();
        })
    }

    deleteGraph () {
        this.setState({ deleteGraphLoading: true })
        this.props.deleteGraph()
        .then(() => {
            this.setState({ deleteGraphLoading: false })
        })
    }

    syncData () {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        const units = unitsHelper.getUnitsWithKey(this.props.units);

        let chart;
        apiLayer.metrics.getMetrics(this.props.workerIdentifier, this.props.metricName, this.state.groupingSeconds / (this.props.expanded ? 3 : 1), moment().subtract(this.state.groupingSeconds * 12, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            if (data.metrics.length === 0) { return; }
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
                    lineColor: units.color,
                    lineWidth: 3,
                    color: units.color,
                    marker: {
                        fillColor: '#fff',
                        lineColor: units.color,
                        lineWidth: '1.5px'
                    }
                }],
                tooltip: {
                    backgroundColor: sharedStyles.shadeColor(units.color, -15),
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
            apiLayer.metrics.getMetrics(this.props.workerIdentifier, this.props.metricName, this.state.groupingSeconds / (this.props.expanded ? 3 : 1), moment().subtract(this.state.groupingSeconds / (this.props.expanded ? 2 : 1), 'seconds').toISOString(), moment().toISOString())
            .then((data) => {
                if (data.metrics.length === 0) { return; }
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
        apiLayer.metrics.getMetrics(this.props.workerIdentifier, this.props.metricName, 86400, moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            if (data.metrics.length === 0) { return; }
            this.setState({ dayAverage: this.props.formatValue ? this.props.formatValue(data.metrics[0].value) : parseInt(data.metrics[0].value) })
        });

        // Get the max value from the last 24 hours
        apiLayer.metrics.getMetricMax(this.props.workerIdentifier, this.props.metricName, moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            if (!data.maxValue) { return; }
            this.setState({ dayMax: this.props.formatValue ? this.props.formatValue(data.maxValue) : parseInt(data.maxValue) })
        });

        // Get the max value from the last 24 hours
        apiLayer.metrics.getMetricMin(this.props.workerIdentifier, this.props.metricName, moment().subtract(86400, 'seconds').toISOString(), moment().toISOString())
        .then((data) => {
            if (!data.minValue) { return; }
            this.setState({ dayMin: this.props.formatValue ? this.props.formatValue(data.minValue) : parseInt(data.minValue) })
        });

        const socket = io.connect(process.env.SOCKET_URL);
        socket.on(`metric-${this.props.workerIdentifier}-${this.props.metricName}`, (data) => {
            const value = this.props.formatValue ? this.props.formatValue(data.value) : parseInt(data.value);
            this.setState({ currentValue: value, latestUpdate: moment() });
        });

        this.syncData();
    }

    render () {
        const units = unitsHelper.getUnitsWithKey(this.props.units);

        const chartStyles = {
            '.lineGraphOuter': {
                background: '#fff',
                display: 'flex',

                '.chartOuter': {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',

                    '.upper': {
                        display: 'flex',
                        alignItems: 'center',
                        height: '40px',

                        '.title': {
                            padding: '0 10px',
                            font: '400 16px "Open Sans"',
                            color: '#999',
                        },

                        '.statusOuter': {
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                            marginTop: '2px',

                            '.indicator': {
                                background: '#fff',
                                position: 'relative',
                                width: '25px',
                                display: 'flex',
                                justifyContent: 'center',
                                fontSize: '12px',
                                lineHeight: '12px',
                                '@includes': [ sharedStyles.loader ],

                                '.loaderOuter': {
                                    marginRight: '8px'
                                },

                                '.liveCircle': {
                                    background: sharedStyles.shadeColor('#9DE0AD', 10),
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '10px'
                                }
                            },

                            '.message': {
                                color: '#bbb'
                            }
                        },

                        '.granularity': {
                            display: 'flex',
                            alignItems: 'center',
                            paddingRight: '10px',

                            '.button': {
                                color: units.color,
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
                        marginRight: '5px',
                        height: '340px',

                        '.noData': {
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '18px',
                            color: '#888'
                        }
                    }
                },

                '.info': {
                    background: '#eee',
                    width: '120px',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',

                    '.buttons': {
                        height: '40px',
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        width: '100%',
                        background: '#e8e8e8',

                        '.button': {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#555',
                            borderRight: '1px solid #d5d5d5',
                            background: '#e3e3e3',
                            height: '100%',
                            width: '40px',
                            cursor: 'pointer',

                            'i': {
                                fontSize: '20px',
                                color: '#999'
                            },

                            ':hover': {
                                background: '#dadada',
                            },

                            ':active': {
                                background: '#d3d3d3',
                            }
                        },

                        'ShadowDropdown': {
                            width: '40px'
                        }
                    },

                    '.valueOuter': {
                        display: 'flex',
                        padding: '15px 10px',
                        width: '100%',
                        flexDirection: 'column',
                        justifyContent: 'center',

                        '.largeValue': {
                            fontSize: '26px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: units.color,
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
            }
        };

        const connected = this.state.latestUpdate && this.state.latestUpdate > moment().subtract(1, 'minute');

        const noData = this.state.metrics.length === 0 ? <div className='noData'>No Data</div> : null;

        let chart = (
            <div className='lineGraphOuter'>
                <div className='chartOuter'>
                    <div className='upper'>
                        <div className='title'>
                            {this.props.title}
                        </div>
                        <div className='statusOuter'>
                            <div className='indicator'>
                                <div className={`loaderOuter${!connected ? ' active' : ''}`}>
                                    <div className='loader small'></div>
                                </div>
                                <div className='liveCircle' />
                            </div>
                            <div className='message'>
                                {connected ? 'Live' : 'Connecting...'}
                            </div>
                        </div>
                        <div className='granularity'>
                            <div className={'button' + (this.state.groupingSeconds === 7200 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 7200)}>24hr</div>
                            <div className={'button' + (this.state.groupingSeconds === 1800 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 1800)}>6hr</div>
                            <div className={'button' + (this.state.groupingSeconds === 300 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 300)}>1hr</div>
                            <div className={'button' + (this.state.groupingSeconds === 120 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 120)}>30m</div>
                            <div className={'button' + (this.state.groupingSeconds === 5 ? ' active' : '')} onClick={this.updateGroupingSeconds.bind(this, 5)}>1m</div>
                        </div>
                    </div>
                    <div className='chart' ref='chart'>
                        {noData}
                    </div>
                </div>
                <div className='info'>
                    <div className='buttons'>
                        <ShadowDropdown 
                            recessStyles={{
                                '.dropdown.shadow': {
                                    width: '40px', height: '100%',

                                    '.buttonInner': {
                                        background: '#e3e3e3',

                                        ':hover': {
                                            background: '#dadada',
                                        },

                                        ':active': {
                                            background: '#d3d3d3',
                                        }
                                    }
                                }
                            }}
                            icon={<i className='lnr lnr-cog' />}
                            items={[
                                <div className='item' key='1' onClick={this.props.toggleSettings}>
                                    <i className='lnr lnr-chart-bars' style={{ marginRight: '10px', fontSize: '16px' }} />Data Settings
                                </div>,
                                <div className='item' key='2'>
                                    <i className='lnr lnr-pushpin' style={{ marginRight: '10px', fontSize: '16px' }} />Add Events
                                </div>,
                                <div className='item' key='3' style={{ borderBottom: 'none' }} onClick={this.deleteGraph.bind(this)}>
                                    <div className={`loaderOuter${this.state.deleteGraphLoading ? ' active' : ''}`}>
                                        <div className='loader'></div>
                                    </div>
                                    <i className='lnr lnr-cross-circle' style={{ marginRight: '10px', fontSize: '16px' }}/>Delete Graph
                                </div>
                            ]}
                        />
                        <div className='button expand' onClick={this.toggleExpanded.bind(this)}>
                            <i className={`lnr lnr-frame-${this.props.expanded ? 'contract' : 'expand'}`} style={{ paddingLeft: '3px' }}></i>
                        </div>
                        <div className='button favourite'>
                            <i className='lnr lnr-star'></i>
                        </div>
                    </div>
                    <div className='valueOuter'>
                        <div className='largeValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.currentValue} duration={300} formatValue={(n) => { return units.formatter(n) + units.shortLabel }} />
                        </div>
                        <div className='label'>Current Value</div>
                    </div>
                    <div className='valueOuter'>
                        <div className='mediumValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayAverage} duration={300} formatValue={(n) => { return units.formatter(n) + units.shortLabel }} />
                        </div>
                        <div className='label'>Avg / 24hr</div>
                    </div>
                    <div className='valueOuter'>
                        <div className='mediumValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayMin} duration={300} formatValue={(n) => { return units.formatter(n) + units.shortLabel }} />
                        </div>
                        <div className='label'>Min / 24hr</div>
                    </div>
                    <div className='valueOuter' style={{ borderBottom: 'none' }}>
                        <div className='mediumValue'>
                            <AnimatedNumber component='text' style={{ transition: '0.3s ease out' }} stepPrecision={0} value={this.state.dayMax} duration={300} formatValue={(n) => { return units.formatter(n) + units.shortLabel }} />
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