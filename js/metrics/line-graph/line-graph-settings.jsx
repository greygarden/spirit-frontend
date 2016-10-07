// -------------------------------------------------------------
// Settings for a line graph.
// -------------------------------------------------------------

import React from 'react'
import apiLayer from '../../libs/api-layer'
import recess from 'react-recess'
import InlineDropdown from '../../components/inline-dropdown.jsx'
import _ from 'lodash'
import sharedStyles from '../../libs/shared-styles'
import unitsHelper from '../../libs/units'

export default class LineGraphSettings extends React.Component {

    constructor (props) {
        super(props);
        const state = {
            title: this.props.title || '',
            workers: [],
            metrics: []
        };

        if (this.props.workerIdentifier) {
            state.selectedWorker = {
                workerIdentifier: this.props.workerIdentifier
            }
        }

        if (this.props.metricName) {
            state.selectedMetric = {
                name: this.props.metricName
            }
        }

        this.state = state;
    }

    updateTitle (event) {
        this.setState({
            title: event.target.value
        })
    }

    selectWorker (worker) {
        this.setState({
            selectedWorker: worker
        }, () => {
            apiLayer.metrics.listMetrics(worker.workerIdentifier)
            .then((data) => {
                this.setState({
                    metrics: data.metrics
                });
            });
        });
        this.refs.workerDropdown.getInstance().hideDropdown();
    }

    selectMetric (metric) {
        this.setState({
            selectedMetric: metric
        });
        this.refs.metricDropdown.getInstance().hideDropdown();
    }

    selectUnit (unit) {
        this.setState({
            selectedUnit: unit
        });
        this.refs.unitDropdown.getInstance().hideDropdown();
    }

    saveGraph () {
        this.props.saveGraph(this.props.identifier, {
            type: 'line',
            title: this.state.title,
            workerIdentifier: this.state.selectedWorker.workerIdentifier,
            metricName: this.state.selectedMetric.name,
            units: this.state.selectedUnit.key
        })
    }

    cancelEditing () {
        if (this.props.identifier) {
            this.props.toggleSettings()
        } else {
            this.props.deleteGraph()
        }
    }

    componentDidMount () {
        apiLayer.workers.getWorkers()
        .then((data) => {
            this.setState({
                workers: data.workers
            })
        })

        this.refs.title.focus();
    }

    render () {
        const dropdownMenuStyle = {
            width: '400px',
            paddingLeft: '10px',
            marginTop: '5px'
        }

        const styles = {
            '.settings': {
                background: '#fff',
                height: '380px',
                display: 'flex',
                flexDirection: 'column',

                '.title': {
                    padding: '0 10px',
                    color: '#777',
                    padding: '10px',

                    'input': {
                        border: 'none',
                        font: '400 16px "Open Sans"',
                        borderBottom: '2px solid #aaa',
                        padding: '5px 8px 10px 8px',
                        width: '300px'
                    }
                },

                '.workerSelection': {
                    '@includes': [dropdownMenuStyle],
                    'marginBottom': '15px'
                },

                '.metricSelection': {
                    '@includes': [dropdownMenuStyle],
                    'marginBottom': '15px'
                },

                '.unitSelection': {
                    '@includes': [dropdownMenuStyle]
                },

                '.buttons': {
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'row-reverse',
                    padding: '10px',

                    '.button': {
                        padding: '0 10px',
                        width: '100px',
                        height: '35px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        lineHeight: 1,
                        cursor: 'pointer',

                        'i': {
                            marginRight: '10px'
                        }
                    },

                    '.cancel': {
                        background: '#ddd',
                        marginRight: '10px',

                        ':hover': {
                            background: '#d9d9d9',
                        },

                        ':active': {
                            background: '#d3d3d3',
                        }
                    },

                    '.save': {
                        background: sharedStyles.shadeColor('#556270', 30),
                        color: '#fff',

                        ':hover': {
                            background: sharedStyles.shadeColor('#556270', 20),
                        },

                        ':active': {
                            background: sharedStyles.shadeColor('#556270', 10),
                        }
                    }
                }
            }
        };

        const workers = this.state.workers.map((worker) => {
            return {
                value: `${worker.workerIdentifier} ${worker.name}`,
                component: <div className='item' onClick={this.selectWorker.bind(this, worker)} key={worker.workerIdentifier}>{worker.name || 'New Worker'} <div className='description'>({worker.workerIdentifier})</div></div>
            }
        })

        const metrics = this.state.metrics.map((metric) => {
            return {
                value: `${metric.name}`,
                component: <div className='item' onClick={this.selectMetric.bind(this, metric)} key={metric.name}>{metric.name}</div>
            }
        })

        const units = _.map(unitsHelper.units, (unit) => {
            return {
                value: `${unit.label}`,
                component: <div className='item' onClick={this.selectUnit.bind(this, unit)} key={unit.label}>{unit.label} ({unit.shortLabel})</div>
            }
        })

        let settings = (
            <div className='settings'>
                <div className='title'>
                    <input placeholder='Graph Title' value={this.state.title} onChange={this.updateTitle.bind(this)} ref={'title'} />
                </div>
                <div className='workerSelection'>
                    <InlineDropdown items={workers} textLabel={(this.state.selectedWorker && (this.state.selectedWorker.name || this.state.selectedWorker.workerIdentifier)) || 'Select Worker'} ref='workerDropdown' />
                </div>
                <div className='metricSelection'>
                    <InlineDropdown items={metrics || []} textLabel={(this.state.selectedMetric && this.state.selectedMetric.name) || 'Select Metric'} ref='metricDropdown' />
                </div>
                <div className='unitSelection'>
                    <InlineDropdown items={units} textLabel={(this.state.selectedUnit && this.state.selectedUnit.label) || 'Select Units'} ref='unitDropdown' />
                </div>
                <div style={{flexGrow: 1}} />
                <div className='buttons'>
                    <div className='button save' onClick={this.saveGraph.bind(this)}><i className='lnr lnr-checkmark-circle' />Save</div>
                    <div className='button cancel' onClick={this.cancelEditing.bind(this)}><i className='lnr lnr-cross-circle' />Cancel</div>
                </div>
            </div>
        );

        settings = recess(settings, styles, this);
        
        return settings;
    }
};