import React, { PropTypes, Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from '../../i18n';
import SupplierCreatorForm from './SupplierCreatorForm.react.js';
import { Supplier } from '../../api';
import UserAbilities from '../../UserAbilities';

/**
 * Provide general company information.
 */
class SupplierCreator extends Component {

  static propTypes = {
    user: PropTypes.object.isRequired,
    supplier: PropTypes.object,
    onChange: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func,
    onLogout: React.PropTypes.func
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { hasErrors: false, supplier: {} };
    this.supplierApi = new Supplier();
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

  handleChange = () => {
    if (this.props.onChange) this.props.onChange({ isDirty: true });
  }

  handleUpdate = newSupplier => {
    if (!newSupplier) return;

    newSupplier = {
      ...newSupplier,
      createdBy: this.props.user.id,
      changedBy: this.props.user.id
    };

    return this.supplierApi.createSupplier(newSupplier).then(createdSupplier => {
      this.setState({ supplier: createdSupplier });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.createSuccess'), 'info')

      if (this.props.onCreate) this.props.onCreate(createdSupplier.id);
    }).
    catch(errors => {
      switch (errors.status) {
        case 401:
          this.props.onUnauthorized();
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.createFailed'), 'error');
      }

      return Promise.resolve(null);
    });
  }

  render() {
    const { hasErrors } = this.state;

    if (hasErrors) {
      return (
        <div>{ this.context.i18n.getMessage('Supplier.Messages.unableToRender') }</div>
      );
    }

    if (!this.userAbilities.canCreateSupplier())
      return <div className="alert alert-danger">{this.context.i18n.getMessage('Supplier.Error.notAuthorized')}</div>;

    return (
      <div className="row">
        <div className="col-sm-6">
          <h4 className="tab-description">
            { this.context.i18n.getMessage(`Supplier.Heading.createSupplier`) }
          </h4>
          <SupplierCreatorForm
            {...this.props}
            supplier={ this.state.supplier }
            onSupplierCreate={ this.handleUpdate }
            onChange={ this.handleChange }
            onCancel={ this.props.onLogout }
          />
        </div>
        <div className="col-sm-6">
          <br />
          <br />
          <br />
          <br />
          <p>{this.context.i18n.getMessage('Supplier.Messages.identifierRequired')}</p>
        </div>
      </div>
    );
  }
}

export default SupplierCreator;
