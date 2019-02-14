const path = require("path");
const { ReactLoadablePlugin } = require("react-loadable/webpack");

module.exports = {
    mode: "development",
    entry: {
        entryA: "./src/entryA.js",
        // We create some extra entry points so that files are shared 
        // between multiple chunks.  This facilitates async modules 
        // ending up in different bundles.
        entryB: "./src/entryB.js",
        entryC: "./src/entryC.js",
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
};
