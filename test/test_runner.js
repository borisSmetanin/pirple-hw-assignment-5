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
 *      // testing `lib` library
 *      lib: [
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
 *      //... other unit tests
 *      other_lib: [
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

//=== API tests ====================================================/

// Api test container
const api_tests  = [];

//=== Test runner main function ====================================/
test_runner.run = () => {
    
    //---- Run the different tests
    test_runner.run_unit_tests();

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

test_runner.run();



