import * as React from "react";

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
            Click count: {this.state.count}
        </div>
    }
}

export default Foo;
