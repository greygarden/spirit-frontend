// -------------------------------------------------------------
// This file contains an abstracted way to call the Spirit API by exposing
// various endpoints in a user friendly way.
// -------------------------------------------------------------

import request from 'reqwest'
import _ from 'lodash'
import Promise from 'bluebird'

// Optionally pass in a post send hook that will be called after any response is returned
var postSendHook;
// Make a call to the Spirit API and return a promise
const makeAjaxCall = (url, method, data) => {
    let params = {
        method: method,
        url: url,
        withCredentials: true
    };
    // If we're making a GET request, update query string
    if (method === 'GET') {
        _.extend(params, { data: data });
    } else { // Otherwise use JSON
        if (data && !_.isEmpty(data)) {
            _.extend(params, { data: JSON.stringify(data), type: 'json' });
        } else { // If there is no data, don't bother to try and stringify it
            _.extend(params, { type: 'json' });
        }
    }
    // Wrap the call to reqwest in a promise so we can hook into the return value
    return new Promise(function (resolve, reject) {
        request(params)
        .then((response) => {
            if (_.isFunction(postSendHook)) { postSendHook(response, params); }
            resolve(response);
        })
        .fail((response, message) => {
            if (_.isFunction(postSendHook)) { postSendHook(response, params); }
            reject(response);
        });
    });
};

export default {
    makeAjaxCall: makeAjaxCall,
    metrics: {
        // Lists all available metrics for a specific worker
        listMetrics (workerIdentifier) {
            return makeAjaxCall(`${process.env.API_URL}/metrics_list`, 'GET', { workerIdentifier: workerIdentifier });
        },
        // Get all the metrics of a specfic type logged by a specific worker between two timestamps
        getMetrics (workerIdentifier, metricName, groupBySeconds, startTimestamp, endTimestamp) {
            return makeAjaxCall(`${process.env.API_URL}/metrics`, 'GET', { workerIdentifier: workerIdentifier, metricName: metricName, groupBySeconds: groupBySeconds, startTimestamp: startTimestamp, endTimestamp: endTimestamp });
        },

        getMetricMax (workerIdentifier, metricName, startTimestamp, endTimestamp) {
            return makeAjaxCall(`${process.env.API_URL}/metric_max`, 'GET', { workerIdentifier: workerIdentifier, metricName: metricName, startTimestamp: startTimestamp, endTimestamp: endTimestamp });
        },

        getMetricMin (workerIdentifier, metricName, startTimestamp, endTimestamp) {
            return makeAjaxCall(`${process.env.API_URL}/metric_min`, 'GET', { workerIdentifier: workerIdentifier, metricName: metricName, startTimestamp: startTimestamp, endTimestamp: endTimestamp });
        },
    },
    graphs: {
        getGraphs () {
            return makeAjaxCall(`${process.env.API_URL}/graphs`, 'GET');
        },

        createGraph (graphProps) {
            return makeAjaxCall(`${process.env.API_URL}/create_graph`, 'POST', graphProps);
        },

        updateGraph (identifier, graphProps) {
            return makeAjaxCall(`${process.env.API_URL}/update_graph`, 'POST', { identifier, graphProps });
        },

        deleteGraph (identifier) {
            return makeAjaxCall(`${process.env.API_URL}/delete_graph`, 'POST', { identifier });
        }
    },
    workers: {
        getWorkers () {
            return makeAjaxCall(`${process.env.API_URL}/workers`, 'GET');
        }
    },
    auth: {
        login (email, password) {
            return makeAjaxCall(`${process.env.API_URL}/auth/login`, 'POST', { email: email, password: password });
        },

        logout () {
            return makeAjaxCall(`${process.env.API_URL}/auth/logout`, 'POST');
        },
    },
    settings: {
        // This hook will be called with the returned JSON after every request before the request promise is resolved.
        setPostSendHook: function (hook) {
            postSendHook = hook;
        },
    }
};
