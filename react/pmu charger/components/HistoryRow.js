import React, {Component} from 'react';
import Time from 'react-time'
import {FormatPhone} from '../components';
import moment from 'moment'
export default class HistoryRow extends Component {
    constructor(props) {
        super(props);
    }

    //handleClick(e) {
    //  this.props.activeUserChanged(this.props.user.get('id'));
    //}

    render() {
        const rowData = this.props.charge;

        const updated = moment(rowData.updated);
        const now = moment();
        const formatDate = (now -updated) <  1000 * 60 * 60 * 24 ? 'HH:mm' : 'DD.MM.YYYY';

// console.log(now-updated)
        return (


            <tr >
                <td>

                    <FormatPhone phone={rowData.phone}/>
                </td>



                <td>{rowData.creator}</td>
                <td>{rowData.activity.name}</td>
                <td> {`${rowData.amount / 100} грн`}</td>
                <td>
                    <span>{formatDate === 'HH:mm' ?  'Сегодня':'' }</span>   <Time value={rowData.created} format={formatDate}/>
                </td>
                <td>
                    <Time value={rowData.updated} format={formatDate}/>
                </td>
            </tr>

        );
    }
}


