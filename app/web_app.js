/**
 * Demo app for testing
 */

const http = require('http');
const url  = require('url');

const web_app = {};

module.exports = web_app;

// Initialize the web app
web_app.init = (server_initialized_callback) => {

    const hostname = 'localhost';
    const port     = 3005;

    // Create the server
    const server = http.createServer((req, res) => {

        const parsed_url       = url.parse(req.url, true);
        const pathname         = parsed_url.pathname;
        const trimmed_path     = pathname.replace(/^\/+|\/+$/g, '');
        const requested_method = req.method.toLowerCase();

        // Basic gourd validations
        if (trimmed_path) {
            web_app.not_found(req, res);
            return false;
        }
        
        if (requested_method === 'server'){
            web_app.not_found(req, res);
            return false;
        }
        
        if ( ! web_app[requested_method]) {
            web_app.not_found(req, res);
            return false;
        }

        if ( typeof web_app[requested_method]  !== 'function') {
            console.log('in here')
            web_app.not_found(req, res);
            return false;
        }

        try {
            // Execute the valid request
            web_app[requested_method](req, res);
        } catch(e) {
            // In case something went wrong - don't kill the app
            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal server error');
        }
    });

    // Start the server
    server.listen(port, hostname, () => {
        console.log(`----`);
        console.log(`Server running at http://${hostname}:${port}/`);
        console.log(`----`);

        // Callback once server is up and running
        if (server_initialized_callback) {
            server_initialized_callback(server);
        }
    });
}

//=== Sample allowed HTTP requests

web_app.get = (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Hello World</h1>');
}

web_app.post = (req, res) => {

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        hello: 'world'
    }));
}

web_app.not_found = (req, res) => {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.end('<h1>Page not found</h1>');
}

// This way the server can be initialized directly form command line
if (require.main === module) {
    web_app.init();
}