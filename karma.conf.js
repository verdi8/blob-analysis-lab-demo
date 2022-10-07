// Karma configuration
let webpackConfig = require('./webpack.staging.js');
webpackConfig.entry = {};

console.info(webpackConfig)

module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'webpack'],
        files: [
            { pattern: "tests/**/*.+(ts|tsx)", watched : false },
        ],
        exclude: [
        ],
        preprocessors: {
            "tests/**/*.+(ts|tsx)": ["webpack"],
        },
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-spec-reporter'),
            require('karma-jasmine-html-reporter'),
            require('karma-webpack'),
        ],
        webpack : webpackConfig,

        reporters: ['spec','kjhtml'],
        port: 9876,
        colors: true,

        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        client: {
            clearContext: false
        },

        singleRun: false,
        concurrency: Infinity,
    })
}