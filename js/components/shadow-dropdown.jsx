// -------------------------------------------------------------
// Inline dropdown menu component, including full text search
// of items.
// -------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import recess from 'react-recess'
import _ from 'lodash'
import sharedStyles from '../libs/shared-styles'
import OnClickOutside from 'react-onclickoutside'

var ShadowDropdown = OnClickOutside(React.createClass({
    toggleDropdown: function (event) {
        this.setState({
            dropdownVisible: !this.state.dropdownVisible
        })
    },

    handleClickOutside: function () {
        this.setState({ dropdownVisible: false })
    },

    getInitialState: function () {
        return { items: this.props.items, dropdownVisible: false };
    },

    componentDidMount: function () {
        // // Register an listener with the global dispatcher to pickup events
        // this.globalEventToken = globalDispatcher.register(function (payload) {
        //     // If we caught the loading started event, set the loading state to true
        //     if (payload.actionType === 'escape-key-pressed') {
        //         this.hideDropdown();
        //     }
        // }.bind(this));
    },

    componentWillUnmount: function () {
        // When we unmount, stop listening to events
        // globalDispatcher.unregister(this.globalEventToken);
    },

    render: function () {
        const styles = {
            '.dropdown.shadow': {
                borderRight: 'none',
                position: 'relative',

                '.buttonInnerBehind': {
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    display: this.state.dropdownVisible ? 'flex' : 'none',
                    zIndex: '11',
                    boxShadow: this.state.dropdownVisible ? '0 0px 10px 1px rgba(70, 70, 70, 0.2)' : 'none',
                },

                '.buttonInner': {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: '#999',
                    zIndex: '13',
                    position: 'relative',
                    cursor: 'pointer'
                },

                '.active': {
                    background: '#fff',

                    ':hover': {
                        background: '#fff',
                    },

                    ':active': {
                        background: '#fff',
                    }
                },

                '.menu': {
                    display: this.state.dropdownVisible ? 'flex' : 'none',
                    background: '#fff',
                    zIndex: '12',
                    cursor: 'auto',
                    position: 'absolute',
                    boxShadow: '0 0 10px 1px rgba(70, 70, 70, 0.2)',
                    top: '100%',
                    right: '0px',
                    flexDirection: 'column',
                    maxHeight: '300px',
                    width: '200px',
                    boxSizing: 'content-box',

                    '.item': {
                        flexShrink: '0',
                        display: 'flex',
                        alignItems: 'center',
                        height: '40px',
                        borderBottom: '1px solid #f5f5f5',
                        cursor: 'pointer',
                        font: '200 14px "Open Sans"',
                        color: '#555',
                        width: '100%',
                        padding: '0 10px',
                        background: '#fff',
                        '@includes': [ sharedStyles.loader ],

                        ':hover': {
                            background: '#f9f9f9'
                        },

                        ':active': {
                            background: '#f1f1f1'
                        }
                    },
                }
            }
        }

        if (this.props.recessStyles) {
            _.merge(styles, this.props.recessStyles);
        }

        const dropdown = (
            <div className='dropdown shadow'>
                <div className='buttonInnerBehind'></div>
                <div className={`buttonInner${this.state.dropdownVisible ? ' active' : ''}`} onClick={this.toggleDropdown}>
                    {this.props.icon}
                </div>
                <div className='menu'>
                    {this.props.items}
                </div>
            </div>
        );

        return recess(dropdown, styles, this);
    }
}));

// BROWSERIFY EXPORTS -----------------------------------------

module.exports = ShadowDropdown;