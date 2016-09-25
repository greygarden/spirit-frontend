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

                    '.logo': {
                        paddingLeft: '15px',
                        color: '#555',
                        font: '200 20px "Open Sans"',
                    }
                },
            },
        };

        const breadcrumbs = [];
        let fullRoute = ''
        this.props.routes.map((route, index) => {
            if (route.path) {
                fullRoute += `/${route.path}`;
            }
            if (route.title) {
                // Don't add an arrow before the first breadcrumb
                if (breadcrumbs.length > 0) {
                    breadcrumbs.push(<div className='arrow' key={`arrow${index}`}>{' > '}</div>);
                }
                // Don't bother to link the last breadcrumb
                if (index !== this.props.routes.length - 1) {
                    breadcrumbs.push(<Link to={fullRoute} className='link crumb' style={{ color: route.color || '#888' }} key={`crumb${index}`}>{route.title}</Link>);
                } else {
                    breadcrumbs.push(<div className='crumb' style={{ color: route.color || '#888', flexShrink: 1 }} key={`crumb${index}`}>{route.title}</div>);
                }
            }
        });

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