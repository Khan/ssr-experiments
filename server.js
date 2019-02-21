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
const Header = require("./src/header.js").default;

const components = {
    App,
    Header,
};

const app = express();

require.extensions[".less"] = (mod, filename) => {};

const renderEntry = (Component) => {
    const modules = [];

    const html = ReactDOMServer.renderToString(
        React.createElement(
            Loadable.Capture,
            {report: moduleName => modules.push(moduleName)},
            React.createElement(Component, {}, []),
        ),
    );

    return {
        html,
        modules,
    };
};

app.get('/', (req, res) => {
    const start = Date.now();

    /// TODO: props
    const appResults = renderEntry(App);
    const headerResults = renderEntry(Header);

    const modules = [...appResults.modules, ...headerResults.modules];

    const files = getBundles(stats, modules)
        .filter(bundle => !bundle.file.endsWith(".map"))
        .map(bundle => bundle.file);

    const jsFiles = files.filter(file => file.endsWith(".js"));
    const cssFiles = new Set(files.filter(file => file.endsWith(".css")));

    jsFiles.push("vendors~app-entry~header-entry.bundle.js");
    /// these can be in any order as long as they're at the end
    jsFiles.push("header-entry.bundle.js");
    jsFiles.push("app-entry.bundle.js");

    res.send(`
    <!doctype html>
    <html lang="en">
        <head>
            ${[...cssFiles].map(file => `<link rel="stylesheet" href="/dist/${file}"/>`).join('\n')}
        </head>
        <body>
            <div id="header">${headerResults.html}</div>
            <div id="app">${appResults.html}</div>
            ${jsFiles.map(file => `<script src="/dist/${file}"></script>`).join('\n')}
        </body>
    </html>`);

    console.log(`request took ${Date.now() - start}ms`);
});

app.use("/dist", express.static("dist"));
  
Loadable.preloadAll().then(() => {
    app.listen(3000, () => {
       console.log('Running on http://localhost:3000/');
    });
});
