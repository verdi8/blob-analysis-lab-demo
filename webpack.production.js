// Voir https://webpack.js.org/guides/production/ pour la séparation des configurations
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({

        })
    ],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    performance: {
        maxAssetSize: 3000000, // ~3Mo
        maxEntrypointSize: 3000000, // ~3Mo
        hints: 'error',
    }
});
