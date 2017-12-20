import React from 'react';
import { Route } from 'react-router';
import Layout from './layout';
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
import SupplierPublic from '../src/client/components/SupplierPublic/SupplierPublic';

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

let supplierPublic = (
  <SupplierPublic supplierId={supplier.supplierId}/>
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

const activeStyle = {color:' #ffffff', background: '#006677'};

const App = () => (
  <Containers.ServiceLayout serviceName="user">
    <Route exact path='/supplier' render={() => bankEditor }/>
  </Containers.ServiceLayout>
);

/*const App = () => (
  <Layout>
    <ul className="nav nav-tabs">
      <li><NavLink exact activeStyle={activeStyle} to='/supplier'>Supplier</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/search'>Supplier Search</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/public'>Supplier Public</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/approval'>Supplier Approval</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/registration'>Supplier Registration</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/address'>Supplier Address</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/contact'>Supplier Contact</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/bank'>Supplier Bank</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/profile_strength'>Supplier Profile Strength</NavLink></li>
      <li><NavLink activeStyle={activeStyle} to='/supplier/autocomplete'>Supplier Autocomplete</NavLink></li>
    </ul>
    <Route exact path='/supplier' render={() => editor }/>
    <Route exact path='/supplier/search' render={() => searchEditor }/>
    <Route exact path='/supplier/public' render={() => supplierPublic }/>
    <Route exact path='/supplier/approval' render={() => supplierApproval }/>
    <Route exact path='/supplier/registration' render={() => registrationEditor }/>
    <Route exact path='/supplier/address' render={() => addressEditor }/>
    <Route exact path='/supplier/contact' render={() => contactEditor }/>
    <Route exact path='/supplier/bank' render={() => bankEditor }/>
    <Route exact path='/supplier/profile_strength' render={() => supplierProfileStrenth }/>
    <Route exact path='/supplier/autocomplete' render={() => supplierAutocomplete }/>
  </Layout>
);*/

export default App;
