const webpack = require("webpack");
const path = require("path");
const ignored = [
    path.resolve(__dirname, './dist/'),
    path.resolve(__dirname, './node_modules/'),
    path.resolve(__dirname, './itowns_build/'),
    path.resolve(__dirname, './Cloud/')
];

let config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "./alex.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        historyApiFallback: true,
        inline: true,
        open: true,
        hot: true,
        watchOptions: {
            ignored,
        }
    },
    devtool: "eval-source-map"
}

module.exports = config;