import React, { Component } from 'react';
import Time from 'react-time'
import {FormatPhone } from '../components';
export default class ChargeRow extends Component {
    constructor(props) {
        super(props);
    }

    //handleClick(e) {
    //  this.props.activeUserChanged(this.props.user.get('id'));
    //}

    render() {
        const chargeData = this.props.charge;
        return (


            <tr>
                <td>
                    <Time value={chargeData.created} format="DD.MM.YYYY" />
                </td>
                <td>
                    <Time value={chargeData.created} format="HH:mm" />

                </td>
                <td>
                    <FormatPhone phone={chargeData.phone}/>
                </td>
                <td>
                    {`${chargeData.amount / 100} грн`}
                </td>
                <td>
                    {chargeData.statusDescription }
                </td>
            </tr>

        );
    }
}


//onClick={this.handleClick.bind(this)

//<tr }>
//        <td>
//          <img src={`images/${userData.get('image')}.svg`} className="user-image" />
//        </td>
//        <td>{userData.get('name')}</td>
//        <td>{userData.get('age')}</td>
//        <td>{userData.get('phone')}</td>
//      </tr>
