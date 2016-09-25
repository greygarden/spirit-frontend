// -------------------------------------------------------------
// This file contains an abstracted way to call the Spirit API by exposing
// various endpoints in a user friendly way.
// -------------------------------------------------------------

import request from 'reqwest'
import _ from 'lodash'
import Promise from 'bluebird'

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
            resolve(response);
        })
        .fail((response, message) => {
            reject(response);
        });
    });
};

export default {
    metrics: {
        // Get all the metrics of a specfic type logged by a specific worker between two timestamps
        getMetrics (workerIdentifier, metricName, groupBySeconds, startTimestamp, endTimestamp) {
            return makeAjaxCall(`${process.env.API_URL}/metrics`, 'GET', { workerIdentifier: workerIdentifier, metricName: metricName, groupBySeconds: groupBySeconds, startTimestamp: startTimestamp, endTimestamp: endTimestamp });
        }
    }
};
