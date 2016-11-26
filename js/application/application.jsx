// -------------------------------------------------------------
// This file contains the outer application container for Kakushin.
// -------------------------------------------------------------

import React from 'react'
import { Link } from 'react-router'
import recess from 'react-recess'
import authHelper from '../libs/auth-helper'
import apiLayer from '../libs/api-layer'
import sharedStyles from '../libs/shared-styles'
import ShadowDropdown from '../components/shadow-dropdown.jsx'
import LeftSideMenu from './left-side-menu.jsx'

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

    logout () {
        this.setState({ logoutLoading: true })
        apiLayer.auth.logout()
        .then(() => {
            this.setState({ logoutLoading: false })
        })
    }

    render () {
        const styles = {
            'div': {
                width: '100%',
                height: '100%',
                display: 'flex',

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
                                    background: '#f9f9f9'
                                },

                                ':active': {
                                    background: '#f1f1f1'
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

        const children = this.props.children ? React.cloneElement(this.props.children) : null

        // Render the current route
        const content = (
            <div>
                <LeftSideMenu expanded={this.state.leftMenuExpanded} />
                <div className='body'>
                    <div className='topBar'>
                        <div className='collapseMenu' onClick={this.toggleLeftMenu.bind(this)}><i className={`lnr lnr-chevron-${this.state.leftMenuExpanded ? 'left' : 'right'}-circle`} />{this.state.leftMenuExpanded ? 'Collapse' : 'Expand'}</div>
                        <div className='spacer'></div>
                        <div className='rightButtons'>
                            <div className='email'>{ authHelper.getCurrentUser().email }</div>
                            <div className='icon user'>
                                <i className='lnr lnr-user'></i>
                            </div>

                            <ShadowDropdown
                                recessStyles={{
                                    '.dropdown.shadow': {
                                        width: '45px', height: '100%',

                                        '.buttonInner': {
                                            background: '#fff',

                                            ':hover': {
                                                background: '#f9f9f9',
                                            },

                                            ':active': {
                                                background: '#f1f1f1',
                                            }
                                        },

                                        '.menu': {
                                            width: '150px'
                                        }
                                    }
                                }}
                                icon={<i className='lnr lnr-cog' />}
                                items={[
                                    <div className='item' key='3' style={{ borderBottom: 'none' }} onClick={this.logout.bind(this)}>
                                        <div className={`loaderOuter${this.state.logoutLoading ? ' active' : ''}`}>
                                            <div className='loader'></div>
                                        </div>
                                        <i className='lnr lnr-exit' style={{ marginRight: '10px', fontSize: '16px' }}/>Logout
                                    </div>
                                ]}
                            />
                        </div>
                    </div>
                    <div className='bodyInner'>
                        { children }
                    </div>
                </div>
            </div>
        );

        return recess(content, styles, this);
    }
}
