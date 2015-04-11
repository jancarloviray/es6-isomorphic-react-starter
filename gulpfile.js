'use strict';

var gulp = require('gulp');
var del = require('del');
var gutil = require('gulp-util');
var size = require('gulp-size');
var browserSync = require('browser-sync');
var supervisor = require('gulp-supervisor');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var concatCss = require('gulp-concat-css');
var proxy = require('proxy-middleware');
var combiner = require('stream-combiner2');
var eslint = require('gulp-eslint');
var objectAssign = require('react/lib/Object.assign');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
// var imagemin = require('gulp-imagemin');
// var pngquant = require('imagemin-pngquant');

var CODE_FILES = [
  'app/**/*.jsx',
  'app/**/*.js',
  'shared/**/*.js',
  'server/**/*.jsx',
  'server/**/*.js',
];

// SHARED TASKS

gulp.task('clean:img', function () {
  return del([__dirname + '/dist/img/**/*']);
});

gulp.task('clean:css', function () {
  return del([__dirname + '/dist/css/**/*']);
});

gulp.task('clean:js', function () {
  return del([__dirname + '/dist/js/**/*']);
});

gulp.task('lint:code', function(){
  return gulp.src(CODE_FILES)
    .pipe(eslint({
      useEslintrc: true
    }))
    .pipe(eslint.format());
})

// DEVELOPMENT TASKS

// Proxy `/assets/javascript/` requests to
// served files from `webpack-dev-server`
var webpackProxy = function () {
  var url = require('url');
  var options = url.parse('http://localhost:8090/assets/js');
  options.route = '/assets/js/';
  return proxy(options);
};

// Proxy `/` to the `express` server started
var expressProxy = function () {
  var url = require('url');
  var options = url.parse('http://localhost:3000');
  options.route = '/';
  return proxy(options);
};

gulp.task('connect', function () {
  browserSync({
    port: 8080,
    server: {
      baseDir: __dirname,
      middleware: [
        webpackProxy(),
        expressProxy()
      ]
    },
  });
});

gulp.task('webpack-dev-server', ['clean:js'], function () {
  var config = objectAssign({}, webpackConfig);
  config.devtool = 'source-map';
  config.debug = true;
  config.entry = [
    'webpack-dev-server/client?http://localhost:8090',
    'webpack/hot/only-dev-server',
    __dirname + '/app/index.js'
  ];
  config.module.loaders = [{
    test: /\.js/,
    loaders: ['react-hot', 'babel-loader'],
    exclude: /node_modules/
  }];
  config.plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ];

  new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    color: true,
    stats: {
      assets: true,
      colors: true,
      version: false,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false
    },
    watchDelay: 50,
    historyApiFallback: true
  }).listen(8090, 'localhost', function (err) {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'started on port 8090');
  });
});

gulp.task('supervisor', function () {
  supervisor(__dirname + '/server/index.js', {
    watch: ['server'],
    extensions: ['jsx', 'js']
  });
});

// gulp.task('images', ['clean:img'] function () {
//   var combined = combiner.obj([
//     gulp.src(__dirname + '/app/images/**/*'),
//     imagemin({
//       optimizationLevel: 3,
//       progressive: true,
//       interlaced: true,
//       svgoPlugins: [{removeViewBox: false}],
//       use: [pngquant()]
//     }),
//     gulp.dest(__dirname + '/dist/img'),
//     size()
//   ]);
//   combined.on('error', console.log.bind(console));
//   return combined;
// });

gulp.task('less', function () {
  var combined = combiner.obj([
    gulp.src(__dirname + '/app/styles/**/*.less'),
    less(),
    gulp.dest(__dirname + '/.tmp/css')
  ]);
  combined.on('error', console.log.bind(console));
  return combined;
});

gulp.task('styles', ['less','clean:css'], function () {
  var combined = combiner.obj([
    gulp.src(__dirname + '/.tmp/css/**/*.css'),
    concatCss('styles.css'),
    gulp.dest(__dirname + '/dist/css'),
    browserSync.reload({stream: true})
  ]);
  combined.on('error', console.log.bind(console));
  return combined;
});

gulp.task('dev', [
  'lint:code',
  // 'images',
  'styles',
  'supervisor',
  'webpack-dev-server',
  'connect'
], function () {
  // gulp.watch(__dirname + '/app/images/**/*', ['images']);
  gulp.watch(CODE_FILES, ['lint:code']);
  gulp.watch(__dirname + '/app/styles/**/*', ['styles']);
});

// BUILD TASKS

gulp.task('webpack:build', ['clean:js'], function (callback) {
  var config = objectAssign({}, webpackConfig);
  config.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
      },
      output: {
        comments: false
      },
      sourceMap: false
    })
  ];

  webpack(config, function (err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    return callback();
  });
});

gulp.task('build:styles', ['styles'], function () {
  return gulp.src(__dirname + '/dist/css/styles.css')
    .pipe(minifyCSS())
    .pipe(gulp.dest(__dirname + '/dist/css/'));
});

gulp.task('build', [
  'lint:code',
  'build:styles',
  /*'images',*/
  'webpack:build'
]);
