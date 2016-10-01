// -------------------------------------------------------------
// Outer container for a graph.
// -------------------------------------------------------------

import React from 'react'
import recess from 'react-recess'
import apiLayer from '../../libs/api-layer'
import LineGraphRendered from '../line-graph/line-graph-rendered.jsx'
import LineGraphSettings from '../line-graph/line-graph-settings.jsx'

const graphTypes = {
    line: {
        rendered: LineGraphRendered,
        settings: LineGraphSettings
    }
}

export default class GraphOuter extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            settingsVisible: this.props.settingsVisible,
            graphProperties: {}
        }
    }

    toggleExpanded () {
        this.setState({
            expanded: !this.state.expanded
        }, () => {
            this.syncData();
        });
    }

    toggleSettings () {
        this.setState({
            settingsVisible: !this.state.settingsVisible
        })
    }

    saveGraph (graphProps) {
        if (!this.props.identifier) {
            apiLayer.graphs.createGraph(graphProps)
            .then((data) => {
                this.setState({
                    settingsVisible: false
                })
            })
        } else {
            apiLayer.graphs.updateGraph(this.props.identifier, graphProps)
            .then((data) => {
                this.setState({
                    settingsVisible: false
                })
            })
        }
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

        const Graph = this.state.settingsVisible ? graphTypes[this.props.type].settings : graphTypes[this.props.type].rendered;

        const outer = (
            <div className='graphOuter'>
                <Graph {...this.props} units={'°C'} highlightColor={'#FC9D9A'} formatValue={v => parseFloat(v).toFixed(1)} toggleExpanded={this.toggleExpanded.bind(this)} deleteGraph={this.props.deleteGraph} saveGraph={this.saveGraph.bind(this)} toggleSettings={this.toggleSettings.bind(this)} />
            </div>
        );

        return recess(outer, outerStyles, this);
    }
}