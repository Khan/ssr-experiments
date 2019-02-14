const path = require("path");
const { ReactLoadablePlugin } = require("react-loadable/webpack");

module.exports = {
    mode: "development",
    entry: {
        entry: "./src/entry.js",
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
            }
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
    ],
    devtool: "source-map",
};
