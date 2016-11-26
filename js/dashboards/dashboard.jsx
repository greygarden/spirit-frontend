// -------------------------------------------------------------
// This file contains a page that allows users to check domain
// registration details including expiry date.
// -------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import recess from 'react-recess'
import GraphOuter from './shared-graph/graph-outer.jsx'
import apiLayer from '../libs/api-layer'
import sharedStyles from '../libs/shared-styles'
import _ from 'lodash'

export default class MetricsOuter extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            title: '',
            inputTitle: '',
            graphs: [],
            editingTitle: false,
            inputWidth: 0,
            titleLoading: false
        }
    }

    titleKeyPress (event) {
        if (event.key === 'Enter') {
            event.target.blur()
        }
    }

    updateTitle (event) {
        const title = event.target.value

        this.setState({
            title: event.target.value
        }, () => {
            this.setState({
                inputTitle: title,
                inputWidth: ReactDOM.findDOMNode(this.refs.title).offsetWidth
            })
        })
    }

    saveTitle () {
        this.setState({ titleLoading: true })
        apiLayer.dashboards.updateDashboard(this.props.params.dashboardIdentifier, { title: this.state.title  })
        .then((data) => {
            this.setState({
                editingTitle: false,
                titleLoading: false
            })
        })
    }

    toggleEditingTitle () {
        this.setState({ editingTitle: !this.state.editingTitle }, () => {
            if (this.state.editingTitle) {
                ReactDOM.findDOMNode(this.refs.titleInput).focus()
                ReactDOM.findDOMNode(this.refs.titleInput).select()
            }
        })
    }

    newGraph (dashboardIdentifier, type) {
        this.setState({ newGraphLoading: true })
        apiLayer.graphs.createGraph({ dashboardIdentifier, type })
        .then((data) => {
            data.graph.settingsVisible = true;
            this.state.graphs.push(data.graph);
            this.setState({
                graphs: this.state.graphs,
                newGraphLoading: false
            });
        });
    }

    saveGraph (identifier, graphProps) {
        return apiLayer.graphs.updateGraph(identifier, graphProps)
        .then((data) => {
            data.graph.settingsVisible = false;
            const index = _.findIndex(this.state.graphs, g => g.identifier === identifier );
            this.state.graphs[index] = data.graph;
            this.setState({
                graphs: this.state.graphs
            })
        });
    }

    deleteGraph (identifier) {
        return apiLayer.graphs.deleteGraph(identifier)
        .then(() => {
            const index = _.findIndex(this.state.graphs, g => g.identifier === identifier );
            this.state.graphs.splice(index, 1)
            this.setState({ graphs: this.state.graphs })
        });
    }

    newControl () {
        this.setState({ newControlLoading: true })
        apiLayer.controls.createControl()
        .then((data) => {
            data.graph.settingsVisible = true;
            this.state.graphs.push(data.graph);
            this.setState({
                graphs: this.state.graphs,
                newGraphLoading: false
            });
        });
    }

    getDashboardData () {
        apiLayer.dashboards.getDashboard(this.props.params.dashboardIdentifier)
        .then((data) => {
            if (data.errors.length === 0) {
                this.setState({
                    title: data.dashboard.title,
                    inputTitle: data.dashboard.title
                }, () => {
                    this.setState({ inputWidth: ReactDOM.findDOMNode(this.refs.title).offsetWidth })
                })
                apiLayer.graphs.getGraphs(this.props.params.dashboardIdentifier)
                .then((data) => {
                    this.setState({
                        graphs: data.graphs
                    })
                })
            }
        })
    }

    componentWillReceiveProps (nextProps) {
        if (this.props.params.dashboardIdentifier !== nextProps.params.dashboardIdentifier) {
            this.getDashboardData()
        }
    }

    componentDidMount () {
        this.getDashboardData()
    }

    render () {
        const styles = {
            '.dashboard': {
                width: '100%',
                overflow: 'auto',
                padding: '5px',
                background: '#f8f8f8',
                display: 'flex',
                flexGrow: 1,
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                alignContent: 'flex-start',

                '.title': {
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px 10px',
                    position: 'relative',

                    'input': {
                        visibility: this.state.editingTitle ? 'visible' : 'hidden',
                        position: 'absolute',
                        zIndex: 1,
                        padding: '3px 8px',
                        border: 'none',
                        background: '#fff',
                        font: '200 20px "Open Sans"',
                        color: '#666',
                        boxSizing: 'border-box',
                        width: (Math.max(this.state.inputWidth, 140)) + 'px',
                        border: '2px solid transparent',
                    },

                    '.text': {
                        font: '200 20px "Open Sans"',
                        color: '#666',
                        padding: '3px 8px',
                        whiteSpace: 'pre',
                        border: '2px solid transparent',
                        minWidth: '140px',
                        '@includes': [ sharedStyles.loader ],

                        ':hover': {
                            background: '#fafafa',
                            border: '2px solid #f1f1f1'
                        }
                    },

                    '.newGraph': {
                        marginLeft: '10px',
                        font: '400 14px "Open Sans"',
                        color: '#aaa',
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: this.state.newGraphLoading ? '#eee' : 'transparent',
                        '@includes': [ sharedStyles.loader ],

                        'i': {
                            fontSize: '16px',
                            color: '#666',
                            marginRight: '8px'
                        },

                        ':hover': {
                            background: '#eee'
                        },

                        ':active': {
                            background: '#e5e5e5'
                        }
                    }
                }
            }
        };

        const graphs = this.state.graphs.map((graph) => {
            // New graph
            return <GraphOuter {...graph} key={graph.identifier} saveGraph={this.saveGraph.bind(this, graph.identifier)} deleteGraph={this.deleteGraph.bind(this, graph.identifier)} />
        });

        let outer = (
            <div className='dashboard'>
                <div className='title'>
                    <input ref='titleInput' placeholder='Title' value={this.state.inputTitle} onChange={this.updateTitle.bind(this)} onBlur={this.saveTitle.bind(this)} onKeyPress={this.titleKeyPress.bind(this)} />
                    <div ref='title' className='text' onClick={this.toggleEditingTitle.bind(this)}>
                        <div className={`loaderOuter${this.state.titleLoading ? ' active' : ''}`}>
                            <div className='loader'></div>
                        </div>
                        {this.state.title}
                    </div>
                    <div className='newGraph' onClick={this.newGraph.bind(this, this.props.params.dashboardIdentifier, 'line')}>
                        <div className={`loaderOuter${this.state.newGraphLoading ? ' active' : ''}`}>
                            <div className='loader'></div>
                        </div>
                        <i className='lnr lnr-plus-circle'></i>New Graph
                    </div>
                    <div className='newGraph' onClick={this.newControl.bind(this, this.props.params.dashboardIdentifier)}>
                        <div className={`loaderOuter${this.state.newControlLoading ? ' active' : ''}`}>
                            <div className='loader'></div>
                        </div>
                        <i className='lnr lnr-plus-circle'></i>New Control
                    </div>
                </div>
                {graphs}
            </div>
        );

        outer = recess(outer, styles, this);

        return outer;
    }
};
