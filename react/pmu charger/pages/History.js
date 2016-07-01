import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {debounce} from 'throttle-debounce';

import {HistoryRow} from '../components';

import * as actions from '../actions';
const {searchText} = actions;
//import * as actions from '../actions';

//const { searchText, changeActive, addFilter } = actions;

class History extends Component {
    constructor(props) {
        super(props);
        this.callAjax = debounce(500, this.callAjax);

    }

    componentWillMount() {
        //var user = this.props.user;
        //this.props.actions.initCharger();
        this.props.actions.getHistoryData(this.props.user.sessionUid, false, null);
    }

    search(e) {
        //if()
        let storedValue;
        //e.target.value = e.target.value.replace(/[^\d]/,'');

        const value = e.target.value.replace(/(\s)|(\+)|([^\d])/g, '');
        if (value !== storedValue) {

            storedValue = value;
            this.callAjax(value);


        }
        //this.props.actions.searchText(value);
    }

    callAjax(value) {

        this.props.actions.getHistoryData(this.props.user.sessionUid, false, value);
    }

    render() {
        const data = this.props.data;
        const charges = data.historyData.map((charge, i) => (
            <HistoryRow
                key={i}
                charge={charge}/>));

        return (


            <div className="archive">

                <div className="table-wr history">
                    <h3>Архив пополнений</h3>
                    <div className="table-wr__header">
                        <table>
                            <thead>
                            <tr>
                                <th>
                                    <div className="search-row">
                                        <label htmlFor="searchInput">
                                            <i className="fa fa-search"></i>
                                            <input id="searchInput"  onKeyUp={this.search.bind(this)} type="text"
                                                   name="name" placeholder="Поиск по номеру" autoComplete="off" maxLength="17"/>
                                        </label>
                                    </div>
                                </th>

                                <th>Создатель</th>
                                <th>Активность</th>
                                <th>Сумма</th>
                                <th>Создано</th>
                                <th>Обновлено</th>

                            </tr>
                            </thead>


                        </table>
                    </div>

                    <div className={`table-wr__body ${data.isFetching ? 'loading' :''}`}>
                        <div className="table-wr__body__scroll">
                            <table>
                                <tbody>
                                {charges}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>

            </div>

        );
    }
}


//function mapState(state) {
//  return state;
//}

//function mapDispatch(dispatch) {
//  return {
//    actions: bindActionCreators(actions, dispatch)
//  };
//}
function mapState(state) {
    return state;
}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapState, mapDispatch)(History);
//export default History;
