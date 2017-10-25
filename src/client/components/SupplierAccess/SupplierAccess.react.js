import DisplayTable from "../DisplayTable/DisplayTable.react.js";
import DisplayRow from "../DisplayTable/DisplayRow.react.js";
import DisplayField from "../DisplayTable/DisplayField.react.js";
import request from "superagent-bluebird-promise";
import React, { Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from "./i18n";

class SupplierAccess extends Component {
	static propTypes = {
    actionUrl:  React.PropTypes.string.isRequired,
  };

  static contextTypes = {
    i18n: React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

	state = {
    isLoaded: false,
    allRequests: [],
    loadErrors: false,
		error: false,
		success: false,
		loadingRequest: false
  };

  componentWillMount() {

    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('SupplierAccess', i18nMessages);
		this.loadAccessRequests();
  }
	componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('SupplierAccess', i18nMessages);
    }
  }


  componentDidMount() {
  }

  loadAccessRequests = () => {
  	request.get(`${this.props.actionUrl}/supplier/api/suppliers/getSupplierAccess`)
		.set('Accept', 'application/json')
		.then((data)=> {
			this.setState({allRequests: data.body.requests, isLoaded: true})
		})
		.catch((errors) => {
      console.log('Error during retrieving Supplier Access list:');
    });
  }

  sendAccessStatus = (data, type) => {
		this.setState({
			loadingRequest: true
		})
		let body = {
			supplierId: data.supplierId,
			userId: data.userId,
			accessReason: type
		}
		this.setState({
			selectedRequest: body
		})
		request.post(`${this.props.actionUrl}/supplier/api/suppliers/giveAccess`)
		.set('Accept', 'application/json')
		.send(body)
		.then((data)=> {
			if(this.context.showNotification)
				this.context.showNotification(this.context.i18n.getMessage('SupplierAccess.Messages.saved'), 'info')

			let allRequests = this.state.allRequests
			for(let index = 0; index < allRequests.length; index++){
				if(this.state.selectedRequest.supplierId == allRequests[index].supplierId){
					allRequests.splice(index, 1)
				}
			}
			this.setState({
				allRequests,
				loadingRequest: false
			})
		})
		.catch((errors) => {
			if(this.context.showNotification)
				this.context.showNotification(this.context.i18n.getMessage('SupplierEditor.Messages.failed'), 'error')
			this.setState({
				loadingRequest: false
			})
			console.log('Error during giving supplier access');
		});
  }

	getDate = (date) => {
		let today = new Date(date)
		let dd = today.getDate();
		let mm = today.getMonth()+1;

		let yyyy = today.getFullYear();
		if(dd<10){
		    dd='0'+dd;
		}
		if(mm<10){
		    mm='0'+mm;
		}
		today = dd+'/'+mm+'/'+yyyy;
		return today
	}

	render(){
		//let requests = this.state.allRequests
		return(
			<div className='table-responsive'>
				{
					this.state.loadingRequest?
					this.context.i18n.getMessage("SupplierAccess.Messages.loading")
					: null
				}
				{
					this.state.isLoaded?
					<DisplayTable
						headers={[{ label: this.context.i18n.getMessage("SupplierAccess.TableHeader.fistName") },
						{ label: this.context.i18n.getMessage("SupplierAccess.TableHeader.lastName") },
						{ label: this.context.i18n.getMessage("SupplierAccess.TableHeader.email") },
						{ label: this.context.i18n.getMessage("SupplierAccess.TableHeader.date") },
						{ label: this.context.i18n.getMessage("SupplierAccess.TableHeader.status") },
						{ label: this.context.i18n.getMessage("SupplierAccess.TableHeader.comment") },
						{ label: this.context.i18n.getMessage("SupplierAccess.TableHeader.action") }
					]}
					>
						{ this.state.allRequests.length > 0 ?
							this.state.allRequests.map((request, index) =>

									(<DisplayRow key={index}>
										<DisplayField>{ request.details ? request.details.firstName : this.context.i18n.getMessage("SupplierAccess.Description.unavailable") }</DisplayField>
										<DisplayField>{ request.details ? request.details.lastName : this.context.i18n.getMessage("SupplierAccess.Description.unavailable")}</DisplayField>
										<DisplayField>{ request.details ? request.details.email : this.context.i18n.getMessage("SupplierAccess.Description.unavailable") }</DisplayField>
										<DisplayField>{ this.getDate(request.createdOn).toString() }</DisplayField>
										<DisplayField>{ request.status }</DisplayField>
										<DisplayField>{ request.accessReason }</DisplayField>
										<DisplayField>{
										<nobr>
											<button type="button" className="btn btn-sm btn-default" onClick={() => this.sendAccessStatus(request, 'approved')}><span className="glyphicon glyphicon-ok"></span>{this.context.i18n.getMessage("SupplierAccess.ButtonLabel.add")}</button>
											<button type="button" className="btn btn-sm btn-default" onClick={() => this.sendAccessStatus(request, 'rejected')}><span className="glyphicon glyphicon-remove"></span>{this.context.i18n.getMessage("SupplierAccess.ButtonLabel.reject")}</button>
										</nobr>
									 }</DisplayField>
									</DisplayRow>)
							)
							: this.context.i18n.getMessage("SupplierAccess.Description.noData")
						}
					</DisplayTable>

					: this.context.i18n.getMessage("SupplierAccess.Messages.loading")
				}
	    </div>
	  )
	}
}

export default SupplierAccess;
