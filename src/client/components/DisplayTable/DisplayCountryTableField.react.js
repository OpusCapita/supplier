import React, { Component } from 'react';
import { Country } from '../../api';
import DisplayField from "./DisplayField.react";

class DisplayCountryTableField extends Component {

  static propTypes = {
    countryId: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { country: null };
    this.countryApi = new Country();
  }

  componentDidMount() {
    this.loadCountry(this.props.countryId);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.countryId !== newProps.countryId) {
      this.loadCountry(newProps.countryId);
    }
  }

  loadCountry = (countryId) => {
    return this.countryApi.getCountry(countryId).then(country => {
      this.setState({ country: country });
    }).
    catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
      }
    });
  };

  render() {
    return (<DisplayField>{this.state.country}</DisplayField>);
  }
}

export default DisplayCountryTableField;
