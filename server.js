require("@babel/register");
const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const Loadable = require("react-loadable");

const App = require("./src/app.js").default;

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <!doctype html>
        <html lang="en">
            <body>
                <div id="app">${ReactDOMServer.renderToString(React.createElement(App, {}))}</div>
                <script src="/dist/main.bundle.js"></script>
            </body>
        </html>
    `);
});

app.use("/dist", express.static("dist"));
  
Loadable.preloadAll().then(() => {
    app.listen(3000, () => {
       console.log('Running on http://localhost:3000/');
    });
});
// app.listen(3000, () => {
//     console.log('Running on http://localhost:3000/');
// });
