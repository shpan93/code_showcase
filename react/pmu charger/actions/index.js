import * as types from '../constants/ActionTypes';
import {push} from 'react-router-redux';
import Cookies from 'js-cookie';

//import $ from 'jquery';
export function addFilter(filter) {
    return {
        type: types.ADD_FILTER,
        filter
    };
}
export function closePopup() {
    return {
        type: types.CLOSE_POPUP,
    };
}
export function searchText(text) {
    return {
        type: types.SEARCH_TEXT,
        text
    };
}
export function removeChargeRow(id) {
    return {
        type: types.REMOVE_CHARGE_ROW,
        id,

    };
}

function receiveChargesData(data) {
    // console.log(data);
    return {
        type: types.RECEIVE_CHARGES_DATA,
        data
    };
}
export function receiveNewChargeList(charges, errors) {
    // console.log(data);
    return {
        type: types.RECEIVE_NEWCHARGE_LIST,
        charges,
        errors
    };
}
function receiveHistoryData(data) {
    // console.log(data);
    return {
        type: types.RECEIVE_HISTORY_DATA,
        data
    };
}
export function setCookies(sessionUid, chargeAmounts, login) {
    Cookies.set('sessionUid', sessionUid, {expires: 1});
    Cookies.set('username', login, {expires: 1});
    Cookies.set('chargeAmounts', JSON.stringify(chargeAmounts), {expires: 1});
}


export function loginUserSuccess(sessionUid, chargeAmounts,username) {

        return {
            type: types.LOGIN_USER_SUCCESS,
            sessionUid,
            chargeAmounts,
            username
        }


}
export function loginUserFailure(error) {
    return {
        type: types.LOGIN_USER_FAILURE,
        error
    }
}
export function fetchDataRequest() {
    return {
        type: types.FETCH_DATA_REQUEST
    }
}
export function loginUserRequest() {
    return {
        type: types.LOGIN_USER_REQUEST
    }
}
export function chargeRequest() {
    return {
        type: types.CHARGE_REQUEST
    }
}
export function chargeSuccess(id, status) {
    return {
        type: types.CHARGE_SUCCESS,
        id,
        status
    }
}
export function logoutUser() {
    //  dispatch => {
    //     dispatch(setCookies('', '', ''));
    //
    // }
    setCookies('', '', '');
    return {
        type: types.LOGIN_USER_LOGOUT,
    }
}
export function loginUser(login, password, redirect = "/") {
    return dispatch => {
        dispatch(loginUserRequest());
        return fetch('/api/auth/logon', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: login, password: password})
        })
        // .then(checkHttpStatus)
            .then(response => response.json())
            .then(response => {
                try {

                    if (response.errorDescription)  throw new Error(response.errorDescription);
                    dispatch(loginUserSuccess(response.sessionUid, response.chargeAmounts, login));
                    //dispatch(initCharger(response.sessionUid,response.chargeAmounts ))
                    dispatch(push(redirect));
                    dispatch(setCookies(response.sessionUid, response.chargeAmounts, login));
                } catch (e) {
                    dispatch(loginUserFailure(response.errorDescription));
                }

            })
            .catch(error => {
                dispatch(loginUserFailure(error));
            })
    }
}
    
    function UrlParams() {
        this.a = new Array()
        //return new Array()
    }

    UrlParams.prototype = Array.prototype;
    UrlParams.prototype.append = function(key,value){
        var _self = this.a;
        _self.push({ key, value })
    }
    UrlParams.prototype.toString = function(amp){
        var _self=this.a||this;
        if(_self.length>0){
            var next = _self.slice(0,_self.length-1);
            var current = _self[_self.length-1];
            return (amp?"&":"")+current.key+'='+current.value+next.toString(true);
        }else{
            return"";
        }
        // var result="";
        // this.forEach(key=>{
        //     var amp="&";
        //     if(result){
        //        amp="";
        //     }
        //     result+=amp+key+'='+this[key];
        // });
        // return result;
    }
export function getChargesData(sessionUid, onlyMy = true, searchPhone = '') {
    return (dispatch) => {
        dispatch(fetchDataRequest());
        let url = "/api/charge/history",
            params = {
                searchPhone: searchPhone,
                onlyMy: onlyMy,
                sessionUid: sessionUid
            };

        var searchParams = new UrlParams();
        Object.keys(params).forEach(key => {
            searchParams.append(key, params[key])
        })
        return fetch(`${url}?${searchParams.toString()}`)
            .then(response=>response.json())
            .then(response => {

                dispatch(receiveChargesData(response.transactions))
            })
            .catch(error => {
                console.log(error)
            })
    }
}
export function old_getChargesData(sessionUid, onlyMy = true, searchPhone = null) {

    return (dispatch) => {
        dispatch(fetchDataRequest());
        $.get('/api/charge/history', {
            searchPhone: searchPhone,
            onlyMy: onlyMy,
            sessionUid: sessionUid
        }, resp => {
            if (!resp.errorDescription) {
                dispatch(receiveChargesData(resp.transactions));

            } else {

                console.log(resp.errorDescription)
            }
        });
    }
}
export function getHistoryData(sessionUid, onlyMy = false, searchPhone = null) {

    return (dispatch) => {
        dispatch(fetchDataRequest());
        $.get('/api/charge/history', {
            searchPhone: searchPhone,
            onlyMy: onlyMy,
            sessionUid: sessionUid
        }, resp => {
            if (!resp.errorDescription) {
                dispatch(receiveHistoryData(resp.transactions));

            } else {

                console.log(resp.errorDescription)
            }
        });
    }
}
export function chargePhone(sessionUid, chargesList) {

//     var n = 0;
// while (n < chargesList.length){
//     n++;
//     let requestBody = {
//
//     }
// }

    // phone: phone,
    //     amount: amount,
    //     sessionUid: sessionUid
    function f(id, dispatch, body, then) {

        return function () {
            return fetch('/api/charge/create', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            // .then(checkHttpStatus)
                .then(response => response.json())
                .then(response => {

                    var status;
console.log(id, Date.now())
                    if (response.errorDescription) {
                        //status = response.errorDescription;
                        status = {
                            text: response.errorDescription,
                            className: 'error'
                        }
                    }
                    else {
                        status = {
                            text: 'Отправлено в обработку',
                            className: 'success'
                        }
                    }
                    dispatch(chargeSuccess(id, status));
                    console.log('success', body);
                })
                .then(response => {
                    then();
                })
        }


        //.then()
    }


    return (dispatch) => {
        var result = () => {
            console.log('start');
            //    new Promise()
        };
        //dispatch(fetchDataRequest());

        chargesList.reverse();
        chargesList.map((item, i) => {
            let body = {
                phone: item.phone,
                amount: item.amount,
                sessionUid: sessionUid
            };

            result = f(item.id, dispatch, body, result);

        });
        dispatch(chargeRequest());
        return result();

    }
}
//  .then(response => response.json())
//  .then(json => dispatch(receiveChargesData(json))
// .catch(ex =>  console.log( ex ))