import React, {Component} from 'react';
import Papa from 'papaparse'

export default class BulkPayment extends Component {
    constructor(props) {
        super(props);
    }

    //handleClick(e) {
    //  this.props.activeUserChanged(this.props.user.get('id'));
    //}
    readAsChargeList(array, availableAmounts) {
        var charges = [];
        const errors = [];
        array.map( (row, index) => {
            let phone = row[0].toString();
            let amount = row[1];
            let currentError = {
                id:null,
                list:[]
            };
            phone = phone.replace(/\s/g, '').replace(/\+/g, '');

            if(!phone || phone.length < 12){
               // console.log(`${phone} is invalid phone`);

                currentError.list.push(`${phone} is invalid phone`);
                //return;
            }

            if(!amount || availableAmounts.indexOf(amount) === -1){
               // console.log('invalid amount')
                if (amount == '') {
                    currentError.list.push(`"amount" column is empty`);
                } else {
                    currentError.list.push(`${amount} is invalid amount`);    
                }
                
            }

            if (currentError.list.length > 0){
                currentError.id = index
                errors.push(currentError);
            }
            else{
                charges.push({id:index,phone, amount});
            }
        } )

        return {charges, errors};
    }

    handleFileSelect(evt) {
        var file = evt.target.files[0];
        var _self = this;
        if (file) {
            Papa.parse(file, {
                delimiter: "",
                header: false,
                dynamicTyping: true,
                numbers:false,
                skipEmptyLines: true,
                beforeFirstChunk:function (chunk ) {
                    return chunk.replace(/\t;/g, ';').replace(/\s*;/g,";").replace(/\t,/g, ',').replace(/\s*,/g,",");
                    // console.log(chunk)
                },
                complete: function (results) {
                    let {charges, errors} = _self.readAsChargeList(results.data, _self.props.chargeAmounts);
                    //console.log(results);
                    _self.props.onBulkSubmit(charges,errors);
                    _self.refs.bulkInput.value = '';
                }
            });
        }
    }

    render() {
        const chargeData = this.props.charge;

        //let date =
        return (

            <div className="bulk-payment">
                <div className="btn-holder--fw">
                    <label htmlFor="bulkInput">
                        <div className="btn">
                            Массовое пополнение
                        </div>
                    </label>

                    <input type="file" accept=".csv" ref="bulkInput" id="bulkInput" onChange={this.handleFileSelect.bind(this)}/>
                </div>


                <div className="accept-holder ">
                    <p>
                        Вы действительно хотите <br />
                        пополнить номера из файла <br />
                        <span className="filename">filename.csv</span> на <span className="amount">5</span> грн ?
                    </p>
                    <div className="btn-holder btn-holder--center">
                        <div className="btn btn--small">
                            Да
                        </div>
                        <div className="btn btn--small">
                            Нет
                        </div>
                    </div>
                </div>
            </div>
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