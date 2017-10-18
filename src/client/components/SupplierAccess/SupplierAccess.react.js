import DisplayTable from "../DisplayTable/DisplayTable.react.js";
import DisplayRow from "../DisplayTable/DisplayRow.react.js";
import DisplayField from "../DisplayTable/DisplayField.react.js";
import request from "superagent-bluebird-promise";
import React, { Component } from 'react';

class SupplierAccess extends Component {
	static propTypes = {
    actionUrl:  React.PropTypes.string.isRequired,
    /*supplierId: React.PropTypes.string,
    locale: React.PropTypes.string,
    username: React.PropTypes.string,
    readOnly: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func*/
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  componentWillMount() {
    // this.context.i18n.register('SupplierValidatejs', validationMessages);
    // this.context.i18n.register('SupplierBankAccountEditor', i18nMessages);
  }

  componentDidMount() {
    this.loadAccessRequests();
  }

  loadAccessRequests = () => {
  	let data = request.get(`${this.props.actionUrl}/supplier/api/suppliers/getSupplierAccess`)
		.set('Accept', 'application/json')
		.then((data)=> {
			return data
		})
		.catch((errors) => {
      console.log('Error during retrieving Supplier Access list:');
    });
  }

  approveRequest = () => {

  }

  denyRequest = () => {

  }

	render(){
		let requests = []
		return(
			<div className='table-responsive'>
	      <DisplayTable
	        headers={[{ label: 'First Name' },
	          { label: 'Last Name' },
	          { label: 'Email' },
	          { label: 'Date' },
	          { label: 'Status' },
	          { label: 'Comment' },
	          { label: 'Action' }
	        ]}
	      >
	        { requests.length > 0 ?
						requests.map((request, index) =>
	          (<DisplayRow key={index}>
	            <DisplayField>{ request.firstName }</DisplayField>
	            <DisplayField>{ request.lastName }</DisplayField>
	            <DisplayField>{ request.email }</DisplayField>
	            <DisplayField>{ request.date }</DisplayField>
	            <DisplayField>{ request.status }</DisplayField>
	            <DisplayField>{ request.comment }</DisplayField>
	            <DisplayField>{ "Action" }</DisplayField>
	          </DisplayRow>))
						: null
	        }
	      </DisplayTable>
	    </div>
	  )
	}
}

export default SupplierAccess;
