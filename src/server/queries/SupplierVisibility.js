class SupplierVisibility {
  constructor(db) {
    this.supplierVisibility = db.models.SupplierVisibility;
  }

  async createOrUpdate(supplierId, attributes) {
    let visibility = await this.find(supplierId);
    if (!visibility) visibility = this.supplierVisibility.build({ supplierId: supplierId });

    if (attributes.contacts) visibility.contacts = attributes.contacts;
    if (attributes.bankAccounts) visibility.bankAccounts = attributes.bankAccounts;

    return visibility.save().then(() => this.find(supplierId));
  }

  find(supplierId) {
    return this.supplierVisibility.findOne({ where: { supplierId: supplierId }});
  }

  delete(supplierId) {
    return this.supplierVisibility.destroy({ where: { supplierId: supplierId } }).then(() => null);
  }
};

module.exports = SupplierVisibility;
