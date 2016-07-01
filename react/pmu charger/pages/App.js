import React, {Component} from 'react';
import {NavBar} from '../components';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions'


export default class App extends Component {
    constructor(props) {
        super(props);
        // this.store = this.props.store;
    }


    componentWillMount() {
        //debugger;
   //     this.props.history.push('/dashboard');
        //console.log('component mounted');
        //this.setState
        //store.dispatch(fetchUsers(this.props.store));
    }

    render() {
        // const state = this.store.getState();

        return (
            <div className="root">
            <NavBar />

                <div className="route-wr">
                    {this.props.children}
                </div>

            </div>
        );
    }
}

//
// function mapState(state) {
//     return state;
//
// }
//
// function mapDispatch(dispatch) {
//     return {
//         actions: bindActionCreators(actions, dispatch)
//     };
// }
//
//
// export default connect(mapState, mapDispatch)(App);