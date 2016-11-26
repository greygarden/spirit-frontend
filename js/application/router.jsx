// -------------------------------------------------------------
// This file contains a react.js router that handles all the routing
// for the Watchtower single page application.
// -------------------------------------------------------------

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, Redirect, browserHistory, IndexRoute } from 'react-router'
import Auth from '../auth/auth.jsx'
import authHelper from '../libs/auth-helper.js'
import Application from './application.jsx'
import Dashboard from '../dashboards/dashboard.jsx'

// Unauthenticated routes
var authRoutes = (
    <Route>
        <Route path="/app">
            <Route path="auth" component={Auth} />
            <Redirect from="*" to="/app/auth" />
        </Route>
        <Redirect from="*" to="/app/auth" />
    </Route>
);

// Authenticated routes
const appRoutes = (
    <Route>
        <Route name='application' path='app' component={Application}>
            <Route path='dashboards/:dashboardIdentifier' component={Dashboard} />
        </Route>
        <Redirect from='*' to='/app' />
    </Route>
)

export default {
    getCurrentPath () {
        return Router.getCurrentPath();
    },

    run () {
        var routes = authHelper.isLoggedIn() ? appRoutes : authRoutes;
        ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('application-outer'));
    }
}
