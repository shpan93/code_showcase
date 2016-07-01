import React, { Component } from 'react';

export default class ToolBar extends Component {
  constructor(props) {
    super(props);
  }

  onSortedByName(e) {
    this.props.onSorted('name');
  }

  onSortedByAge(e) {
    this.props.onSorted('age');
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="toolbar">
            <button className="btn btn-default" onClick={this.onSortedByName.bind(this)}>
              <i className="icon fa fa-sort-alpha-asc"></i> Sort by name
            </button>
            <button className="btn btn-default" onClick={this.onSortedByAge.bind(this)}>
              <i className="icon fa fa-sort-numeric-desc"></i> Sort by age
            </button>
          </div>
        </div>
      </div>
    );
  }
}
