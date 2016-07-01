import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as actions from '../actions'


class Auth extends Component {
    constructor(props) {
        super(props);
        // this.store = this.props.store;
        //this.state = {
        //    username: '',
        //    password: ''
        //}
    }

    // getInitialState() {
    //     return{
    //         username: '',
    //         password: ''
    //     }
    // }

    //handleUsernameChange(e) {
    //    this.setState({username: e.target.value});
    //}

    //handlePasswordChange(e) {
    //    this.setState({password: e.target.value});
    //}

    onSubmit(e) {
        e.preventDefault();

        let username = this.refs.authLogin.value;
        let password = this.refs.authPassword.value;
        if (!username || !password) {
            var errorDescription = '';

            if(!username) errorDescription = ('Введите имя');
            if(!password) errorDescription = ('Введите пароль');
            if(!password && !username ) errorDescription = ('Введите имя и пароль');
            this.props.actions.loginUserFailure(errorDescription);
            return false;
        }

        this.props.actions.loginUser(username, password);
        //
        // function success(response){
        //   if(!response.errorDescription){
        //
        //   }else{
        //
        //   }
        //   console.log(response)
        // }
        //
        // auth.logon(this.refs.username, this.refs.password, success)
    }

    componentWillMount() {
        console.log('component mounted');
        //this.setState
        //store.dispatch(fetchUsers(this.props.store));
    }

    render() {
        // const state = this.store.getState();

        return (
            <div className={`login-form ${this.props.isAuthenticating ? 'loading' : ''}`}>

                <h3>Авторизуйтесь</h3>
                <fieldset>
                    <form onSubmit={this.onSubmit.bind(this)} className={this.props.errorDescription ? 'error' : ''}>

                        <p className="error-description">{this.props.errorDescription}</p>

                        <div className='input-row'>
                            <input type="text" ref="authLogin"  placeholder="Логин"/>

                        </div>
                        <div className="input-row">

                            <input type="password" ref="authPassword"  placeholder="Пароль"/>
                        </div>

                        <div className='btn-holder--fw'>
                            <button className="btn" type="submit">
                                Войти
                            </button>
                        </div>
                    </form>
                </fieldset>
            </div>
        );
    }
}


function mapState(state) {
    return state.user;

}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}


export default connect(mapState, mapDispatch)(Auth);