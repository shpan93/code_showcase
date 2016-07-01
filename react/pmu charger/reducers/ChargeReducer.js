import * as types from '../constants/ActionTypes';
import {INITIAL_STATE} from '../constants/InitialState';

export default function ChargeReducer(state = INITIAL_STATE, action) {
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
        case(types.RECEIVE_NEWCHARGE_LIST):
        {
            //var filteredData = action.data

            var chargeList = action.charges.map(function (item) {
                item.status = {
                    text: 'Ожидание подтверждения',
                    className : 'pending'
            }
            });
            return {
                ...state,
                chargeList: action.charges,
                errorsParsing: action.errors,
                isFetching: false,
                isOpened: true
            }

        }
        case(types.CLOSE_POPUP):
        {

            return {
                ...state,
                isOpened: false,
                isProcessing: false

            }

        }
        case(types.CHARGE_REQUEST):
        {

            return {
                ...state,
                errorsParsing: [],
                isProcessing: true
            }

        }
        case(types.CHARGE_SUCCESS):
        {
            var list = state.chargeList;
            list.map((item) => {
                if (item.id === action.id) {
                    item.status = action.status
                }
                ;
            })
            //state.chargeList
            return {
                ...state,
                chargeList: list,

                // errorsParsing:[],
                //isProcessing:true
            }

        }

        case(types.REMOVE_CHARGE_ROW):
        {
            const data = state.chargeList.filter(item => item.id !== action.id);
            //data.splice(data.indexOf(action.id),1)
            return {
                ...state,
                chargeList: data
                // isOpened:false
            }

        }

        default:
            return state
    }
}
