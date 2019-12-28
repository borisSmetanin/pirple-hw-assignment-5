/**
 * Public exportable interface for Test runner
 * 
 * The rest of the file contains private methods and variables that should be accessed from outside
 */
const test_runner = {};
module.exports    = test_runner;

//=== Helper functions and constants ===============================/

const success_color = '\x1b[32m%s\x1b[0m';
const error_color   = '\x1b[31m%s\x1b[0m';
const report        = [];

const generate_main_title = (title) => {
    console.log('');
    console.log('=======================');
    console.log(title);
    console.log('=======================');
    console.log('');
}

const generate_small_title = (title) => {
    console.log('');
    console.log(`=== ${title} ===`);
    console.log('');
}
 

//=== Unit tests ====================================================/

/**
 * Unit Tests container
 * 
 * Contains all the tests that are going to run
 * Each test will contain and array of the specific context it is testing, e.g Unit, API, integration e.g...
 * Each context is an array of arrays. 
 * 
 * Inner array consist of the following 2 members: Tests title, test function.
 * 
 * Example:
 * unit_tests = {
 *      // testing `foo` library
 *      foo: [
 *          [
 *              'test should return 1',
 *              (callback) => {
 *                  assert(1,1)
 *                  callback();
 *              }
 *          ],
 *          [
 *              'test should return 2',
 *              (callback) => {
 *                  assert(1,2)
 *                  callback();
 *              }
 *          ]
 *      ],
 * 
 *      // testing bar library
 *      bar: [
 *          [ ...  ],
 *          [ .... ]
 *      ]
 *  }
 * 
 */
const unit_tests = {};

/**
 * Adding unit tests
 * 
 * Each test should be imported from the unit directory and should be added like the following example:
 * 
 * unit_tests.foo = require('./unit/test_unit_foo');
 * unit_tests.bar = require('./unit/test_unit_bar');
 * 
 */

// Add lib unit tests 
unit_tests.lib = require('./unit/test_unit_lib');


/**
 * Unit tests runner logic
 */
test_runner.run_unit_tests = () => {
    generate_main_title(`Starting unit tests`);
    for (const unit_test_name in unit_tests) {
        generate_small_title(`Testing "${unit_test_name}" Unit`);

        unit_tests[unit_test_name].forEach(([title, test_function]) => {
            let test_title = `Testing: ${unit_test_name} - ${title}`;
            try {
                test_function(() => {
                    console.log(success_color,`${test_title} - OK`);
                    report.push({
                        test_type: 'unit',
                        entity: unit_test_name,
                        title: title,
                        has_passed: true
                    });
                });
            } catch(e) {
                console.log(error_color, `${test_title} - Failed`);
                report.push({
                    test_type: 'unit',
                    entity: unit_test_name,
                    title: title,
                    has_passed: false,
                    error: e
                })
            }
        });       
    }
}

//=== HTTP tests ====================================================/

/**
 * HTTP Tests container
 * 
 * Contains all the HTTP tests that are going to run
 * Each HTTP test will contain an object with the following interface:
 * `tests`: array of tests, each test is an array of 2 members - title and function,
 * `server_start`: function that starts the server of the HTTP tests - should have a callback with initialized server
 * 
 * Inner array consist of the following 2 members: Tests title, test function.
 * 
 * Example:
 * unit_tests = {
 *      // testing `foo` library
 *      foo: {
 *         tests: [
 *              [
 *                  'foo test',
 *                  () => {
 *                      return new Promise((resolve) => {
 *                          // HTTP request made in the HTTP test module
 *                      })
 *                  }
 *              ]
 *         ],
 *         server_start: (callback) => { 
 *              // server is initialized somewhere in the http test module
 *               callback(initialized_server)
 *         }
 *      },
 *      bar: {
 *          tests: [],
 *          server_start: () => {}
 *      }
 *  }
 * 
 */
const http_tests = {};

// Adding HTTP tests
http_tests.web_app = require('./http/test_web_app');

/**
 * Loop on the HTTP test requests and execute them
 * 
 * @param {string} entity 
 * @param {array} http_test_requests 
 */
const loop_http_test_requests = (entity, http_test_requests) => {

    // Needs to be done in a promise:
    // HTTP server might be non blocking and execute request asynchronously
    return new Promise(async (resolve, reject) => {

        for (http_test in http_test_requests) {
    
            const [ test_title, test_function ] = http_test_requests[http_test];
            let title = `Testing: ${test_title}`;

            try {
                // Wait for the HTTP request to finish before moving on to the next one
                await test_function();
                console.log(success_color, `${title} - OK`);
                report.push({
                    test_type: 'http',
                    entity: entity,
                    title: test_title,
                    has_passed: true
                });
            } catch(e) {
                // In case test fails - it will be rejected and automatically go to here
                // reject is expected to have the original error from the test
                console.log(error_color, `${title} - Fail`);
                report.push({
                    test_type: 'http',
                    entity: entity,
                    title: test_title,
                    has_passed: false,
                    error: e
                });
                console.log('error', e);
            }
        }

        // After loop all HTTP requests, we can safely resolve this
        resolve(true);
    });
}

/**
 * Start the web server for a specific HTTP test
 * 
 * @param {function} server_start 
 */
const create_http_test_server = (server_start) => {
    return new Promise((resolve, reject) => {
        server_start((initialized_server) => {
            resolve(initialized_server);
        });
    });
}

/**
 * Run http tests
 */
test_runner.run_http_tests = async () => {

    return new Promise(async (resolve, reject) => {
        generate_main_title(`Starting unit tests`);

        // Loop on the http test entities and execute the different tests
        for (const http_test_entity in http_tests) {
            generate_small_title(`Testing "${http_test_entity}" HTTP requests`);
    
            const {tests, server_start} = http_tests[http_test_entity];

            // Generate the current server for testing
            const initialized_server = await create_http_test_server(server_start);

            // Execute the tests
            await loop_http_test_requests(http_test_entity, tests);

            // Once finished - Close the server
            initialized_server.close();
        }

        // All HTTP tests are done - resolve the promise
        resolve(true);
    });
}

/**
 * Generate test runner summery
 */
test_runner.generate_report = () => {
        //--- Generate the summery
        generate_main_title('Summery');
        const errors  = report.filter(({has_passed}) => { return ! has_passed } );
        const success = report.filter(({has_passed}) => { return has_passed   } );
    
        console.log(`Total errors:  ${errors.length}`);
        console.log(`Total success: ${success.length}`);
    
        //---- Final result - Test will fail if it has evan 1 error
        const has_passed = ! errors.length;
        console.log('');
        const pass_or_failed_string = has_passed ? 'passed' : 'failed'
        console.log(has_passed ? success_color :error_color ,`Final result: Test has ${pass_or_failed_string}`);
        console.log('');
    
        //---- Show errors in detail
        if (errors.length) {
            generate_main_title('Error report');
            console.log(errors);
        }
}

//=== Test runner main function ====================================/

/**
 * Run the test runner
 */
test_runner.run = async () => {
    
    // Run unit tests
    test_runner.run_unit_tests();

    // Run the HTTP tests
    await test_runner.run_http_tests();

    // Generate the report
    test_runner.generate_report();

    // Kill the node processes to make sure local initialized servers are down
    process.exit(0);
}

// Run the test
test_runner.run();