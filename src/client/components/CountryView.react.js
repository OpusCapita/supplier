import React, { Component } from 'react';
import { Country } from '../api';

export default class CountryView extends Component {

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
      console.log(`Error getting country for ID ${countryId}`);
      this.setState({ country: countryId });
    });
  };

  render() {
    return (<div>{this.state.country}</div>);
  }
}
