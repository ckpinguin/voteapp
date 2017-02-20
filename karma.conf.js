const path = require('path');
const webpack = require('webpack');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const poststylus = require('poststylus');
const PATHS = {
    src: path.resolve(__dirname, '../src'),
    dist: path.resolve(__dirname, '../dist'),
    publicPathDev: '/',
    publicPathProd: './'
};
function configureWebpack(webpackConfigFunction) {
    var webpackConfig = require('./webpack/webpack.config.dev.js');
    webpackConfig.entry = undefined; // karma will pass the proper argument for entry
    return webpackConfig;
}

const BASE_DIR = './';
console.log('=======================================================');
console.log(path.join(__dirname, 'node_modules'));
console.log('================================================================');
module.exports = function(config) {
    config.set({
        basePath: '',
        files: [
          //  'test/**/*.spec.js',
            `${BASE_DIR}/test/integration/test_index.js`,
            //{pattern: 'test/**/*.spec.js', watched: false}
        ],
        exclude: [],
        browsers:   ['Chrome', 'PhantomJS'],
        //    https://github.com/ariya/phantomjs/issues/10522
        frameworks: [ 'browserify', 'mocha'],
        reporters:  ['mocha'],
        preprocessors: {
            // First step one out to get into _karma_webpack directory
            // http://stackoverflow.com/questions/36375758/unit-test-with-karma-and-webpack-karma-webpack-no-such-file-or-directory
            '../test/**/*.spec.js': ['babel', 'webpack', 'sourcemap', 'browserify']
          //[`${BASE_DIR}/test/integration/test_index.js`]: ['webpack', 'sourcemap'],
          //[`${BASE_DIR}/test/integration/test_index.js`]: ['babel']
        },
        browserify: {
            debug: true,
            transform: [ 'brfs' ]
        },
        port: 9876,
        colors: true,
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,
        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,
        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: 4,
        webpack: configureWebpack(),
        webpackServer: {
            noInfo: true
        }
    });
};
