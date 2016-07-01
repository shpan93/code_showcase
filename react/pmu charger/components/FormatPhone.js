import React, { Component } from 'react';

export default class FormatPhone extends Component {
  constructor(props) {
    super(props);

  }

  //handleClick(e) {
  //  this.props.activeUserChanged(this.props.user.get('id'));
  //}

  render() {
    const phone = this.props.phone;


    var formatphone = function() {

        var arr = phone.toString().split('');
        var  space = ' ';
        var splitted = ['+', ...arr.slice(0, 3), space, ...arr.slice(3, 5), space, ...arr.slice(5, 8), space, ...arr.slice(8, 10), space, ...arr.slice(10, 12)];

      //  console.log();
        return  splitted.join('');
    };


      //let date =
    return (

        <span >
        {formatphone()}
        </span>
    );
  }
}
