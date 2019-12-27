/**
 * test runner
 */

const assert = require('assert');
const lib    = require('../app/lib');

const test_runner = {};

// module.exports = test_runner;

test_runner.unit = [];
test_runner.api  = [];

test_runner.unit.push(
    [
        'lib/test() - should return 1',
        (callback) => {
            assert.equal(lib.test(), 1);
            // Will call back only if test passes
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    ]
);

test_runner.run = () => {
    const report = [];
    const success_color = '\x1b[32m%s\x1b[0m';
    const error_color = '\x1b[31m%s\x1b[0m';

    test_runner.unit.forEach(([title, test_function]) => {
        console.log('');
        console.log('=======================');
        console.log('Executing tests');
        console.log('=======================');
        console.log('');
        try {

            test_function(() => {
                console.log(success_color,`Testing: ${title} - OK`);
                report.push({
                    title: title,
                    has_passed: true
                });
            });
        } catch(e) {
            console.log(error_color, `Testing: ${title} - failed`);
            report.push({
                title: title,
                has_passed: false,
                error: e
            })
        }
    });
    console.log('');
    console.log('=======================');
    console.log('Summery');
    console.log('=======================');
    console.log('');
    const errors  = report.filter(({has_passed}) => { return ! has_passed } );
    const success = report.filter(({has_passed}) => { return has_passed   } );

    console.log(`Total errors:  ${errors.length}`);
    console.log(`Total success: ${success.length}`);
    const has_passed = success.length > errors.length;
    console.log('');
    const pass_or_failed_string = has_passed ? 'passed' : 'failed'
    console.log(has_passed ? success_color :error_color ,`Final result: Test has ${pass_or_failed_string}`);
    console.log('');
}

test_runner.run();



