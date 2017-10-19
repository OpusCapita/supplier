import React, { Component, PropTypes } from 'react';
import Gauge from 'react-svg-gauge';
import hexColourCalculator from './hexColourCalculator.js';
import { Supplier } from '../../api';

class SupplierProfileStrength extends Component {
  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };

  constructor() {
    super();
    this.state = {
      value: 0
    };
    this.supplierApi = new Supplier();
  }

  componentDidMount() {
    this.supplierApi.getProfileStrength(this.props.supplierId).
      then(value => this.setState({ value: value })).catch(errors => null);
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
