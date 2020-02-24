const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let config = {
    plugins: [
        new BundleAnalyzerPlugin(),
    ],
    entry: {
        bundle_A: "./src/index_A.js",
        bundle_B: "./src/index_B.js"
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        historyApiFallback: true,
        inline: true,
        open: true,
        hot: true
    },
    devtool: "eval-source-map",
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                  test: /[\\/]node_modules[\\/]/,
                  name: 'bundle_A',
                  chunks: 'all',
                }
            }
        }
    }
}

module.exports = config;