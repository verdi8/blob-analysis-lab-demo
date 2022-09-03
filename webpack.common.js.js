const path = require('path');
const webpackCommonJs = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                // exclude: /node_modules/
            },
            {
                test: /\.svg$/,
                use: 'svg-inline-loader?classPrefix=true'
            }
        ]
    },
    resolve: {
        extensions: ['.css', '.js', '.ts']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Blob Analysis Lab Demo',
            template: 'index.html',
            scriptLoading: 'blocking',
        }),
        new webpackCommonJs.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version),
        })
    ],
    output: {
        filename: 'blob-analysis-lab-demo.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    target: ['web', 'es5']
};
