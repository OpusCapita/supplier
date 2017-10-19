import React, { PropTypes, Component } from 'react';
import request from 'superagent-bluebird-promise';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from './i18n';
import SupplierEditorForm from './SupplierEditorForm.react.js';
import { Supplier } from '../../api';

/**
 * Provide general company information.
 */
class SupplierEditor extends Component {

  static propTypes = {
    supplierId: PropTypes.string.isRequired,
    username: React.PropTypes.string.isRequired,
    dateTimePattern: PropTypes.string.isRequired,
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
    }

    this.supplierApi = new Supplier();
  }

  componentWillMount() {
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('SupplierEditor', i18nMessages);
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
      nextContext.i18n.register('SupplierEditor', i18nMessages);
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
        this.context.showNotification(this.context.i18n.getMessage('SupplierEditor.Messages.saved'), 'info')

      if (this.props.onUpdate && this.props.supplierId !== supplier.supplierId) {
        // Informing wrapper app (BNP/SIM) about supplier change.
        this.props.onUpdate({
          supplierId: supplier.supplierId,
          supplierName: supplier.supplierName
        });
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
        case 403:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('SupplierEditor.Messages.failedModifyingNotAuthoredSupplier'), 'error')
          break;
        case 409:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('SupplierEditor.Messages.failedCreatingExistingSupplier'), 'error')
          break;
        default:
          if(this.context.showNotification)
            this.context.showNotification(this.context.i18n.getMessage('SupplierEditor.Messages.failed'), 'error')
      }
    });
  }

  render() {
    const { isLoaded, hasErrors, supplier, globalInfoMessage = '', globalErrorMessage = '' } = this.state;

    if (!isLoaded) {
      return (
        <div>{ this.context.i18n.getMessage('SupplierEditor.Messages.loading') }</div>
      );
    }

    if (hasErrors) {
      return (
        <div>{ this.context.i18n.getMessage('SupplierEditor.Messages.unableToRender')  } <a className="btn btn-link" href="/bnp/supplierRegistration">{this.context.i18n.getMessage('SupplierEditor.Messages.register')}</a> </div>
      );
    }

    return (
      <div className="row">
        <div className="col-sm-6">

          <SupplierEditorForm
            {...this.props}
            supplier={ supplier }
            onSupplierChange={ this.handleUpdate }
            onChange={ this.handleChange }
            onCancel={ this.props.onLogout }
          />
        </div>
      </div>
    );
  }
}

export default SupplierEditor;
