// -------------------------------------------------------------
// Outer container for a control.
// -------------------------------------------------------------

import React from 'react'
import recess from 'react-recess'
import apiLayer from '../../libs/api-layer'
import InputControlRendered from './input-control-rendered.jsx'
import InputControlSettings from './input-control-settings.jsx'
import _ from 'lodash'

export default class ControlOuter extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            settingsVisible: this.props.settingsVisible
        }
    }

    toggleSettings () {
        this.setState({
            settingsVisible: !this.state.settingsVisible
        })
    }

    render () {
        const outerStyles = {
            '.controlOuter': {
                height: '382px',
                width: '382px',
                margin: '7.5px'
            }
        }

        let graph;
        const unconfigured = !this.props.workerControlIdentifier
        if (this.state.settingsVisible || unconfigured) {
            // graph = <InputControlSettings {...this.props} updateGraph={this.props.updateGraph} deleteGraph={this.props.deleteGraph} toggleSettings={this.toggleSettings.bind(this)} unconfigured={unconfigured} />
        } else {
            // graph = <InputControlRendered {...this.props} toggleExpanded={this.toggleExpanded.bind(this)} deleteGraph={this.props.deleteGraph} toggleSettings={this.toggleSettings.bind(this)} />
        }

        const outer = (
            <div className='graphOuter'>
                {graph}
            </div>
        );

        return recess(outer, outerStyles, this);
    }
}
