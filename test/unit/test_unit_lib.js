/**
 * Container for all lib unit tests
 */

const lib    = require('../../app/lib');
const assert = require('assert');

const test_unit_lib = [];

module.exports = test_unit_lib;

test_unit_lib.push([
    'return_one() - Should return 1',
    (callback) => {
        assert.equal(lib.return_one(), 1);
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'add_to_one() - Should return a number',
    (callback) => {
        assert.ok(typeof lib.add_to_one(3) === 'number');
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'add_to_one() - Should return 5',
    (callback) => {
        assert.equal(lib.add_to_one(4), 5);
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'add_to_one() - Should not throw when provided a number',
    (callback) => {
        assert.doesNotThrow(() => { lib.add_to_one(3); }, Error);
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'add_to_one() - Should throw when not a number type is provided',
    (callback) => {
        assert.throws(() => { lib.add_to_one('string'); }, Error);
        assert.throws(() => { lib.add_to_one(true); }, Error);
        assert.throws(() => { lib.add_to_one({}); }, Error);
        assert.throws(() => { lib.add_to_one([]); }, Error);
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'return_hello_string() - Should return "hello"',
    (callback) => {
        assert.equal(lib.return_hello_string(), 'hello');
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'return_hello_string() - Should return string',
    (callback) => {
        assert.ok(typeof lib.return_hello_string() === 'string');
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'add_to_hello_string() - Should return "hello world"',
    (callback) => {
        assert.equal(lib.add_to_hello_string('world'), 'hello world');
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'add_to_hello_string() - Should not throw error when adding string',
    (callback) => {
        assert.doesNotThrow(() => { lib.add_to_hello_string('world') }, Error);
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);

test_unit_lib.push([
    'add_to_hello_string() - Throw error when non string is given',
    (callback) => {
        assert.throws(() => { lib.add_to_hello_string(8) }, Error);
        assert.throws(() => { lib.add_to_hello_string([]) }, Error);
        assert.throws(() => { lib.add_to_hello_string({}) }, Error);
        assert.throws(() => { lib.add_to_hello_string(null) }, Error);
        // Will call back only if test passes
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
]);
