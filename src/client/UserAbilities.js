import abilities from './data/userAbilities';

class UserAbilities {
  constructor(roles) {
    if (roles.includes('supplier-admin')) {
      this.abilitiesForRole = abilities['supplier-admin'];
    } else {
      this.abilitiesForRole = abilities['supplier'];
    }
  }

  canEditSupplier() {
    return this.abilitiesForRole['supplier']['actions'].includes('edit');
  }

  canCreateBankAccount() {
    return this.abilitiesForRole['bankAccount']['actions'].includes('add');
  }

  actionGroupForContacts() {
    return this._actionGroup('contact');
  }

  actionGroupForAddresses() {
    return this._actionGroup('address');
  }

  actionGroupForBankAccounts() {
    return this._actionGroup('bankAccount');
  }

  _actionGroup(model) {
    return this.abilitiesForRole[model]['actions'].reduce((accumulator, action) => {
      if (action !== 'add') return accumulator.concat(action);

      return accumulator;
    }, []);
  }
}

export default UserAbilities;
