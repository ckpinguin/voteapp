require('babel-polyfill');
require('babel-register'); 

var testsContext = require.context('.', true, /.spec\.js$/);
testsContext.keys().forEach(testsContext);
