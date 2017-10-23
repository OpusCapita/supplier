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

	state = {
    isLoaded: false,
    allRequests: [],
    loadErrors: false
  };

  componentWillMount() {
    // this.context.i18n.register('SupplierValidatejs', validationMessages);
    // this.context.i18n.register('SupplierBankAccountEditor', i18nMessages);
		this.loadAccessRequests();
  }

  componentDidMount() {
  }

  loadAccessRequests = () => {
  	request.get(`${this.props.actionUrl}/supplier/api/suppliers/getSupplierAccess`)
		.set('Accept', 'application/json')
		.then((data)=> {
			this.setState({allRequests: data.body, isLoaded: true})
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
		//let requests = this.state.allRequests
		return(
			<div className='table-responsive'>
				{
					this.state.isLoaded?
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
						{ this.state.allRequests.length > 0 ?
							this.state.allRequests.map((request, index) =>
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

					: null
				}
	    </div>
	  )
	}
}

export default SupplierAccess;
