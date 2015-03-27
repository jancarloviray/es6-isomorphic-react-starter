# ES6 Isomorphic React Starter

> Fully isomorphic **[react](https://facebook.github.io/react/)** starter project. Includes **[react-router](https://github.com/rackt/react-router)** and **[expressjs](http://expressjs.com/)** and uses [webpack](http://webpack.github.io/) and [gulpjs](http://gulpjs.com/). ES6 transformed through [babeljs](https://babeljs.io/)

## Installation

Uses [io.js](https://iojs.org/) to take advantages of `ES2015` without `--harmony` flag.

First, install [nvm](https://github.com/creationix/nvm). Then run the following:

* `$ nvm install iojs`
* `$ nvm use iojs`
* `$ nvm alias default iojs` (to make `node` default to `iojs`)

After that, clone the repo and install dependancies:

* `$ npm install`
* `$ npm install -g gulp`

### Running in development mode:

* `$ gulp dev`

Open your browser to `http://localhost:8080`. Try to disable JavaScript in your browser, you will still be able to navigate between and see the content. In addition, script and style changes will be injected on the fly for automatic hot reloading.

### Building the project for production:

Running `$ gulp build` will produce the following tasks:

* Concat & minify styles to `/dist/css/styles.css`
* Concat & minify scripts to `/dist/js/app.js`
* Optimize & copy images to `/dist/img/`
