const webpack = require("webpack");
const path = require("path");
const ignored = [
    path.resolve(__dirname, './dist/'),
    path.resolve(__dirname, './node_modules/'),
    path.resolve(__dirname, './itowns_build/'),
    path.resolve(__dirname, './Cloud/')
];

let config = {
    entry: "./src/view3d.js",
    output: {
        path: path.resolve(__dirname, "./public"),
        filename: "./alex.js"
    },
    devServer: {
        contentBase: path.resolve(__dirname, "./public"),
        historyApiFallback: true,
        inline: true,
        // open: true,
        hot: true,
        watchOptions: {
            ignored,
        }
    },
    module: {
        rules: [
           {
                test: require.resolve('./itowns_build/BinaryHeap.js'),
                loader: 'exports-loader',
                options: {
                    exports: 'default BinaryHeap',
                },
           },
        ],
    },
    devtool: "eval-source-map",
    plugins: [
        new webpack.ProvidePlugin({
            THREE: 'three',
            proj4: ['proj4', 'default'],
            jQuery: 'jquery'
        }),
   ],
}

module.exports = config;