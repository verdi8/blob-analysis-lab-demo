// Voir https://webpack.js.org/guides/production/ pour la séparation des configurations
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    plugins: [
        new webpack.DefinePlugin({

        })
    ],
    output: {
        publicPath: '/', // Chemin dans le serveur de dev
    }
});