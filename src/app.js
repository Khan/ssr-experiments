import * as React from "react";
import Loadable from "react-loadable";

const LoadableFoo = Loadable.Map({
    loader: {
        Foo: () => import("./foo.js"),
        StylesPromise: () => import("./styles.less"),
    },
    loading: () => <div>Loading...</div>,
    render(loaded, props) {
        const Foo = loaded.Foo.default;
        return <Foo {...props} />;
    }
});

const App = () => {
    return <div>
        <h1>Hello, world!</h1>
        <p>This is my awesome app</p>
        <LoadableFoo/>
    </div>;
};

export default App;
