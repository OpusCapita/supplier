import React, { PropTypes, Component } from 'react';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from '../../i18n';
import BusinessPartnerForm from './BusinessPartnerForm.react.js';
import BusinessPartnerView from './BusinessPartnerView.react.js';
import { BusinessPartner } from '../../api';
import UserAbilities from '../../UserAbilities';

/**
 * Provide general company information.
 */
class BusinessPartner extends Component {

  static propTypes = {
    businessPartnerId: PropTypes.string.isRequired,
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
      businessPartner: {}
    };

    this.api = new BusinessPartner();
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

    this.api.find(this.props.businessPartnerId).then(businessPartner => {
      this.setState({
        isLoaded: true,
        businessPartner: businessPartner
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

  handleUpdate = newBusinessPartner => {
    if (!newBusinessPartner) {
      return this.setState({
        globalInfoMessage: '',
        globalErrorMessage: '',
      });
    }

    newBusinessPartner = {  // eslint-disable-line no-param-reassign
      ...newBusinessPartner,
      changedBy: this.props.username
    };

    delete newBusinessPartner.changedOn;  // eslint-disable-line no-param-reassign
    delete newBusinessPartner.createdOn;  // eslint-disable-line no-param-reassign

    return this.api.update(this.props.businessPartnerId, newBusinessPartner).then(businessPartner => {
      this.setState({ businessPartner: businessPartner });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('Supplier.Messages.updateSaved'), 'info')

      if (this.props.onUpdate && this.props.businessPartnerId !== businessPartner.id) {
        this.props.onUpdate({ id: businessPartner.id, name: businessPartner.name });
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

  renderBusinessPartnerView() {
    return <div className="col-sm-6">
      <h4 className="tab-description">
        { this.context.i18n.getMessage(`Supplier.Heading.companyInformation`) }
      </h4>
      <BusinessPartnerView businessPartner={ this.state.businessPartner } />
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

    if (!this.userAbilities.canEditSupplier()) return <div className="row">{this.renderBusinessPartnerView()}</div>;

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
        </div>
      </div>
    );
  }
}

export default BusinessPartner;
