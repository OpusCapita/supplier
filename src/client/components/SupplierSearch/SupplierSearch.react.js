import React, { Component, PropTypes } from 'react';
import i18nMessages from './i18n';
import SupplierExistsView from '../SupplierRegistrationEditor/SupplierExistsView.react';

export default class SupplierSearch extends Component {

  static propTypes = {

  };

  static defaultProps = {

  };

  static contextTypes = {
    i18n : React.PropTypes.object.isRequired,
    showNotification: React.PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  toRender() {
      return <SupplierExistsView i18n={this.context.i18n} onBack={ this.handleBackToForm }/>
  }

  render() {
    return (<div className="container supplier-registration-container">
          <div className='box' id='supplier-registration'>
            <p>{this.context.i18n.getMessage('SupplierSearch.Messages.created')}</p>
            { this.toRender() }
          </div>
        </div>)
  }
}