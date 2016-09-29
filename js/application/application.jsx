// -------------------------------------------------------------
// This file contains the outer application container for Kakushin.
// -------------------------------------------------------------

import React from 'react'
import { Link } from 'react-router'
import recess from 'react-recess'
import authHelper from '../libs/auth-helper'
import apiLayer from '../libs/api-layer'
import sharedStyles from '../libs/shared-styles'

export default class Application extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            leftMenuExpanded: true
        }
    }

    toggleLeftMenu () {
        this.setState({
            leftMenuExpanded: !this.state.leftMenuExpanded
        })
    }

    render () {
        const styles = {
            'div': {
                width: '100%',
                height: '100%',
                display: 'flex',

                '.sideMenu': {
                    width: this.state.leftMenuExpanded ? '200px' : '45px',
                    height: '100%',
                    background: '#556270',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',

                    '.logoOuter': {
                        padding: this.state.leftMenuExpanded ? '10px' : 0,
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',

                        '.logo': {
                            background: '#83AF9B',
                            width: this.state.leftMenuExpanded ? '45px' : '65px',
                            height: this.state.leftMenuExpanded ? '55px' : '75px',
                            color: '#fff',
                            fontSize: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            lineHeight: '1.2',
                            marginRight: this.state.leftMenuExpanded ? '10px' : 0
                        },

                        '.title': {
                            color: '#fff',
                            font: '200 16px "Open Sans"',
                            display: this.state.leftMenuExpanded ? 'block' : 'none',

                            '.subtitle': {
                                marginTop: '5px',
                                font: '400 14px "Open Sans"',
                                color: '#ddd'
                            }
                        }
                    },

                    '.menuButtons': {
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',

                        '.button': {
                            padding: this.state.leftMenuExpanded ? '15px' : '15px 0',
                            color: '#fff',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: this.state.leftMenuExpanded ? 'flex-start' : 'center',

                            'i': {
                                fontSize: this.state.leftMenuExpanded ? '18px' : '23px',
                                marginRight: this.state.leftMenuExpanded ? '15px' : 0
                            },

                            '.text': {
                                display: this.state.leftMenuExpanded ? 'block' : 'none',
                                flexGrow: '1'
                            },

                            '.dot': {
                                display: 'none',
                                width: '10px',
                                height: '10px',
                                background: 'rgba(255, 255, 255, 0.5)',
                                borderRadius: '10px'
                            },

                            ':hover': {
                                background: sharedStyles.shadeColor('#556270', -10)
                            },

                            ':active': {
                                background: sharedStyles.shadeColor('#556270', -15)
                            },
                        },

                        '.active': {
                            fontWeight: '400',
                            background: sharedStyles.shadeColor('#556270', 12),

                            '.dot': {
                                'display': this.state.leftMenuExpanded ? 'block' : 'none'
                            }
                        },
                    }
                },

                '.body': {
                    flexGrow: 1,
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

                        '.collapseMenu': {
                            color: '#999',
                            fontWeight: '400',
                            padding: '0 15px',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',

                            ':hover': {
                                background: '#f5f5f5'
                            },

                            ':active': {
                                background: '#eee'
                            },

                            'i': {
                                fontSize: '18px',
                                marginRight: '8px'
                            }
                        },

                        '.spacer': {
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

                    '.bodyInner': {
                        flexGrow: 1,
                        height: '100%',
                        overflow: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }
                }
            },
        };

        // Render the current route
        const content = (
            <div>
                <div className='sideMenu'>
                    <div className='logoOuter'>
                        <div className='logo'>
                            <div>核</div>
                            <div>心</div>
                        </div>
                        <div className='title'>
                            Spirit
                            <div className='subtitle'>Ilka Street</div>
                        </div>
                    </div>
                    <div className='menuButtons'>
                        <Link className={`button${window.location.href.match('/app/dashboard') ? ' active' : ''}`} to='/app/dashboard'>
                            <i className='lnr lnr-pie-chart' /><div className='text'>Dashboards</div><div className='dot'></div>
                        </Link>
                        <Link className='button' to='/app/workers' activeClassName='active'>
                            <i className='lnr lnr-leaf' /><div className='text'>Workers</div><div className='dot'></div>
                        </Link>
                        <Link className='button' to='/app/alerts' activeClassName='active'>
                            <i className='lnr lnr-alarm' /><div className='text'>Alerts</div><div className='dot'></div>
                        </Link>
                    </div>
                </div>
                <div className='body'>
                    <div className='topBar'>
                        <div className='collapseMenu' onClick={this.toggleLeftMenu.bind(this)}><i className={`lnr lnr-chevron-${this.state.leftMenuExpanded ? 'left' : 'right'}-circle`} />{this.state.leftMenuExpanded ? 'Collapse' : 'Expand'}</div>
                        <div className='spacer'></div>
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
                    <div className='bodyInner'>
                        { React.cloneElement(this.props.children) }
                    </div>
                </div>
            </div>
        );

        return recess(content, styles, this);
    }
}