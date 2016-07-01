import React from 'react';
import {LeftSideBar, ChargesTable, Notification} from '../containers';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../actions';
 class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        //this.store = this.props.store;
    }
componentWillMount(){
var user = this.props.user;
    //this.props.actions.initCharger();
   this.props.actions.getChargesData(user.sessionUid);
}
     singleSubmit(phone,amount){
         if(!phone || !amount) return false;
         //this.props.actions.chargePhone(this.props.user.sessionUid,phone,amount);
         this.props.actions.receiveNewChargeList([{phone,amount, id:0}], []);
         // console.log(this.props.user.sessionUid,phone,amount)
     }
     onConfirm(){

         this.props.actions.chargePhone(this.props.user.sessionUid, this.props.charge.chargeList);
     }
     closePopup(){

         this.props.actions.closePopup();
     }
     removeRow(id){
         this.props.actions.removeChargeRow(id);
     }
     bulkSubmit(charges,errors){
         this.props.actions.receiveNewChargeList(charges,errors);
     }
    render() {
        return (
            <div className={`wr ${this.props.data.isFetching ? 'loading' : ''} `}>

                <LeftSideBar chargeAmounts={this.props.user.chargeAmounts}
                             onSingleSubmit={this.singleSubmit.bind(this)}
                             onBulkSubmit={this.bulkSubmit.bind(this)} />
                <ChargesTable chargesData={this.props.data.chargesData}  />
                <Notification newChargeData={this.props.charge} onConfirm={this.onConfirm.bind(this)} closePopup={this.closePopup.bind(this)} removeRow={this.removeRow.bind(this)}/>

            </div>

        );
    }
}

function mapDispatch(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

//<Notification newChargeData={this.props.charge}  closePopup={this.closePopup.bind(this)} removeRow={this.removeRow.bind(this)}/>
export default connect(state => state,mapDispatch)(Dashboard);