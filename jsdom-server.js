const express = require("express");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {getBundles} = require('react-loadable/webpack');
const stats = require("./dist/react-loadable.json");

const app = express();

const template = (paths, id) => `
<!doctype html>
<html lang="en">
    <body>
        <div id="${id}"></div>
        ${paths.map(path => `<script src="/dist/${path}"></script>`).join("\n")}
    </body>
</html>
`;

const renderEntry = (entries, id) => {
    return new Promise((resolve, reject) => {
        const dom = new JSDOM(
            template(entries, id),
            {
                url: "http://localhost:3000/",
                runScripts: "dangerously",
                resources: "usable",
                beforeParse: (window) => {
                    window.onModulesLoaded = () => {
                        const html = dom.window.document.querySelector(`#${id}`);
                        const scripts = dom.window.document.querySelectorAll("script");
                        const links = dom.window.document.querySelectorAll('link[rel="stylesheet"]')

                        resolve({
                            html: html.innerHTML,
                            scripts: Array.from(scripts).map(script => script.outerHTML),
                            links: Array.from(links).map(link => link.outerHTML),
                        });
                    };
                },
            },
        );
    })
}

app.get('/', (req, res) => {
    const start = Date.now();
    const headerEntries = ["vendors~app-entry~header-entry.bundle.js", "header-entry.bundle.js"];
    const appEntries = ["vendors~app-entry~header-entry.bundle.js", "app-entry.bundle.js"];    
    
    Promise.all([
        renderEntry(appEntries, "app"),
        renderEntry(headerEntries, "header")
    ]).then(values => {
        const [appResults, headerResults] = values;
        const scripts = [];
        const links = new Set();

        for (const results of values) {
            for (const script of results.scripts) {
                if (!scripts.includes(script)) {
                    scripts.push(script)
                }
            }
        }

        for (const results of values) {
            for (const link of results.links) {
                links.add(link);
            }
        }

        res.send(`
        <!doctype html>
        <html lang="en">
            <head>
                ${[...links].join('\n')}
            </head>
            <body>
                <div id="header">${headerResults.html}</div>
                <div id="app">${appResults.html}</div>
                ${scripts.join('\n')}
            </body>
        </html>`);  
    });
    
    console.log(`request took ${Date.now() - start}ms`);
});

app.use("/dist", express.static("dist"));

app.listen(3000, () => {
    console.log('Running on http://localhost:3000/');
});
