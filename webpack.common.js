const path = require('path');
const webpackCommonJs = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: 'svg-inline-loader?classPrefix=true'
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.css', '.js', '.ts', '.tsx']
    },
    plugins: [
        new webpackCommonJs.DefinePlugin({
            VERSION: JSON.stringify(require("./package.json").version),
        }),
        // Page principale
        new HtmlWebpackPlugin({
            title: 'Blob Analysis Lab',
            template: 'index.html',
            filename: 'index.html',
            scriptLoading: 'blocking',
            favicon: "favicon.ico"
        }),
        new CopyPlugin({
            patterns: [
                "docs/**/*.*"
            ]
        }),

    ],
    output: {
        filename: 'blob-analysis-lab-demo.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    target: ['web', 'es5']
};