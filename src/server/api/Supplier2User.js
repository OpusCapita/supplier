class Supplier2User {
  constructor(db) {
    this.supplier2User = db.models.Supplier2User;
  }

  all(supplierId) {
    return this.supplier2User.findAll({ where: { supplierId: supplierId } });
  }

  find(userId) {
    return this.supplier2User.findOne({ where: { userId: userId } });
  }

  create(supplier2user) {
    return this.supplier2User.create(supplier2user);
  }

  update(id, supplier2user) {
    const attributes = { status: supplier2user.status };
    const userId = supplier2user.userId;
    return this.supplier2User.update(attributes, { where: { id: id }}).then(() => this.find(userId));
  }

  delete(supplierId) {
    return this.supplier2User.destroy({ where: { supplierId: supplierId } }).then(() => null);
  }

  exists(id) {
    return this.supplier2User.findOne({ where: { id: id }}).then(supplier2user => Boolean(supplier2user));
  }
};

module.exports = Supplier2User;
