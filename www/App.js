import React from 'react';
import { Route } from 'react-router';
import { Containers } from '@opuscapita/service-base-ui';
import SupplierEditor from '../src/client/components/SupplierEditor';
import SupplierRegistrationEditor from '../src/client/components/SupplierRegistrationEditor';
import SupplierAddressEditor from '../src/client/components/SupplierAddressEditor';
import SupplierContactEditor from '../src/client/components/SupplierContactEditor';
import SupplierBankEditor from '../src/client/components/SupplierBankAccountEditor';
import SupplierProfileStrength from '../src/client/components/SupplierProfileStrength';
import SupplierSearch from '../src/client/components/SupplierSearch';
import SupplierApproval from '../src/client/components/SupplierApproval';
import SupplierAutocomplete from '../src/client/components/SupplierAutocomplete';
import SupplierList from '../src/client/components/SupplierList';

const username = 'john.doe@ncc.com';
const userRoles = ['supplier-admin', 'user'];

const supplier = {
  supplierId: "hard001",
  supplierName: "Hardware AG",
};

const onboardingSupplier = {
  supplierName: "E-Farm AG",
  cityOfRegistration: "Hamburg",
  countryOfRegistration: "DE",
  taxIdentificationNo: "T-534324",
  vatIdentificationNo: "DE169838187",
  dunsNo: null,
  commercialRegisterNo: "MI342323"
};
const onboardingUser = {
  id: username,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@ncc.com',
};


let editor = (
  <SupplierEditor
    key='company'
    supplierId={supplier.supplierId}
    username={username}
    userRoles={userRoles}
  />
);

let registrationEditor = (
  <SupplierRegistrationEditor
    key='company'
    supplier={onboardingSupplier}
    user={onboardingUser}
  />
);

let addressEditor = (
  <SupplierAddressEditor
    key='address'
    supplierId={supplier.supplierId}
    username={username}
    userRoles={userRoles}
  />
);

let contactEditor = (
  <SupplierContactEditor
    key='contact'
    supplierId={supplier.supplierId}
    username={username}
    userRoles={userRoles}
  />
);

let searchEditor = (
  <SupplierSearch supplierId={supplier.supplierId} />
);

let supplierApproval = (
  <SupplierApproval supplierId={supplier.supplierId} />
);

let bankEditor = (
  <SupplierBankEditor
    key='contact'
    readOnly={false}
    supplierId={supplier.supplierId}
    username={username}
    userRoles={userRoles}
  />
);

let supplierProfileStrenth = (
  <SupplierProfileStrength supplierId={supplier.supplierId} />
);

let supplierAutocomplete = <SupplierAutocomplete />;

let list = <SupplierList onEdit={(id) => console.log(id)} onCreateUser={(id) => console.log(id)} />;

var tabData = [
  { name: 'Registration', isActive: true },
  { name: 'Editor', isActive: false },
  { name: 'Approval', isActive: false },
  { name: 'Address', isActive: false },
  { name: 'Contact', isActive: false },
  { name: 'Bank Account', isActive: false },
  { name: 'Search', isActive: false },
  { name: 'Profile Strength', isActive: false },
  { name: 'Autocomplete', isActive: false },
  { name: 'List', isActive: false }
];

class Tabs extends React.Component
{
  render() {
    return (
      <ul className="nav nav-tabs">
        {tabData.map(tab => {
          return (
            <Tab key={tab.name} data={tab} isActive={this.props.activeTab === tab} handleClick={this.props.changeTab.bind(this,tab)} />
          );
        })}
      </ul>
    );
  }
};

class Tab extends React.Component
{
  render() {
    return (
      <li onClick={this.props.handleClick} className={this.props.isActive ? "active" : null}>
        <a href="#">{this.props.data.name}</a>
      </li>
    );
  }
};

class Content extends React.Component
{
  render() {
    return (
      <div>
        {this.props.activeTab.name === 'Registration' ? registrationEditor :null}
        {this.props.activeTab.name === 'Editor' ? editor :null}
        {this.props.activeTab.name === 'Approval' ? supplierApproval :null}
        {this.props.activeTab.name === 'Address' ? addressEditor :null}
        {this.props.activeTab.name === 'Contact' ? contactEditor :null}
        {this.props.activeTab.name === 'Bank Account' ? bankEditor :null}
        {this.props.activeTab.name === 'Search' ? searchEditor :null}
        {this.props.activeTab.name === 'Profile Strength' ? supplierProfileStrenth :null}
        {this.props.activeTab.name === 'Autocomplete' ? supplierAutocomplete :null}
        {this.props.activeTab.name === 'List' ? list : null}
      </div>
    );
  }
};

class Page extends React.Component
{
  constructor(props) {
    super(props);
    this.state = { activeTab: tabData[0] };
  }

  handleClick(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    return (
      <div>
        <Tabs activeTab={this.state.activeTab} changeTab={this.handleClick.bind(this)} />
        <Content activeTab={this.state.activeTab} />
      </div>
    );
  }
};


class App extends React.Component
{
  render()
  {
    return(
      <Containers.ServiceLayout serviceName="supplier">
        <Route exact path='/' component={() => <Page /> }/>
      </Containers.ServiceLayout>
    );
  }
}

export default App;
