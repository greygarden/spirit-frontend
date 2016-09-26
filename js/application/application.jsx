// -------------------------------------------------------------
// This file contains the outer application container for Kakushin.
// -------------------------------------------------------------

import React from 'react'
import { Link } from 'react-router'
import recess from 'react-recess'

export default class Application extends React.Component {

    render () {
        const styles = {
            'div': {
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',

                '.topBar': {
                    height: '45px',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    background: '#fff',

                    '.logo': {
                        paddingLeft: '15px',
                        color: '#555',
                        font: '200 20px "Open Sans"',
                    }
                },

                '.body': {
                    width: '100%',
                    height: '100%'
                }
            },
        };

        // Render the current route
        const content = (
            <div>
                <div className='topBar'>
                    <Link to='/' className='logo'>核心 Spirit</Link>
                </div>
                <div className='body'>
                    { React.cloneElement(this.props.children) }
                </div>
            </div>
        );

        return recess(content, styles, this);
    }
}