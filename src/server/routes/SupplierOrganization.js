const SupplierApi = require('../api/Supplier');

class SupplierOrganization {
  constructor(app, db) {
    this.app = app;
    this.supplierApi = new SupplierApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:supplierId/organization', (req, res) => this.organization(req, res));
    this.app.get('/api/suppliers/:supplierId/parents', (req, res) => this.parents(req, res));
    this.app.get('/api/suppliers/:supplierId/children', (req, res) => this.children(req, res));
  }

  async organization(req, res) {
    const motherSupplier = await this.supplierApi.findMother(req.params.supplierId);
    if (!motherSupplier) return res.status('404').json({ message : 'Supplier does not exist!' });

    const supplierChildren = await this.supplierApi.all({ hierarchyId: motherSupplier.id });
    supplierChildren.unshift(motherSupplier);
    return res.json(supplierChildren);
  }

  async parents(req, res) {
    const supplier = await this.supplierApi.find(req.params.supplierId);
    if (!supplier) return res.status('404').json({ message : 'Supplier does not exist!' });

    if (!supplier.hierarchyId) return res.json([]);

    return this.supplierApi.all({ id: supplier.hierarchyId.split('|').join(',') }).then(suppliers => res.json(suppliers));
  }

  children(req, res) {
    return this.supplierApi.all({ hierarchyId: req.params.supplierId }).then(suppliers => res.json(suppliers));
  }
};

module.exports = SupplierOrganization;
