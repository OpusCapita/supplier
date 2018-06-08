import React, { PropTypes, Component } from 'react';
import i18nMessages from '../../i18n';
import SupplierVisibilityForm from './SupplierVisibilityForm.react.js';
import { Visibility } from '../../api';

class SupplierVisibilityPreference extends Component {
  static propTypes = {
    supplierId: PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { isLoaded: false, hasErrors: false, visibility: {} };

    this.visibilityApi = new Visibility();
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
      this.setState({ supplier: supplier });

      if(this.context.showNotification)
        this.context.showNotification(this.context.i18n.getMessage('Supplier.Visibility.Messages.updateSaved'), 'info')
    });
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
        <button className='btn btn-default pull-right' onClick={() => null} >
          {this.context.i18n.getMessage('Supplier.Button.publicProfile')}
        </button>
        <h4 className="tab-description">
          { this.context.i18n.getMessage(`Supplier.Heading.visibility`) }
        </h4>
        <div className="row">
          <div className="col-sm-6">
          </div>
        </div>
      </div>
    );
  }

};

export default SupplierVisibilityPreference;
