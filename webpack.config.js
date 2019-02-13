const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/entry.js",
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
};
