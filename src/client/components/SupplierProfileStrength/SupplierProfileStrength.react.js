import React, { Component, PropTypes } from 'react';
import Gauge from 'react-svg-gauge';
import request from 'superagent-bluebird-promise';
import hexColourCalculator from './hexColourCalculator.js';

class SupplierProfileStrength extends Component {
  static propTypes = {
    actionUrl: PropTypes.string.isRequired,
    supplierId: PropTypes.string.isRequired
  };

  constructor() {
    super();
    this.state = {
      value: 0
    }
  }

  profileStrengthPromise = null;

  componentDidMount() {
    const url = `${this.props.actionUrl}/supplier/api/suppliers/${encodeURIComponent(this.props.supplierId)}/profile_strength`;
    this.profileStrengthPromise = request.get(url).set('Accept', 'application/json').promise();

    this.profileStrengthPromise.then(response => this.setState({ value: response.body })).catch(errors => null);
  }

  componentWillUnmount() {
    if (this.profileStrengthPromise) {
      this.profileStrengthPromise.cancel();
    }
  }

  render() {
    const colorHex = hexColourCalculator.colourFor(this.state.value);

    return (
      <div>
        <Gauge value={this.state.value} width={200} height={160} color={colorHex} label="" />
      </div>
    );
  }
}

export default SupplierProfileStrength;
