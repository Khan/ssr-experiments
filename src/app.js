import * as React from "react";
import Loadable from "react-loadable";

const LoadableFoo = Loadable({
    loader: () => import("./foo.js"),
    loading: () => <div>Loading...</div>,
});

const MyApp = () => {
    return <div>
        <h1>Hello, world!</h1>
        <p>This is my awesome app</p>
        <LoadableFoo/>
    </div>;
};

export default MyApp;
