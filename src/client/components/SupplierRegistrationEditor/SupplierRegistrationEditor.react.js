import React, { PropTypes, Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from '../../i18n';
import SupplierRegistrationEditorForm from './SupplierRegistrationEditorForm.react.js';
import SupplierAccessRequestForm from './SupplierAccessRequestForm.react.js';
import SupplierAccessView from './SupplierAccessView.react';
import { Supplier, Access, Auth, Contact } from '../../api';
import { Components } from '@opuscapita/service-base-ui';

/**
 * Provide general company information.
 */
class SupplierRegistrationEditor extends Components.ContextComponent {

  static propTypes = {
    user: PropTypes.object.isRequired,
    supplier: PropTypes.object,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func,
    onLogout: React.PropTypes.func
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
    this.accessApi = new Access();
  }

  componentWillMount(){
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('Supplier', i18nMessages);
  }

  componentDidMount() {
    this.accessApi.getAccess(this.props.user.id).then(supplierAccess => {
      const supplierId = supplierAccess.supplierId;

      this.setState({ loading: false, supplierAccess: supplierAccess, supplierExist: Boolean(supplierId) });

      if (supplierId) {
        this.supplierApi.getSupplier(supplierId).then(supplier => {
          this.setState({ supplier: supplier });
        }).catch(error => null);
      }
    }).catch(error => {
      return this.setState({ loading: false, supplierExist: false });
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('Supplier', i18nMessages);
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
        supplierId: supplier.id,
        createdBy: user.id,
        changedBy: user.id,
        isLinkedToUser: true
      }

      return this.contactApi.createContact(supplier.id, contact).then(() => {
        console.log('contact created');

        if (this.props.onUpdate) {
          this.props.onUpdate({ id: supplier.id, name: supplier.name });
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
    if (!newSupplier) return;

    return this.supplierApi.createSupplier(newSupplier).then(createdSupplier => {
      this.setState({ supplier: createdSupplier });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.createSuccess'), 'info')

      return this.postSupplierCreate();
    }).
    catch(errors => {
      this.setState({ supplier: newSupplier });

      switch (errors.status) {
        case 403: case 405:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.failedCreatingUserSupplier'), 'error');
          break;
        case 401:
          this.props.onUnauthorized();
          break;
        case 409:
          this.setState({ supplierExist: true });
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.createFailed'), 'error');
      }

      return Promise.resolve(null);
    });
  }

  handleAccess = () => {
    const body = { supplierId: this.state.supplier.id, userId: this.props.user.id };

    this.accessApi.grantAccess(body).then(() => this.postSupplierCreate()).catch(errors => {
      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.createFailed'), 'error');
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
    this.accessApi.createAccess(accessAttributes).then(supplierAccess => {
      this.setState({ supplierAccess: supplierAccess, supplierExist: true, supplier: supplier });
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
        <div>{ this.context.i18n.getMessage('Supplier.Messages.unableToRender') }</div>
      );
    }

    return (
      <div className="supplier-registration-container">
        <div id='supplier-registration'>
          <h2>{this.context.i18n.getMessage('Supplier.Heading.companyRegistration')}</h2>
          {this.toRender()}
        </div>
      </div>
    );
  }
}

export default SupplierRegistrationEditor;
