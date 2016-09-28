// -------------------------------------------------------------
// Authentication helper functions.
// -------------------------------------------------------------

import apiLayer from './api-layer.js'

class AuthHelper {
    constructor () {
        // Check every response from the server for 401 codes
        const checkResponse = (response, params) => {
            if (response.status === 401) {
                localStorage.removeItem('user-data');
                window.location.href = '/app/auth';
                return;
            }
            // If the user successfully logged in, get the user data and save the logged in session to the local storage
            if (params.url.match(/login/) && response.errors.length === 0) {
                localStorage.setItem('user-data', JSON.stringify(response.user));
            }
            // If the user successfully logged out, remove the user data from local storage
            if (params.url.match(/logout/) && response.errors.length === 0) {
                // Remove the logged in user from the local storage
                localStorage.removeItem('user-data');
                window.location.href = '/app/auth';
            }
        }
        // Sets the postSendHook on the api layer so authentication failures can be detected
        apiLayer.settings.setPostSendHook(checkResponse);
    }

    // Returns the logged in state of the user
    isLoggedIn () {
        return (this.getCurrentUser()) ? true : false;
    }

    // Returns the current user, or null if they aren't logged in
    getCurrentUser () {
        // Grab the user data from local storage and parse it
        return localStorage.getItem('user-data') ? JSON.parse(localStorage.getItem('user-data')) : null;
    }

    // Check if the session is authenticated
    checkAuthentication () {
        if (this.getCurrentUser()) {
            // apiLayer.getCurrentUser();
        }
    }

    // Start a recurring 5s authentication / internet connection check
    start () {
        setInterval(() => {
            // apiLayer.getCurrentUser();
        }, 5000);
    }
};

const authHelper = new AuthHelper();
export default authHelper;