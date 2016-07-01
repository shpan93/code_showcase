import React, { Component, PropTypes } from 'react';
//import { bindActionCreators } from 'redux';
//import { connect } from 'react-redux';

import {connect} from 'react-redux';
import {ChargeRow } from '../components';
//import * as actions from '../actions';

//const { searchText, changeActive, addFilter } = actions;


export default class ChargesTable extends Component {
  constructor(props) {
    super(props);

  }


  render () {
 //   const state = this.store.getState();
      //this.store = this.props.store;
      const charges = this.props.chargesData.map( (charge,i) => (
      <ChargeRow
          key={i}
         charge={charge}
    />

    ) );

    return (
      <div className="col right">



                <div className="table-wr dashboard">
                    <div className="table-wr__header">
                        <table>
                            <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Время</th>
                                <th>Номер</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                            </tr>
                            </thead>


                        </table>
                    </div>

                    <div className="table-wr__body">
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


// function mapState(state) {
//     return {
//         chargesData:state.data.chargesData
//     };
// }


//
// export default connect(mapState)(ChargesTable);