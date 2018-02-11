const colors = require('colors');
const CDBDriver = require('../app/main.js');

const args = process.argv.slice(2);

console.log('Invoking main test script...'.underline.bold.red);

console.log('Testing construction...'.bold.green);

// Config object, no auth
console.log('Creating new CDBDriver using config object without authentication:'.yellow);
var driver_object_noauth = new CDBDriver({
  host: 'http://localhost/',
  port: 5984
});
console.log(driver_object_noauth);
console.log('');

// Config object + auth
console.log('Creating new CDBDriver using config object with authentication:'.yellow);
var driver_object_auth = new CDBDriver({
  host: 'http://localhost/',
  port: 5984,
  user: 'testuser',
  pass: 'myn1c3p455'
});
console.log(driver_object_auth);
console.log('');

// Config string, no auth
console.log('Creating new CDBDriver using config string without authentication:'.yellow);
var driver_string_noauth = new CDBDriver(
  'http://localhost:5984/'
);
console.log(driver_string_noauth);
console.log('');

// Config string + auth
console.log('Creating new CDBDriver using config string with authentication:'.yellow);
var driver_string_auth = new CDBDriver(
  'http://testuser:myn1c3p455@localhost:5984/'
);
console.log(driver_string_auth);
console.log('');

console.log('Done testing.\n'.underline.bold.green);
