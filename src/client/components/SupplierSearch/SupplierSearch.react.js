import React, { Component, PropTypes } from 'react';
import i18nMessages from './i18n';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

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
    />)
  }

  render() {
    return (
      <div className="table-responsive">
          { this.renderTable() }
      </div>)
  }
}