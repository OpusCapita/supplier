import React, { PropTypes, Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from '../../i18n';
import SupplierEditorForm from './SupplierEditorForm.react.js';
import SupplierView from './SupplierView.react.js';
import { Supplier } from '../../api';
import UserAbilities from '../../UserAbilities';

/**
 * Provide general company information.
 */
class SupplierEditor extends Component {

  static propTypes = {
    supplierId: PropTypes.string.isRequired,
    username: React.PropTypes.string.isRequired,
    userRoles: React.PropTypes.array.isRequired,
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
      isLoaded: false,
      hasErrors: false,
      supplier: {}
    };

    this.supplierApi = new Supplier();
    this.userAbilities = new UserAbilities(props.userRoles);
  }

  componentWillMount() {
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('Supplier', i18nMessages);
  }

  componentDidMount() {
    if (this.state.isLoaded) {
      return;
    }

    this.supplierApi.getSupplier(this.props.supplierId).then(supplier => {
      this.setState({
        isLoaded: true,
        supplier: supplier
      });
    }).
    catch(errors => {
      if (errors.status === 401) {
        this.props.onUnauthorized();
        return;
      }

      this.setState({
        isLoaded: true,
        hasErrors: true,
      });
    });

    return;
  }

  componentWillReceiveProps(nextProps, nextContext) {

    if(nextContext.i18n){
      nextContext.i18n.register('SupplierValidatejs', validationMessages);
      nextContext.i18n.register('Supplier', i18nMessages);
    }
  }

  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange({ isDirty: true });
    }
  }

  handleUpdate = newSupplier => {
    if (!newSupplier) {
      return this.setState({
        globalInfoMessage: '',
        globalErrorMessage: '',
      });
    }

    newSupplier = {  // eslint-disable-line no-param-reassign
      ...newSupplier,
      changedBy: this.props.username
    };

    delete newSupplier.changedOn;  // eslint-disable-line no-param-reassign
    delete newSupplier.createdOn;  // eslint-disable-line no-param-reassign

    return this.supplierApi.updateSupplier(this.props.supplierId, newSupplier).then(supplier => {
      this.setState({ supplier: supplier });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.updateSaved'), 'info')

      if (this.props.onUpdate && this.props.supplierId !== supplier.id) {
        this.props.onUpdate({ id: supplier.id, name: supplier.name });
      }

      if (this.props.onChange) {
        this.props.onChange({ isDirty: false });
      }
    }).
    catch(errors => {
      switch (errors.status) {
        case 401:
          this.props.onUnauthorized();
          break;
        case 409:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.failedCreatingExistingSupplier'), 'error')
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.updateFailed'), 'error')
      }
    });
  }

  renderSupplierView() {
    return <div className="col-sm-6">
      <h4 className="tab-description">
        { this.context.i18n.getMessage(`Supplier.Heading.companyInformation`) }
      </h4>
      <SupplierView supplier={ this.state.supplier } />
    </div>;
  }

  render() {
    const { isLoaded, hasErrors, globalInfoMessage = '', globalErrorMessage = '' } = this.state;

    if (!isLoaded) {
      return (
        <div>{ this.context.i18n.getMessage('Supplier.Messages.loading') }</div>
      );
    }

    if (hasErrors) {
      return (
        <div>{ this.context.i18n.getMessage('Supplier.Messages.unableToRender')  } <a className="btn btn-link" href="/bnp/supplierRegistration">{this.context.i18n.getMessage('SupplierEditor.Messages.register')}</a> </div>
      );
    }

    if (!this.userAbilities.canEditSupplier()) return <div className="row">{this.renderSupplierView()}</div>;

    return (
      <div className="row">
        <div className="col-sm-6">
          <h4 className="tab-description">
            { this.context.i18n.getMessage(`Supplier.Heading.companyInformation`) }
          </h4>
          <SupplierEditorForm
            {...this.props}
            supplier={ this.state.supplier }
            onSupplierChange={ this.handleUpdate }
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
          <br />
          <p>
            {this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.text')}
            <ul>
              <li>{this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.de')}</li>
              <li>{this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.fi')}</li>
              <li>{this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.se')}</li>
              <li>{this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.ch')}</li>
              <li>{this.context.i18n.getMessage('Supplier.Messages.companyRegisterNumber.us')}</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }
}

export default SupplierEditor;
