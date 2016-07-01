import React from 'react';
import ReactDOM from 'react-dom';
import { hashHistory } from 'react-router';
import {Provider} from 'react-redux';
import { Router } from 'react-router';
import Cookies from 'js-cookie';

import {loginUserSuccess} from './actions'


import routes from './routes';
import configureStore from './store/configureStore';
//import {loginUserSuccess} from './actions';
const { store, history } = configureStore(hashHistory);
//const history = syncHistoryWithStore(baseHistory, store)

let sessionUid = Cookies.get('sessionUid');
let chargeAmounts = Cookies.get('chargeAmounts');
let username = Cookies.get('username');

if (sessionUid && chargeAmounts ) {
    store.dispatch(loginUserSuccess(sessionUid,JSON.parse(chargeAmounts),username));
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            {routes}
        </Router>
    </Provider>
    ,
   document.getElementById('application-root'));


