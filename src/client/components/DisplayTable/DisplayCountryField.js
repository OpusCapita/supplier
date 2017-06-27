import React, { Component } from 'react';

class DisplayCountryField extends Component {

  static propTypes = {
    actionUrl: React.PropTypes.string.isRequired,
    countryId: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (<td>{this.state.country}</td>);
  }
}

export default DisplayCountryField;
