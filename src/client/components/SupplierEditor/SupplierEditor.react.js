import React, { PropTypes, Component } from 'react';
import request from 'superagent-bluebird-promise';
import validationMessages from '../../utils/validatejs/i18n';
import i18nMessages from './i18n';
import Alert from '../Alert';
import SupplierEditorForm from './SupplierEditorForm.react.js';

/**
 * Provide general company information.
 */
class SupplierEditor extends Component {

  static propTypes = {
    actionUrl: PropTypes.string.isRequired,
    supplierId: PropTypes.string.isRequired,
    username: React.PropTypes.string.isRequired,
    dateTimePattern: PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
    onUnauthorized: React.PropTypes.func,
    onLogout: React.PropTypes.func
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired
  };

  loadSupplierPromise = null;
  updateSupplierPromise = null;

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      hasErrors: false,
      supplier: {}
    }
  }

  componentWillMount() {
    this.context.i18n.register('SupplierValidatejs', validationMessages);
    this.context.i18n.register('SupplierEditor', i18nMessages);
  }

  componentDidMount() {
    if (this.state.isLoaded) {
      return;
    }

    console.log('===== ABOUT TO REQUEST a PROMISE');
    this.loadSupplierPromise = request.
      get(`${this.props.actionUrl}/supplier/api/suppliers/${encodeURIComponent(this.props.supplierId)}`).
      set('Accept', 'application/json').
      promise();

    this.loadSupplierPromise.then(response => {
      this.setState({
        isLoaded: true,
        supplier: response.body
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

  componentWillUnmount() {
    if (!this.state.isLoaded) {
      if (this.loadSupplierPromise) {
        this.loadSupplierPromise.cancel();
      }
      if (this.updateSupplierPromise) {
        this.updateSupplierPromise.cancel();
      }
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

    this.updateSupplierPromise = request.put(`${this.props.actionUrl}/supplier/api/suppliers/${encodeURIComponent(this.props.supplierId)}`).
      set('Accept', 'application/json').
      send(newSupplier).
      promise();

    return this.updateSupplierPromise.
      then(response => {
        this.setState({
          supplier: response.body
        });

        if(this.context.showNotification)
          this.context.showNotification(this.context.i18n.getMessage('SupplierEditor.Messages.saved'), 'info')

        if (this.props.onUpdate && this.props.supplierId !== response.body.supplierId) {
          // Informing wrapper app (BNP/SIM) about supplier change.
          this.props.onUpdate({
            supplierId: response.body.supplierId,
            supplierName: response.body.supplierName
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
