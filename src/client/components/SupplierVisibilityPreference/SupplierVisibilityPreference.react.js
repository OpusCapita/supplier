import React, { PropTypes } from 'react';
import i18nMessages from '../../i18n';
import SupplierVisibilityForm from './SupplierVisibilityForm.react.js';
import { Components } from '@opuscapita/service-base-ui';
import { Visibility } from '../../api';
import SupplierPublic from '../SupplierPublic/SupplierPublic.react';

class SupplierVisibilityPreference extends Components.ContextComponent {
  static propTypes = {
    supplierId: PropTypes.string.isRequired,
    onChange: React.PropTypes.func
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { isLoaded: false, hasErrors: false, visibility: {} };

    this.visibilityApi = new Visibility();
    this.supplierPublicModal = null;
  }

  componentWillMount() {
    this.context.i18n.register('Supplier', i18nMessages);
  }

  componentDidMount() {
    if (this.state.isLoaded) return;

    this.visibilityApi.get(this.props.supplierId).then(visibility => {
      this.setState({ isLoaded: true, visibility: visibility });
    }).catch(errors => this.setState({ isLoaded: true }));
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.i18n) nextContext.i18n.register('Supplier', i18nMessages);
  }

  handleUpdate = newVisibility => {
    if(!newVisibility) return;

    const supplierId = this.props.supplierId;
    newVisibility.supplierId = supplierId;

    return this.visibilityApi.createOrUpdate(supplierId, newVisibility).then(visibility => {
      this.setState({ visibility: visibility });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('Supplier.Visibility.Message.updateSaved'), 'info')
    });
  }

  handleShowPublicProfile(supplierId) {
    this.supplierPublicModal.show(this.context.i18n.getMessage('Supplier.Heading.companyInformation'), undefined, null, {});
  }

  render() {
    const { isLoaded } = this.state;

    if (!isLoaded) {
      return (
        <div>{ this.context.i18n.getMessage('Supplier.Messages.loading') }</div>
      );
    }

    return (
      <div>
        <button className='btn btn-default pull-right' onClick={this.handleShowPublicProfile.bind(this, this.props.supplierId)} >
          {this.context.i18n.getMessage('Supplier.Button.publicProfile')}
        </button>
        <h4 className="tab-description">
          { this.context.i18n.getMessage(`Supplier.Heading.visibility`) }
        </h4>
        <div className="row">
          <div className="col-sm-6">
            <SupplierVisibilityForm
              visibility={ this.state.visibility }
              onUpdate={ this.handleUpdate }
            />
          </div>
        </div>
        <Components.ModalDialog ref={node => this.supplierPublicModal = node} size='large'>
          <SupplierPublic supplierId={this.props.supplierId} public={true}/>
        </Components.ModalDialog>
      </div>
    );
  }

};

export default SupplierVisibilityPreference;
