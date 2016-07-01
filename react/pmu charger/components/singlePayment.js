import React, {Component} from 'react';
import MaskedInput  from 'react-maskedinput'
import Option  from '../components'

export default class SinglePayment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: true,
            isFilled: false,
            isApproved: false,
            phone: false,
            amount:null,
            maskedPhone:''
        }
        this.chargeAmounts=[]
    }

    componentDidMount() {
        this.refs.singlePayment.input.value = '';
        //     this.refs.phone.findDOMNode().focus();

    }
    //componentWillReceiveProps(){
        
    //}
componentWillReceiveProps() {
    this.chargeAmounts = this.props.chargeAmounts;//.filter( x => x > 0 );
 //   this.chargeAmounts.push(200)
    this.state.amount = !this.state.amount?this.chargeAmounts[0]:this.state.amount;

}
    //mixins: [LinkedStateMixin]

    handleInput(e) {
        //if()
        var value = e.target.value;

        var phoneString = value.replace(/\s/g, '').replace(/\+/g, '');
        //console.log(value);

        if (/^\d+$/.test(phoneString)) {
            this.setState({
                valid: true,

                phone: 380 + phoneString
            });

            //console.log('valid')
        } else {
            if (/\_/.test(phoneString)) {
                this.setState({
                    valid: false,
                    phone: null,
                    isFilled:true,
                });
                // console.log('inavlid')
            }
        }

    }

    handleSelect(e) {
        this.setState({
            amount: e.target.value
        });
    }

    //handleClick(e) {
    //  this.props.activeUserChanged(this.props.user.get('id'));
    //}
    approveCharge(e) {
        this.setState({
            isApproved: true
        });
    }

    acceptCharge(e) {
       //dispatch charge
        this.props.onSingleSubmit(this.state.phone,this.state.amount);

        this.setState({
            valid: false,
            isFilled: false,
            isApproved: false,
            phone: false,
            //amount:null,
            maskedPhone:''

        });
    }
    declineCharge(e) {
        this.setState({
            isApproved: false
        });
    }


    render() {

        return (



            <div className="single-payment">
                <div className="input-row mobile mbot">
                    <input type="text" name="prefix" value="380" readOnly/>

                    <MaskedInput className={this.state.phone ? 'valid' : 'invalid'}  mask="11 111 11 11"
                                 ref="singlePayment"
                                value={this.state.maskedPhone}
                                 name="phone" placeholder="__ ___ __ __" onChange={this.handleInput.bind(this)}
                                 disabled={this.state.isApproved ? true : false}/>

                </div>
                <div className="input-row">
                    <label htmlFor="" className="select-holder">
                        <select defaultValue={this.state.amount}
                            onChange={this.handleSelect.bind(this)}
                                disabled={this.state.isApproved ? true : false}>

                            {this.chargeAmounts.map((option, i) => (
                              //  if(option > 0){
                                <option key={i} value={option} > {`${option / 100} грн `}</option>
                            //}
                            ))}
                        </select>
                    </label>

                </div>
                <div className='btn-holder--fw'>
                    <div
                        className={`btn ${(this.state.isApproved ? 'active' : '')} ${(this.state.phone ? '' : 'btn--disabled')} `}
                        onClick={this.approveCharge.bind(this)}>
                        Пополнить
                    </div>
                </div>

                <div className={`accept-holder ${(this.state.isApproved ? 'active' : '')}`}>
                    <p>
                        Вы действительно хотите <br />
                        пополнить номер <br />
                        <span className="number">{this.state.phone}</span> на <span
                        className="amount">{this.state.amount / 100}</span> грн ?
                    </p>
                    <div className="btn-holder btn-holder--center" >
                        <div className="btn btn--small" onClick={this.acceptCharge.bind(this)}>
                            Да
                        </div>
                        <div className="btn btn--small" onClick={this.declineCharge.bind(this)}>
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