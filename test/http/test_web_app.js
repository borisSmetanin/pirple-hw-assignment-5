/**
 * Module file for testing the web-app
 */

// Load dependencies
const http          = require('http');
const assert        = require('assert');
const test_web_app  = {};
const web_app       = require('../../app/web_app');

module.exports = test_web_app;

/**
 * Interface for starting the web-app server
 */
test_web_app.server_start = (callback) => { 
    web_app.init((server) => {
        if (typeof callback === 'function') {
            callback(server);
        }
    });
};

// Container for the tests
test_web_app.tests  = [];

/**
 * Helper function for making HTTP requests top the web APP
 * 
 * @param {string} method 
 * @param {string} path 
 * @param {function} callback 
 */
const make_http_request = (method, path, callback) => {
    const http_request = {
        protocol: 'http:',
        hostname: 'localhost',
        port: 3005,
        method: method,
        path: path
    }

    const req = http.request(http_request, (res) => {
        callback(res);
    });

    req.end();
}

//=== HTTP request to test the web APP =============================/

test_web_app.tests.push([
    'Web App - Simple GET request status is 200',
     () => {
        return new Promise((resolve, reject) => {
            make_http_request('GET', '/', (res) => {
                try {
                    assert.equal(res.statusCode, 200);
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
]);

test_web_app.tests.push([
    'Web App - Simple POST request is status is 200',
     () => {
        return new Promise((resolve, reject) => {
            make_http_request('POST', '/', (res) => {
                try {
                    assert.equal(res.statusCode, 200);
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
]);

test_web_app.tests.push([
    'Web App - GET to unknown URI leads to 404',
     () => {
        return new Promise((resolve, reject) => {
            make_http_request('GET', '/foo/bar', (res) => {
                try {
                    assert.equal(res.statusCode, 404);
                    resolve(true);
                } catch (e) {
                    reject(e);
                }
            });
        });
    }
]);