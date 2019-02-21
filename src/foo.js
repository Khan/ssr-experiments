import * as React from "react";
import Loadable from "react-loadable";

const LoadableBar = Loadable.Map({
    loader: {
        Bar: () => import("./bar.js"),
        StylesPromise: () => import("./styles.less"),
    },
    loading: () => <div>Loading...</div>,
    render(loaded, props) {
        const Bar = loaded.Bar.default;
        return <Bar {...props} />;
    }
});

class Foo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        };
    }

    render () {
        return <div>
            <button
                className="foo"
                onClick={() => this.setState({count: this.state.count + 1})}
            >
                Click me!
            </button>
            <LoadableBar count={this.state.count} />
        </div>
    }
}

export default Foo;
