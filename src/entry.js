import * as React from "react";
import * as ReactDOM from "react-dom";
import Loadable from "react-loadable";

import App from "./app.js";

const element = document.getElementById("app");

if (window.onModulesLoaded) {
    // ssr
    const modules = [];

    ReactDOM.render(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <App />    
        </Loadable.Capture>, 
        element,
    );

    Loadable.preloadAll().then(() => {
        window.onModulesLoaded(modules);
    });
} else {
    // no-ssr
    ReactDOM.render(<App/>, element);
}
