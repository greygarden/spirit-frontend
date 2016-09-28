// -------------------------------------------------------------
// This file contains the outer application container for Kakushin.
// -------------------------------------------------------------

import React from 'react'
import { Link } from 'react-router'
import recess from 'react-recess'
import authHelper from '../libs/auth-helper'
import apiLayer from '../libs/api-layer'

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
                    borderBottom: '1px solid #eee',

                    '.logo': {
                        paddingLeft: '15px',
                        color: '#555',
                        font: '200 20px "Open Sans"',
                        flexGrow: 1
                    },

                    '.rightButtons': {
                        display: 'flex',
                        alignItems: 'center',
                        paddingRight: '10px',
                        height: '100%',

                        '.email': {
                            color: '#999',
                            padding: '0 15px'
                        },

                        '.icon': {
                            padding: '0 15px',
                            cursor: 'pointer',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',

                            'i': {
                                fontSize: '20px',
                                color: '#999'
                            },

                            ':hover': {
                                background: '#f5f5f5'
                            },

                            ':active': {
                                background: '#eee'
                            }
                        }
                    }
                },

                '.body': {
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }
            },
        };

        // Render the current route
        const content = (
            <div>
                <div className='topBar'>
                    <Link to='/' className='logo'>核心 Spirit</Link>
                    <div className='rightButtons'>
                        <div className='email'>{ authHelper.getCurrentUser().email }</div>
                        <div className='icon user'>
                            <i className='lnr lnr-user'></i>
                        </div>
                        <div className='icon settings' onClick={apiLayer.auth.logout}>
                            <i className='lnr lnr-cog'></i>
                        </div>
                    </div>
                </div>
                <div className='body'>
                    { React.cloneElement(this.props.children) }
                </div>
            </div>
        );

        return recess(content, styles, this);
    }
}