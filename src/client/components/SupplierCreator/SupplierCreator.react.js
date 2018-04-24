import React, { PropTypes, Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from '../../i18n';
import SupplierCreatorForm from './SupplierCreatorForm.react.js';
import { Supplier, Auth, Contact } from '../../api';
import UserAbilities from '../../UserAbilities';

/**
 * Provide general company information.
 */
class SupplierCreator extends Component {

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
      supplier: {}
    }

    this.supplierApi = new Supplier();
    this.authApi = new Auth();
    this.contactApi = new Contact();
    this.userAbilities = new UserAbilities(props.userRoles);
  }

  componentWillMount(){
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('Supplier', i18nMessages);
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

    newSupplier = {  // eslint-disable-line no-param-reassign
      ...newSupplier,
      createdBy: this.props.user.id,
      changedBy: this.props.user.id
    };

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

  renderAction() {
    if (this.userAbilities.canCreateSupplier()) {
      return (<SupplierCreatorForm
                {...this.props}
                supplier={ this.state.supplier }
                onSupplierChange={ this.handleUpdate }
                onChange={ this.handleChange }
                onCancel={ this.props.onLogout }
              />);
    }

    return <div className="alert alert-danger">{this.context.i18n.getMessage('Supplier.Error.notAuthorized')}</div>;
  }

  render() {
    const { hasErrors } = this.state;

    if (hasErrors) {
      return (
        <div>{ this.context.i18n.getMessage('Supplier.Messages.unableToRender') }</div>
      );
    }

    return (
      <div className="row">
        <div className="col-sm-6">
          <h4 className="tab-description">
            { this.context.i18n.getMessage(`Supplier.Heading.createSupplier`) }
          </h4>
          {this.renderAction()}
        </div>
      </div>
    );
  }
}

export default SupplierCreator;
