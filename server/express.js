'use strict';

// Tell `require` calls to look into `/app` also
// it will avoid `../../../../../` require strings
process.env.NODE_PATH = 'app';
require('module').Module._initPaths();

// Install `babel` hook
require('babel/register');

import path from 'path';
import express from 'express';
import exphbs from 'express-handlebars';
import request from 'superagent';

import router from './router';

const app = express();

app.engine('handlebars', exphbs({
  layoutsDir: path.join(__dirname, '/views/layouts'),
  defaultLayout: 'index'
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use('/assets/img', express.static(path.resolve(path.join(__dirname, '/../dist/img/'))));
app.use('/assets/js', express.static(path.resolve(path.join(__dirname, '/../dist/js'))));
app.use('/assets/css', express.static(path.resolve(path.join(__dirname, '/../dist/css'))));

app.use(router);
app.listen(3000);

console.log('Application started on port 3000');
