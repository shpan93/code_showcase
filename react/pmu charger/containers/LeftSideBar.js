import React, { Component, PropTypes } from 'react';
import { SinglePayment,BulkPayment } from '../components';
import {Link} from 'react-router';
class LeftSideBar extends Component {
  constructor(props) {
    super(props);
    //this.store = this.props.store;
  }

  render () {
   

    return (
      <div className="col left">

                <SinglePayment onSingleSubmit={this.props.onSingleSubmit} chargeAmounts={this.props.chargeAmounts} clearValue={true} />


               <BulkPayment onBulkSubmit={this.props.onBulkSubmit}  chargeAmounts={this.props.chargeAmounts}/>
                <div className="btn-holder--fw">
                    <div className="btn">
                        <Link to='/history' >Архив пополнений </Link>
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

export default LeftSideBar;
