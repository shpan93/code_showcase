import * as types from '../constants/ActionTypes';
import { INITIAL_STATE } from '../constants/InitialState';

export default function dataReducer(state = INITIAL_STATE, action) {

  switch (action.type) {

    case types.ADD_FILTER:
    //  const filterType = action.filter.type;
      // const filterFunc = (a, b) => {
      //   if(state.isDesc) {
      //     if(a.get(filterType) < b.get(filterType)) return -1;
      //     if(a.get(filterType) > b.get(filterType)) return 1;
      //   } else {
      //     if(a.get(filterType) > b.get(filterType)) return -1;
      //     if(a.get(filterType) < b.get(filterType)) return 1;
      //   }
      //   return 0;
      // };
      // const sortedData = state.filteredData.sort(filterFunc);
      const filterValue = action.value;
      const sortedData = state.historyData.filter( (row) => row.phonenumber.includes(filterValue) );
      return {
        ...state,
        filteredData: sortedData,
        // isDesc: !state.isDesc,
        // activeUser: sortedData.get(0)
      }

    case types.SEARCH_TEXT:
      const filter = x => x.phonenumber.includes(action.text);
      const filteredHistoryData = state.historyData.filter(filter);
      return {
        ...state,
        filteredHistoryData,
        //activeUser: filteredData.get(0)
      }

    case types.CHANGE_ACTIVE:
      return {
        ...state,
        activeUser: state.data.get(action.id)
      }

 case types.RECEIVE_CHARGES_DATA:
      return {
        ...state,
        chargesData:action.data,
        isFetching: false
      }
 case types.RECEIVE_HISTORY_DATA:
      return {
        ...state,
        historyData:action.data,
        isFetching: false
      }

 case types.FETCH_DATA_REQUEST:
      return {
        ...state,
        isFetching: true
      }

    default:
      return state;
  }
}
