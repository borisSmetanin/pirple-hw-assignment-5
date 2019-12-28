/**
 * Container for a simple js lib that is going to be tested later on with my test lib
 */

 const lib = {};

 lib.return_one = () => {
     return 1;
 }

 lib.add_to_one = (number) => {

    if ( typeof number !== 'number')
        throw new Error('Lib - add_to_one - None numeric input was given');

    return lib.return_one() + number;
 }

 lib.return_hello_string = () => {
     return 'hello';
 }

 lib.add_to_hello_string = (string) => {
     if (typeof string !== 'string')
         throw new Error('Lib - add_to_hello_string - None string input was given');
     
    return `${lib.return_hello_string()} ${string}`;
 }

 module.exports = lib;