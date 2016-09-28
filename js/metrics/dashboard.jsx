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
                    padding: '10px'
                }
            }
        };

        let outer = (
            <div className='dashboard'>
                <div className='title'>Upstairs Greenhouse, General Metrics</div>
                <MetricLineGraph title={'Air Temperature'} units={'°C'} metricName={'airTemperature'} highlightColor={'#FC9D9A'} formatValue={v => parseFloat(v).toFixed(1)} />
                <MetricLineGraph title={'Humidity'} units={'%'} metricName={'humidity'} highlightColor={'#C8C8A9'} />
                <MetricLineGraph title={'Light Level'} units={' lm'} metricName={'lightLevel'} highlightColor={'#83AF9B'} />
            </div>
        );

        outer = recess(outer, styles, this);
        
        return outer;
    }
};