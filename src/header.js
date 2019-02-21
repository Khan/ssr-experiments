import * as React from "react";

class Header extends React.Component {
    render() {
        const style = {
            height: 60, 
            background: 'lightblue', 
            fontSize: 48, 
            textAlign: 'center',
        };
        return <div style={style}>
            SSR-Experiments
        </div>
    }
}

export default Header;
