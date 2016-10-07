// -------------------------------------------------------------
// Outer container for a graph.
// -------------------------------------------------------------

import React from 'react'
import recess from 'react-recess'
import apiLayer from '../../libs/api-layer'
import units from '../../libs/units'
import LineGraphRendered from '../line-graph/line-graph-rendered.jsx'
import LineGraphSettings from '../line-graph/line-graph-settings.jsx'
import _ from 'lodash'

export default class GraphOuter extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            settingsVisible: this.props.settingsVisible
        }
    }

    toggleExpanded (callback) {
        this.setState({
            expanded: !this.state.expanded
        }, () => {
            if (callback) { callback(); };
        });
    }

    toggleSettings () {
        this.setState({
            settingsVisible: !this.state.settingsVisible
        })
    }

    render () {
        const outerStyles = {
            '.graphOuter': {
                width: this.state.expanded ? '1205px' : '595px',
                maxWidth: this.state.expanded ? '1205px' : '595px',
                border: '1px solid #eee',
                margin: '7.5px'
            }
        }

        let graph;
        if (this.state.settingsVisible || !this.props.workerIdentifier || !this.props.metricName || !this.props.units) {
            graph = <LineGraphSettings {...this.props} saveGraph={this.props.saveGraph} toggleSettings={this.toggleSettings.bind(this)} />
        } else {
            graph = <LineGraphRendered {...this.props} toggleExpanded={this.toggleExpanded.bind(this)} deleteGraph={this.props.deleteGraph} toggleSettings={this.toggleSettings.bind(this)} />
        }

        const outer = (
            <div className='graphOuter'>
                {graph}
            </div>
        );

        return recess(outer, outerStyles, this);
    }
}