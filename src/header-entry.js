import * as React from "react";
import * as ReactDOM from "react-dom";
import Loadable from "react-loadable";

import Header from "./header.js";

const element = document.getElementById("header");

if (window.onModulesLoaded) {
    // server ssr
    const modules = [];

    ReactDOM.render(
        <Loadable.Capture report={moduleName => modules.push(moduleName)}>
            <Header />    
        </Loadable.Capture>, 
        element,
    );

    Loadable.preloadAll().then(() => {
        window.onModulesLoaded(modules);
    });
} else if (window.hydrate) {
    // non-jsdom ssr require rehydration
    Loadable.preloadReady().then(() => {
        ReactDOM.hydrate(<Header/>, element);
    });
} else {
    // no-ssr
    ReactDOM.render(<Header/>, element);
}
