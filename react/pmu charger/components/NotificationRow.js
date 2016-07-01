import React from 'react';
import {FormatPhone} from '../components';

export default class NotificationRow extends React.Component {
    constructor(props) {
        super(props);
    }

    //handleClick(e) {
    //  this.props.activeUserChanged(this.props.user.get('id'));
    //}
removeRow(){
    this.props.removeRow(this.props.itemData.id)
}
    render() {
        const rowData = this.props.itemData;


        return (
            <tr >
                <td>

                    <FormatPhone phone={rowData.phone}/>
                </td>


                <td> {`${rowData.amount / 100} грн`}</td>
                <td className={`status ${rowData.status.className}`}>
                    {`${rowData.status.text} `}
                </td>
                <td>
                    <span className="delete-row" onClick={this.removeRow.bind(this)}>✕</span>
                </td>
            </tr>
        );
    }
}


