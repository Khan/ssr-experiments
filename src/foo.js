import * as React from "react";
import Loadable from "react-loadable";

const LoadableBar = Loadable({
    loader: () => import("./bar.js"),
    loading: () => <div>Loading...</div>,
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
                onClick={() => this.setState({count: this.state.count + 1})}
            >
                Click me!
            </button>
            <LoadableBar count={this.state.count} />
        </div>
    }
}

export default Foo;
