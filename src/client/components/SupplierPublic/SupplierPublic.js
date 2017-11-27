import React, { Component, PropTypes } from 'react';
import { Supplier } from '../../api';

export default class SupplierPublic extends Component {
  
  static propTypes = {
    supplierId: PropTypes.string.isRequired
  };
  
  constructor(props) {
    super(props);
    this.state = {
      supplier : null
    };
  
    this.supplierApi = new Supplier();
  }
  
  render() {
    return (
      <div className="form-horizontal">
        <div>{ this.props.supplierId }</div>
      </div>
    );
  }
  
  componentDidMount() {
    
    this.supplierApi.getSupplier(this.props.supplierId).then(supplier => {
      this.setState({
        isLoaded: true,
        supplier: supplier
      });
      console.log(supplier);
    }).
    catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
        return;
      }
    });
    
  }
};
