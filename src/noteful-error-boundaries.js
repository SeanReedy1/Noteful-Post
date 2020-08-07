import React, {Component} from 'react';


export default class NotefulErrorBoundaries extends Component {
    constructor (props) {
        super(props);
        this.state = {
            hasError:false
        }
    }


static getDerivedStateFromError(error) {
    return {hasError:true};
}

render() {
    if (this.state.hasError) {
        return(
            <div>
                <p>Error: Can not display page at this time</p>
            </div>
        )
    }
    return this.props.children;
}
}