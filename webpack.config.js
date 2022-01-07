const webpack = require("webpack");
const path = require("path");

let config = {
    // mode: 'development',
    mode: 'production',
    entry: {
        bundle: [
            'core-js',
            './src/index.js',
        ]
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './public'),
        filename: '[name].js',
        library: '[name]',
    },
    devServer: {
        devMiddleware: {
            publicPath:  path.resolve(__dirname, './public'),
        },
        static: path.resolve(__dirname, './public'),
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
        },
        // historyApiFallback: true,
        // inline: true,
        // open: true,
        // hot: true
    },
    devtool: "eval-source-map"
}

module.exports = config;