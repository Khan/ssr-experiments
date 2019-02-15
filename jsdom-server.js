const express = require("express");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {getBundles} = require('react-loadable/webpack');
const stats = require("./dist/react-loadable.json");

const app = express();

app.get('/', (req, res) => {
    const dom = new JSDOM(`
    <!doctype html>
    <html lang="en">
        <body>
            <div id="app"></div>
            <script src="/dist/vendors~entry.bundle.js"></script>
            <script src="/dist/entry.bundle.js"></script>
        </body>
    </html>
    `, {
        url: "http://localhost:3000/",
        runScripts: "dangerously",
        resources: "usable",
        beforeParse: (window) => {
            window.onModulesLoaded = (modules) => {
                const bundles = getBundles(stats, modules)
                    .filter(bundle => !bundle.file.endsWith(".map"));

                res.send(`
                <!doctype html>
                <html lang="en">
                    <body>
                        <div id="app"></div>
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

                // The following also works, but the aysnc bundles end up loaded
                // in <head> instead of in the the <body> where the entry point 
                // bundles are.
                // res.send(dom.serialize());
            };
        },
    });
});

app.use("/dist", express.static("dist"));

app.listen(3000, () => {
    console.log('Running on http://localhost:3000/');
});
