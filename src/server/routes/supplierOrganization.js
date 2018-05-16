const Promise = require('bluebird');
const Supplier = require('../queries/suppliers');

module.exports = function(app, db, config)
{
  return Supplier.init(db).then(() =>
  {
    app.get('/api/suppliers/:supplierId/organization', (req, res) => sendSupplierOrganization(req, res));
    app.get('/api/suppliers/:supplierId/parents', (req, res) => sendSupplierParents(req, res));
    app.get('/api/suppliers/:supplierId/children', (req, res) => sendSupplierChildren(req, res));
  });
}

let sendSupplierOrganization = async function(req, res)
{
  const motherSupplier = await Supplier.getMotherSupplier(req.params.supplierId);
  if (!motherSupplier) return res.status('404').json({ message : 'Supplier does not exist!' });

  const supplierChildren = await Supplier.all({ hierarchyId: motherSupplier.id });
  supplierChildren.unshift(motherSupplier);
  return res.json(supplierChildren);
}

let sendSupplierChildren = function(req, res)
{
  Supplier.all({ hierarchyId: req.params.supplierId }).then(suppliers => res.json(suppliers));
}

let sendSupplierParents = function(req, res)
{
  Supplier.find(req.params.supplierId).then(supplier => {
    if (!supplier) return res.status('404').json({ message : 'Supplier does not exist!' });

    if (!supplier.hierarchyId) return res.json([]);

    return Supplier.all({ id: supplier.hierarchyId.split('|').join(',') }).then(suppliers => res.json(suppliers));
  });
}
