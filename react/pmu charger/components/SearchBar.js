import React, { Component } from 'react';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);
  }

  onKeyUp(e) {
    this.props.onKeyUp(e.target.value);
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="searchbar form-group">
            <input
               type="text"
               onKeyUp={this.onKeyUp.bind(this)}
               className="form-control"
               placeholder="Search people by name..."
             />
          </div>
        </div>
      </div>
    );
  }
}
