'use strict';

// tells require to look into '/app'
// to avoid the '../../../../'
process.env.NODE_PATH = 'app';
require('module').Module._initPaths();

// es6 transpiler
require('babel/register');

// start
require('./express.js');