import * as types from '../constants/ActionTypes';
import {INITIAL_STATE} from '../constants/InitialState';

export default function UserReducer(state = INITIAL_STATE, action) {
    switch (action.type) {


        // case (types.USER_LOGGED_IN):
        // {
        //     return {
        //         ...state,
        //       //  sessionID
        //     }
        // }
        // case(types.USER_LOGGED_OUT):
        // {
        //     return {}
        // }
        case(types.LOGIN_USER_SUCCESS):
        {

            return {
                ...state,
                sessionUid:action.sessionUid,
                chargeAmounts:action.chargeAmounts,
                username:action.username,
                errorDescription:null,
                isAuthenticating: false
            }
            
        }
        case(types.LOGIN_USER_LOGOUT):
        {

            return {
                ...state,
                sessionUid:null,
                chargeAmounts:null,
                username:null,
                errorDescription:null,
                isAuthenticating: false
            }

        }
        case(types.LOGIN_USER_FAILURE):
        {

            return {
                ...state,
                errorDescription:action.error,
                isAuthenticating: false
            }
            
        }
        case types.LOGIN_USER_REQUEST:
            return {
                ...state,
                isAuthenticating: true
            }
        default:
            return state
    }
}
