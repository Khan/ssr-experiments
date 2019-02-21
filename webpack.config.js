const path = require("path");
const { ReactLoadablePlugin } = require("react-loadable/webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: "development",
    entry: {
        "app-entry": "./src/app-entry.js",
        "header-entry": "./src/header-entry.js",
    },
    output: {
        publicPath: "dist/",
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.less$/,
                /**
                 * We want to disable url processing in the css-loader so that images
                 * are not processed. Images are handled as static assets outside of
                 * webpack.
                 */
                use: [
                    MiniCssExtractPlugin.loader,
                    // cacheLoader,
                    "css-loader?url=false",
                    "less-loader",
                ],
            },
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            maxAsyncRequests: Infinity,
            minSize: 0,
            minChunks: 1,
        },
    },
    plugins: [
        new ReactLoadablePlugin({
            filename: './dist/react-loadable.json',
        }),
        new MiniCssExtractPlugin({
            filename: "[name].bundle.css",
        }),
    ],
    devtool: "source-map",
};
