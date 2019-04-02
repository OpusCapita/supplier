class UserData {
  constructor(req) {
    this.roles = req.opuscapita.userData('roles');
    this.id = req.opuscapita.userData('id');
    this.supplierId = req.opuscapita.userData('supplierId');
    this.customerId = req.opuscapita.userData('customerId');
  }

  hasAdminRole() {
    return this.roles.some(rol => rol === 'admin' || rol.match('svc_'));
  }

  hasSupplierRole() {
    return this.roles.some(rol => rol.match('supplier'));
  }
};

module.exports = UserData;
