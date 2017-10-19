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


}

export default UserAbilities;
