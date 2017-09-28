import React, { Component, PropTypes } from 'react';
import i18nMessages from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import styles from './SupplierSearch.css';

export default class SupplierSearch extends Component {

  constructor(props) {
    super(props);
  }

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  componentWillMount(){
    this.context.i18n.register('SupplierSearch', i18nMessages);
  }

  renderSearchBox() {
    return (<div className="form-group search-box">
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Company Name</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Registration Number</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">City of Registration</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Country of Registration</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Tax Identification Number</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">VAT Identification Number</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4 control-label">Global Location Number</label>
      <input className="form-control"/>
      <label className="col-xs-12 col-sm-6 col-md-4control-label">D-U-N-S Number</label><input className="form-control"/>
      <div className="text-right form-submit">
        <button className="btn btn-link">Cancel</button>
        <button className="btn btn-primary">Search</button>
      </div>
    </div>)
  }

  renderTable() {

    const data = [{
      companyName: 'E-Farm AG',
      registrationNumber: 'MI342323',
      cityOfRegistration: 'Hamburg',
      countryOfRegistration: 'Germany',
      taxIdNumber: 'T-534324',
      vatRegistrationNumber: 'DE169838187',
      dunsNumber: 'DE169838187',
    }];

    const columns = [{
      Header: 'Company Name',
      accessor: 'companyName'
    }, {
      Header: 'Registration Number',
      accessor: 'registrationNumber'
    }, {
      Header: 'City Of Registration',
      accessor: 'cityOfRegistration'
    }, {
      Header: 'Country Of Registration',
      accessor:'countryOfRegistration'
    }, {
      Header: 'Tax Identification Number',
      accessor: 'taxNumber'
    }, {
      Header: 'VAT Identification Number',
      accessor: 'vatRegistrationNumber'
    }, {
      Header: 'Global Location Number',
      accessor:'globalLocation'
    },{
      Header: 'D-U-N-S Number',
      accessor:'dunsNumber'
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
        { this.renderTable() }
      </div>
    </div>)
  }
}