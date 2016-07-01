import React from 'react';
import {NotificationRow} from '../components';


export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationOpened: true
        }
        //this.store = this.props.store;

    }

    //const  store = this.props.store;
    componentWillMount() {

        //this.props.newChargeData
        //store.dispatch(fetchUsers(this.props.store));
    }

    closeError() {
        this.setState({notificationOpened: false});
    }

    closePopup() {
        this.setState({notificationOpened: true});
        this.props.closePopup();
    }

    render() {
        //const temp = [{phone:'380966545893',amount:500},{phone:'380966545893',amount:500}];
        //  const state = this.store.getState();
        const newChargeData = this.props.newChargeData;
        return (
            <div
                className={`modal-wrapper ${newChargeData.isOpened ? 'active' :''} ${newChargeData.isProcessing ? 'processing' : ''}`}>
                <div className="modal">


                    <div className="table-wr preview">
                        <div className="table-wr__header">
                            <table>
                                <thead>
                                <tr>
                                    <th>Номер</th>
                                    <th>Сумма</th>
                                    <th>Статус</th>
                                    <th>Удалить номер</th>
                                </tr>
                                </thead>


                            </table>
                        </div>

                        <div className="table-wr__body">
                            <div className={`table-wr__body__scroll ${newChargeData.chargeList.length < 8 ? 'static-height': ''} `}>
                                <table>
                                    <tbody>
                                    {
                                        newChargeData.chargeList.map((item, i) => (
                                            <NotificationRow key={item.id} itemData={item}
                                                             removeRow={this.props.removeRow}/>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    </div>

                    <div className={`errors ${newChargeData.errorsParsing.length > 0 && this.state.notificationOpened ? 'active' : ''}`}>
                  <span className="close" onClick={this.closeError.bind(this)}>
                      ✕
                  </span>
                        <p> {newChargeData.errorsParsing.length} errors parsing csv</p>
                        <ul>
                            {newChargeData.errorsParsing.map((item, i) => (
                                <li key={i}>{`Error parsing in row ${item.id}`}
                                    <ul>
                                        {item.list.map((error, i) => (
                                            <li>{error}</li>
                                        ))}
                                    </ul>
                                </li>

                            ))}
                        </ul>
                    </div>

                    <div className="btn-holder--fw accept-btn" onClick={this.props.onConfirm}>
                        <div className="btn">
                            Подтвердить
                        </div>


                    </div>
                    <div className="btn-holder--fw" onClick={this.closePopup.bind(this)}>
                        <div className="btn">
                            Закрыть
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

// {temp.map( (charge,i) => (
//
//     <NotificationRow key={i} charge={charge} />
// ))}

// {
//     newChargeData.chargeList.map((item,i) => (
//         <NotificationRow key={i} charge={item}></NotificationRow>
//
//     ))
//
// }
