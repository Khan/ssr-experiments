const express = require("express");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {getBundles} = require('react-loadable/webpack');
const stats = require("./dist/react-loadable.json");

const app = express();

const template = (paths) => `
<!doctype html>
<html lang="en">
    <body>
        <div id="app"></div>
        ${paths.map(path => `<script src="/dist/${path}"></script>`).join("\n")}
    </body>
</html>
`;

app.get('/', (req, res) => {
    const start = Date.now();
    const entries = ["vendors~entry.bundle.js", "entry.bundle.js"];

    const dom = new JSDOM(
        template(entries),
        {
            url: "http://localhost:3000/",
            runScripts: "dangerously",
            resources: "usable",
            beforeParse: (window) => {
                window.onModulesLoaded = () => {
                    res.send(dom.serialize());
                };
            },
        },
    );
    console.log(`request took ${Date.now() - start}ms`);
});

app.use("/dist", express.static("dist"));

app.listen(3000, () => {
    console.log('Running on http://localhost:3000/');
});
