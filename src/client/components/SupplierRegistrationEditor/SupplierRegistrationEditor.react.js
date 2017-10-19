import React, { PropTypes, Component } from 'react';
import request from 'superagent-bluebird-promise';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from './i18n';
import SupplierRegistrationEditorForm from './SupplierRegistrationEditorForm.react.js';
import SupplierAccessRequestForm from './SupplierAccessRequestForm.react.js';
import SupplierAccessView from './SupplierAccessView.react';
import { Supplier, Auth, Contact } from '../../api';

/**
 * Provide general company information.
 */
class SupplierRegistrationEditor extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    supplier: PropTypes.object,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func,
    onLogout: React.PropTypes.func
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      hasErrors: false,
      supplier: {
        ...this.props.supplier
      },
      supplierAccess: null,
      supplierAttributes: null,
      supplierExist: false,
      loading: true
    }

    this.supplierApi = new Supplier();
    this.authApi = new Auth();
    this.contactApi = new Contact();
  }

  createSupplierPromise = null;

  componentWillMount(){
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('SupplierRegistrationEditor', i18nMessages);
  }

  componentDidMount() {
    request.get(`/supplier/api/supplier_access/${this.props.user.id}`).set('Accept', 'application/json').then(response => {
      const supplierAccess = response.body;
      const supplierId = supplierAccess ? supplierAccess.supplierId : undefined;

      this.setState({ loading: false, supplierAccess: supplierAccess, supplierExist: Boolean(supplierId) });

      if (supplierId) {
        request.get(`/supplier/api/suppliers/${supplierId}`).set('Accept', 'application/json').then(response => {
          this.setState({ supplier: response.body });
        }).catch(error => null);
      }
    }).catch(error => {
      return this.setState({ loading: false, supplierExist: false });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('SupplierRegistrationEditor', i18nMessages);
    }
  }

  postSupplierCreate = () => {
    return this.authApi.refreshIdToken().then(() => {
      console.log("id token refreshed");

      const supplier = this.state.supplier;
      const user = this.props.user;
      const contact = {
          contactType: "Default",
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          supplierId: supplier.supplierId,
          createdBy: user.id,
          changedBy: user.id
      }

      return this.contactApi.createContact(supplier.supplierId, contact).then(() => {
        console.log('contact created');

        if (this.props.onUpdate) {
          this.props.onUpdate({ supplierId: supplier.supplierId, supplierName: supplier.supplierName });
        }

        if (this.props.onChange) {
          this.props.onChange({ isDirty: false });
        }

        return Promise.resolve(null);
      }).catch(err => {
        console.error('error creating contact: ' + err);
        throw err;
      })
    }).catch(err => {
      console.err('error refreshing idToken: ' + err);
      throw err;
    });
  }

  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange({ isDirty: true });
    }
  }

  handleUpdate = newSupplier => {
    if (!newSupplier) {
      return;
    }

    newSupplier = {  // eslint-disable-line no-param-reassign
      ...newSupplier,
      createdBy: this.props.user.id,
      changedBy: this.props.user.id
    };

    return this.supplierApi.createSupplier(newSupplier).then(createdSupplier => {
      this.setState({ supplier: createdSupplier });

      if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.saved'), 'info')

      return this.postSupplierCreate();
    }).
    catch(errors => {
      this.setState({ supplier: newSupplier });

      switch (errors.status) {
        case 403: case 405:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.failedUnauthorized'), 'error');
          break;
        case 401:
          this.props.onUnauthorized();
          break;
        case 409:
          this.setState({ supplierExist: true });
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.failed'), 'error');
      }

      return Promise.resolve(null);
    });
  }

  handleAccess = () => {
    const body = { supplierId: this.state.supplier.supplierId, userId: this.props.user.id };
    this.grantSupplierAccessPromise = request.put(`/supplier/api/grant_supplier_access`).
      set('Accept', 'application/json').send(body).promise();

    this.grantSupplierAccessPromise.then(() => {
      return this.postSupplierCreate();
    }).catch(errors => {
      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.failed'), 'error');
    });
  }

  handleAccessRequest = (attributes) => {
    this.setState({ supplierAttributes: attributes });
  }

  handleCancelAccessRequest = () => {
    this.setState({ supplierAttributes: null });
  }

  handleSaveAccessRequest = (accessAttributes, supplier) => {
    accessAttributes.userId = this.props.user.id;
    request.post('/supplier/api/supplier_access').set('Accept', 'application/json').send(accessAttributes).then(response => {
      this.setState({
        supplierAccess: response.body,
        supplierExist: true,
        supplier: supplier
      });
    });
  }

  toRender = () => {
    if (this.state.supplierExist) return <SupplierAccessView
                                          supplierAccess={ this.state.supplierAccess }
                                          supplier={ this.state.supplier }
                                          onAccessConfirm= { this.handleAccess }
                                         />

    if (this.state.supplierAttributes) {
      return <SupplierAccessRequestForm
              supplierAttributes={ this.state.supplierAttributes }
              userId={ this.props.user.id }
              onCreateSupplierAccess={ this.handleSaveAccessRequest }
              onCancel={ this.handleCancelAccessRequest }
             />
    }

    return <SupplierRegistrationEditorForm
             actionUrl={ this.props.actionUrl }
             supplier={ this.state.supplier }
             onSupplierChange={ this.handleUpdate }
             onChange={ this.handleChange }
             onCancel={ this.props.onLogout }
             onAccessRequest={ this.handleAccessRequest }
           />
  }

  render() {
    const { loading, hasErrors } = this.state;

    if (loading) {
      /* Implement loading spinner */
      return null;
    }

    if (hasErrors) {
      return (
        <div>{ this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.unableToRender') }</div>
      );
    }

    return (
      <div className="container supplier-registration-container">
        <div className='box' id='supplier-registration'>
          <h2>{this.context.i18n.getMessage('SupplierRegistrationEditor.Messages.companyRegistration')}</h2>
          {this.toRender()}
        </div>
      </div>
    );
  }
}

export default SupplierRegistrationEditor;
