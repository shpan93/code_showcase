import React, { Component } from 'react';
export default class Option extends Component {
    constructor(props) {
        super(props);
    }

    //handleClick(e) {
    //  this.props.activeUserChanged(this.props.user.get('id'));
    //}

    render() {
        const value = this.props.value;
        return (

            <option value={value}> {`${value / 100} грн `}</option>


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
