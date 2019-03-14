class SupplierAddress {
  constructor(db) {
    this.supplierAddress = db.models.SupplierAddress;
  }

  all(supplierId) {
    return this.supplierAddress.findAll({ where: { supplierId: supplierId } });
  }

  find(supplierId, addressId) {
    return this.supplierAddress.findOne({ where: { supplierId: supplierId, id: addressId } });
  }

  create(address) {
    return this.supplierAddress.max('id').then(id => {
      address.id = id + 1;
      return this.supplierAddress.create(address);
    });
  }

  update(supplierId, addressId, address) {
    return this.supplierAddress.update(address, { where: { id: addressId } }).then(() => {
      return this.find(supplierId, addressId);
    });
  }

  delete(supplierId, addressId) {
    let deleteQuery = { supplierId: supplierId };
    if (addressId) deleteQuery.id = addressId;
    return this.supplierAddress.destroy({ where: deleteQuery }).then(() => null);
  }

  exists(supplierId, addressId) {
    return this.find(supplierId, addressId).then(address => Boolean(address));
  }
};

module.exports = SupplierAddress;
