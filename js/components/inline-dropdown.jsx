// -------------------------------------------------------------
// Inline dropdown menu component, including full text search
// of items.
// -------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import recess from 'react-recess'
import _ from 'lodash'
import OnClickOutside from 'react-onclickoutside'

var DropdownInline = OnClickOutside(React.createClass({
    showDropdown: function (event) {
        if (this.state.dropdownVisible === false) {
            this.setState({ dropdownVisible: true }, function () {
                ReactDOM.findDOMNode(this.refs.searchInput).focus();
            });
        }
        event.stopPropagation();
    },

    hideDropdown: function () {
        this.setState({ dropdownVisible: false, searchText: '' });
    },

    handleClickOutside: function () {
        this.hideDropdown();
    },

    updateSearchText: function (event) {
        this.setState({
            searchText: event.target.value
        });
    },

    getInitialState: function () {
        return { items: this.props.items, logoutLoading: false, dropdownVisible: false, searchText: '' };
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
            '.dropdown.inline': {
                position: 'relative',
                cursor: 'pointer',
                border: '1px solid #eee',

                '.inner': {
                    background: '#fff',
                    display: 'flex',
                    padding: '0 10px',
                    height: '40px',
                    alignItems: 'center',

                    '.text': {
                        flexGrow: '1',
                    },

                    'input': {
                        flexGrow: '1',
                        font: '200 14px "Open Sans"',
                        border: 'none'
                    },

                    '.icon': {
                        fontSize: '16px',
                        color: '#555',
                    },

                    '.menu': {
                        background: '#fff',
                        zIndex: '12',
                        cursor: 'auto',
                        display: 'none',
                        position: 'absolute',
                        top: '100%',
                        left: '-1px',
                        flexDirection: 'column',
                        maxHeight: '300px',
                        width: '100%',
                        overflowY: 'scroll',
                        border: '1px solid #eee',
                        borderTop: '1px solid #f5f5f5',
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

                            '.description': {
                                fontSize: '12px',
                                color: '#aaa',
                                marginLeft: '10px'
                            },

                            ':hover': {
                                background: '#f5f5f5'
                            },

                            ':active': {
                                background: '#eee'
                            }
                        },
                    },

                    '.menu.active': {
                        display: 'flex'
                    }
                }
            }
        }

        var textLabel;
        if (this.state.dropdownVisible === true) {
            textLabel = <input type='text' placeholder='Type to search...' value={this.state.searchText} onChange={this.updateSearchText} ref='searchInput' />
        } else {
            textLabel = <div className='text'>{this.props.textLabel}</div>;
        }

        var filteredItems = this.props.items;
        // If the search term was empty, just show all results
        if (this.state.searchText.length !== 0) {
            // Search the index for the input value
            filteredItems = _.filter(filteredItems, function (item) {
                return item.value.toLowerCase().includes(this.state.searchText.toLowerCase());
            }.bind(this));
        }

        var itemsToRender = filteredItems.map(function (item) { return item.component });

        const dropdown = (
            <div className='dropdown inline' onClick={this.showDropdown}>
                <div className='inner'>
                    {textLabel}
                    <i className="lnr lnr-chevron-down"></i>
                    <div className={`menu${this.state.dropdownVisible ? ' active' : ''}`}>
                        {itemsToRender}
                    </div>
                </div>
            </div>
        );

        return recess(dropdown, styles, this);
    }
}));

// BROWSERIFY EXPORTS -----------------------------------------

module.exports = DropdownInline;
