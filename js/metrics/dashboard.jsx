// -------------------------------------------------------------
// This file contains a page that allows users to check domain
// registration details including expiry date.
// -------------------------------------------------------------

import React from 'react'
import recess from 'react-recess'
import MetricLineGraph from './metric-line-graph.jsx'

export default class MetricsOuter extends React.Component {

    constructor (props) {
        super(props);
    }

    render () {
        const styles = {
            '.dashboard': {
                width: '100%',
                overflow: 'auto',
                padding: '5px',
                background: '#f8f8f8',
                display: 'flex',
                flexGrow: 1,
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                alignContent: 'flex-start',

                '.title': {
                    width: '100%',
                    font: '200 20px "Open Sans"',
                    color: '#666',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',

                    '.addGraph': {
                        marginLeft: '10px',
                        font: '400 14px "Open Sans"',
                        color: '#aaa',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',

                        'i': {
                            fontSize: '16px',
                            color: '#666',
                            marginRight: '8px'
                        },

                        ':hover': {
                            background: '#eee'
                        },

                        ':active': {
                            background: '#e5e5e5'
                        }
                    }
                }
            }
        };

        let outer = (
            <div className='dashboard'>
                <div className='title'>
                    Upstairs Greenhouse, General Metrics
                    <div className='addGraph'><i className='lnr lnr-plus-circle'></i>New Graph</div>
                </div>
                <MetricLineGraph title={'Air Temperature'} units={'°C'} metricName={'airTemperature'} highlightColor={'#FC9D9A'} formatValue={v => parseFloat(v).toFixed(1)} />
                <MetricLineGraph title={'Humidity'} units={'%'} metricName={'humidity'} highlightColor={'#C8C8A9'} />
                <MetricLineGraph title={'Light Level'} units={' lm'} metricName={'lightLevel'} highlightColor={'#83AF9B'} />
            </div>
        );

        outer = recess(outer, styles, this);
        
        return outer;
    }
};