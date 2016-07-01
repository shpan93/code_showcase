import React, {Component} from 'react';
import {Link} from 'react-router'

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions'


class NavBar extends Component {
    constructor(props) {
        super(props);
      //  this.store = this.props;
    }


    componentWillMount() {
        //debugger;
        // this.props.history.push('/dashboard');
        //console.log('component mounted');
        //this.setState
        //store.dispatch(fetchUsers(this.props.store));
    }
// shouldComponentUpdate(){
//     console.log('updating')
//     console.log(this.props.username);
//     return true;
// }
    logout(e) {
        e.preventDefault();
        this.props.actions.logoutUser();
    }

    render() {
        // const state = this.store.getState();



        return (
            <header>


                <nav className="top-nav">
                    {  this.props.user.username ? (
                    <div className="left">

                        <Link to='/' onlyActiveOnIndex={true} activeClassName='active'>Панель управления</Link>

                        <Link to='/history' activeClassName='active'>Архив пополнений</Link>



                    </div>
                    ) : (<div className="left"></div>)}
                    <div className="right">
                        <a href="/admin">
                            Administration
                        </a>
                        {  this.props.user.username && (
                        <p>
                            Здравствуйте, <span> {this.props.user.username}</span>!
                        </p>
                        )}


                        {!this.props.user.sessionUid
                            ? (
                            <Link to='/login' activeClassName='active'>Вход</Link>

                        )
                            :
                            ( <a href="#" onClick={this.logout.bind(this)}>
                                Выход
                            </a>)
                        }
                    </div>
                </nav>

            </header>
        );
    }
}


function mapState(state) {
    return state;

}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}


export default connect(mapState, mapDispatch)(NavBar);