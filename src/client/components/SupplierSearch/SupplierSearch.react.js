import React, { Component, PropTypes } from 'react';
import i18nMessages from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import request from 'superagent-bluebird-promise';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import SupplierConstraints from '../../utils/validatejs/supplierConstraints';
require('./SupplierSearch.css');

export default class SupplierSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
  }

  static propTypes = {
    actionUrl: React.PropTypes.string.isRequired
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  componentWillMount(){
    let serviceRegistry = (service) => ({ url: `${this.props.actionUrl}/isodata` });
    const CountryField = serviceComponent({ serviceRegistry, serviceName: 'isodata' , moduleName: 'isodata-countries', jsFileName: 'countries-bundle' });
    this.externalComponents = { CountryField };
    this.constraints = new SupplierConstraints(this.context.i18n);
    this.context.i18n.register('SupplierSearch', i18nMessages);
  }

  searchSupplier() {
    const getRequest = request.get(`${this.props.actionUrl}/supplier/api/suppliers`);
    let result = getRequest.set('Accept', 'application/json').promise();
    result.then((data) => {
      this.setState({
        data: data.body
      });
    });
  }

  renderSearchBox() {
    const { CountryField } = this.externalComponents;
    return (<div className="form-group search-box">
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Search by</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Country of Registration</label>
      <CountryField
        actionUrl={this.props.actionUrl}
        optional={true}
        locale={this.context.i18n.locale}
      />
      <div className="text-right form-submit">
        <button className="btn btn-link">Cancel</button>
        <button className="btn btn-primary" onClick={this.searchSupplier.bind(this)}>Search</button>
      </div>
    </div>)
  }

  renderTable(data) {

    const columns = [
      {
        Header: 'Company Name',
        accessor: 'supplierName'
      },
      {
        Header: 'Country of Registration',
        accessor: 'countryOfRegistration'
      },
      {
        Header: 'Registration Number',
        accessor: 'commercialRegisterNo'
      }, {
        Header: 'City Of Registration',
        accessor: 'cityOfRegistration'
      }, {
        Header: 'Tax Identification Number',
        accessor: 'taxIdentificationNo'
      }, {
        Header: 'VAT Identification Number',
        accessor: 'vatIdentificationNo'
      }, {
        Header: 'Global Location Number',
        accessor:'globalLocationNo'
      },{
        Header: 'D-U-N-S Number',
        accessor:'dunsNo'
      }];

    return (<ReactTable
      data={data}
      columns={columns}
      defaultPageSize={5}
      className="table"
    />)
  }

  render() {
    return (<div>
      { this.renderSearchBox() }
      <div className="table-responsive">
        { this.renderTable(this.state.data) }
      </div>
    </div>)
  }
}