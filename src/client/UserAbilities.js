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

  actionGroupForContacts() {
    return this.abilitiesForRole['contact']['actions'].reduce((accumulator, action) => {
      if (action !== 'add') return accumulator.concat(action);

      return accumulator;
    }, []);
  }


}

export default UserAbilities;
