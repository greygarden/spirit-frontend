// -------------------------------------------------------------
// This file contains the outer application container for Kakushin.
// -------------------------------------------------------------

import React from 'react'
import { Link } from 'react-router'
import recess from 'react-recess'
import apiLayer from '../libs/api-layer'
import sharedStyles from '../libs/shared-styles'
import OnClickOutside from 'react-onclickoutside'

export class DashboardDropdown extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            dropdownVisible: false,
            dashboards: [],
            createDashboardLoading: false
        }

        apiLayer.dashboards.getDashboards()
        .then((data) => {
            if (data.errors.length === 0) {
                this.setState({
                    dashboards: data.dashboards
                })
            }
        })
    }

    toggleDashboardDropdown () {
        this.setState({
            dropdownVisible: !this.state.dropdownVisible
        })
    }

    createDashboard () {
        this.setState({ createDashboardLoading: true })
        apiLayer.dashboards.createDashboard()
        .then((data) => {
            if (data.errors.length === 0) {
                this.state.dashboards.push(data.dashboard)
                this.state.createDashboardLoading = false
                this.setState(this.state)
            }
        })
    }

    handleClickOutside (event) {
        this.setState({ dropdownVisible: false })
    }

    render () {
        const styles = {
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
                    },
                },

                '.menu': {
                    display: this.state.dropdownVisible ? 'flex' : 'none',
                    background: '#fff',
                    zIndex: '1',
                    cursor: 'auto',
                    position: 'absolute',
                    boxShadow: '0 0 10px 1px rgba(70, 70, 70, 0.2)',
                    top: '0',
                    left: '100%',
                    flexDirection: 'column',
                    maxHeight: '400px',
                    width: '300px',
                    boxSizing: 'content-box',

                    '.item': {
                        flexShrink: '0',
                        display: 'flex',
                        alignItems: 'stretch',
                        flexGrow: 1,
                        height: '50px',
                        borderBottom: '1px solid #f5f5f5',
                        cursor: 'pointer',
                        font: '200 14px "Open Sans"',
                        color: '#555',
                        width: '100%',
                        background: '#fff',
                        '@includes': [ sharedStyles.loader ],

                        '.text': {
                            padding: '0 15px',
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,

                            'i': {
                                fontSize: '18px',
                                marginRight: '10px',
                                marginTop: '-2px'
                            },

                            ':hover': {
                                background: '#f9f9f9'
                            },

                            ':active': {
                                background: '#f1f1f1'
                            }
                        },

                        '.empty': {
                            cursor: 'auto',
                            color: '#888',

                            ':hover': {
                                background: '#fff'
                            },

                            ':active': {
                                background: '#fff'
                            }
                        },

                        '.search': {
                            flexGrow: 1,
                            paddingLeft: '15px',
                            border: 'none',
                            font: '200 14px "Open Sans"'
                        }
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
            },

            '.white': {

                '.buttonInner': {
                    background: '#fff',
                    borderRight: '1px solid #eee',

                    '.text': {
                        color: '#556270',
                    },

                    '.dot': {
                        background: 'rgba(85, 98, 112, 0.5)',
                    },

                    i: {
                        color: '#556270',
                    },

                    ':hover': {
                        background: '#fff'
                    },

                    ':active': {
                        background: '#fff'
                    },
                },

                '.buttonInnerBehind': {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 0,
                    boxShadow: '0 0 10px 1px rgba(30, 30, 30, 0.5)',
                },
            }
        };

        let dashboardMenuContent = <div className='item'><div className='text empty'>No dashboards found.</div></div>
        if (this.state.dashboards.length > 0) {
            dashboardMenuContent = this.state.dashboards.map((dashboard) => {
                return (
                    <Link className='item' key={dashboard.identifier} to={`/app/dashboards/${dashboard.identifier}`} onClick={() => { this.setState({ dropdownVisible: false }) }}>
                        <div className='text'>{dashboard.title}</div>
                    </Link>
                )
            })
        }

        // Render the current route
        const content = (
            <div className={`button${window.location.href.match('/app/dashboard') ? ' active' : ''}${this.state.dropdownVisible ? ' white' : ''}`} onClick={this.toggleDashboardDropdown.bind(this)}>
                <div className='buttonInner'>
                    <i className='lnr lnr-pie-chart' /><div className='text'>Dashboards</div><div className='dot'></div>
                </div>
                <div className='buttonInnerBehind' />
                <div className='menu' onClick={function (event) { event.stopPropagation() }}>
                    <div className='item'><input className='search' type='text' placeholder='Search Dashboards' /></div>
                    <div className='item' onClick={this.createDashboard.bind(this)}>
                        <div className={`loaderOuter${this.state.createDashboardLoading ? ' active' : ''}`}>
                            <div className='loader'></div>
                        </div>
                        <div className='text addNew'>
                            <i className='lnr lnr-plus-circle'/>Add New Dashboard
                        </div>
                    </div>
                    {dashboardMenuContent}
                </div>
            </div>
        );

        return recess(content, styles, this);
    }
}

export default OnClickOutside(DashboardDropdown)
