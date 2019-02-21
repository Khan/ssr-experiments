require("@babel/register")({
    presets: [
        "@babel/preset-react", 
        "@babel/preset-env",
    ],
    plugins: [
        "@babel/plugin-syntax-dynamic-import", 
        "dynamic-import-node",
        "react-loadable/babel"
    ]
});
const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Loadable = require("react-loadable");
const {getBundles} = require('react-loadable/webpack');
const stats = require("./dist/react-loadable.json");

const App = require("./src/app.js").default;

const app = express();

require.extensions[".less"] = (mod, filename) => {};

app.get('/', (req, res) => {
    const start = Date.now();
    const modules = [];

    const html = ReactDOMServer.renderToString(
        React.createElement(
            Loadable.Capture,
            {report: moduleName => modules.push(moduleName)},
            React.createElement(App, {}, []),
        ),
    );

    const bundles = getBundles(stats, modules)
        .filter(bundle => !bundle.file.endsWith(".map"));

    res.send(`
        <!doctype html>
        <html lang="en">
            <body>
                <div id="app">${html}</div>
                <script>window.hydrate = true;</script>
                ${bundles.map(bundle => {
                    return `<script src="/dist/${bundle.file}"></script>`
                    // alternatively if you are using publicPath option in webpack config
                    // you can use the publicPath value from bundle, e.g:
                    // return `<script src="${bundle.publicPath}"></script>`
                }).join('\n')}
                <script src="/dist/vendors~entry.bundle.js"></script>
                <script src="/dist/entry.bundle.js"></script>
            </body>
        </html>
    `);
    console.log(`request took ${Date.now() - start}ms`);
});

app.use("/dist", express.static("dist"));
  
Loadable.preloadAll().then(() => {
    app.listen(3000, () => {
       console.log('Running on http://localhost:3000/');
    });
});
