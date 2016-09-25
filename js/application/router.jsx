// -------------------------------------------------------------
// This file contains a react.js router that handles all the routing
// for the Watchtower single page application.
// -------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, browserHistory, IndexRoute } from 'react-router'
import Application from './application.jsx'
import Metrics from '../metrics/metrics-outer.jsx'

// Define the routes to use
const appRoutes = (
    <Route>
        <Redirect from='app' to='/app/metrics' />
        <Route name='application' path='app' component={Application}>
            <Route path='metrics' component={Metrics} />
        </Route>
        <Redirect from='*' to='/app' />
    </Route>
)

export default {
    getCurrentPath () {
        return Router.getCurrentPath();
    },

    run () {
        // Use the auth routes if not authenticated
        ReactDOM.render(<Router history={browserHistory}>{appRoutes}</Router>, document.getElementById('application-outer'));
    }
}