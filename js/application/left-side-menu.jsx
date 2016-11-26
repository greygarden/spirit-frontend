// -------------------------------------------------------------
// This file contains the outer application container for Kakushin.
// -------------------------------------------------------------

import React from 'react'
import { Link } from 'react-router'
import recess from 'react-recess'
import sharedStyles from '../libs/shared-styles'
import DashboardDropdown from './dashboard-dropdown.jsx'

export default class LeftSideMenu extends React.Component {

    constructor (props) {
        super(props);
        this.state = {}
    }

    render () {
        const styles = {
            '.sideMenu': {
                width: this.props.expanded ? '200px' : '45px',
                height: '100%',
                background: '#556270',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',

                '.logoOuter': {
                    padding: this.props.expanded ? '10px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',

                    '.logo': {
                        background: '#83AF9B',
                        width: this.props.expanded ? '45px' : '65px',
                        height: this.props.expanded ? '55px' : '75px',
                        color: '#fff',
                        fontSize: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        lineHeight: '1.2',
                        marginRight: this.props.expanded ? '10px' : 0
                    },

                    '.title': {
                        color: '#fff',
                        font: '200 16px "Open Sans"',
                        display: this.props.expanded ? 'block' : 'none',

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
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'stretch',
                        cursor: 'pointer',
                        position: 'relative',

                        '.buttonInner': {
                            padding: this.props.expanded ? '15px' : '15px 0',
                            justifyContent: this.props.expanded ? 'flex-start' : 'center',
                            flexGrow: 1,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            zIndex: 2,
                            height: '50px',

                            'i': {
                                fontSize: this.props.expanded ? '18px' : '23px',
                                marginRight: this.props.expanded ? '15px' : 0
                            },

                            '.text': {
                                display: this.props.expanded ? 'block' : 'none',
                                flexGrow: '1',
                                position: 'relative'
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
                            }
                        }
                    },

                    '.active': {
                        fontWeight: '400',
                        background: sharedStyles.shadeColor('#556270', 12),

                        '.buttonInner': {

                            '.dot': {
                                'display': this.props.expanded ? 'block' : 'none'
                            }
                        }
                    }
                }
            }
        };

        // Render the current route
        const content = (
            <div className='sideMenu'>
                <div className='logoOuter'>
                    <div className='logo'>
                        <div>水</div>
                        <div>耕</div>
                    </div>
                    <div className='title'>
                        Spirit
                        <div className='subtitle'>Ilka Street</div>
                    </div>
                </div>
                <div className='menuButtons'>
                    <DashboardDropdown expanded={this.props.expanded}/>
                    <Link className='button' to='/app/workers' activeClassName='active'>
                        <div className='buttonInner'>
                            <i className='lnr lnr-leaf' /><div className='text'>Workers</div><div className='dot'></div>
                        </div>
                    </Link>
                    <Link className='button' to='/app/alerts' activeClassName='active'>
                        <div className='buttonInner'>
                            <i className='lnr lnr-alarm' /><div className='text'>Alerts</div><div className='dot'></div>
                        </div>
                    </Link>
                </div>
            </div>
        );

        return recess(content, styles, this);
    }
}
