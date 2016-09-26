// -------------------------------------------------------------
// This file contains a page that allows users to check domain
// registration details including expiry date.
// -------------------------------------------------------------

import React from 'react'
import recess from 'react-recess'
import LightLevel from './light-level.jsx'

export default class MetricsOuter extends React.Component {

    constructor (props) {
        super(props);
    }

    render () {
        const styles = {
            '.outer': {
                width: '100%',
                height: '100%',
                overflow: 'auto',
                padding: '15px',
                background: '#f8f8f8',
            }
        };

        let outer = (
            <div className='outer'>
                <LightLevel /> 
            </div>
        );

        outer = recess(outer, styles, this);
        
        return outer;
    }
};