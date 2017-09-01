const Supplier2Users = require('../queries/supplier2users');
const Suppliers = require('../queries/suppliers');

module.exports = function(app, db, config) {
Promise.all([Supplier2Users.init(db, config), Suppliers.init(db, config)]).then(() =>
  {
    app.post('/api/supplier_access/:userId', (req, res) => createSupplierAccess(req, res));
    app.get('/api/supplier_access/:userId', (req, res) => sendSupplierAccess(req, res));
    app.put('/api/supplier_access/:userId', (req, res) => updateSupplierAccess(req, res));
  });
};

let sendSupplierAccess = function(req, res)
{
  return Supplier2Users.find(req.params.userId).then(supplier2user => {
    if (!supplier2user) return res.status('404').json({ message: 'Supplier2User not found' });

    return res.json(supplier2user);
  });
};

let createSupplierAccess = function(req, res)
{
  return Suppliers.searchRecord(req.body).then(supplier => {
    if (!supplier) return res.status('404').json({ message: 'Supplier not found' });

    const userId = req.params.userId;
    return Supplier2Users.find(userId).then(supplier2user => {
      if (supplier2user) return res.status('200').json(supplier2user);

      const record = { userId: userId, supplierId: supplier.supplierId, status: 'requested' };
      return Supplier2Users.create(record).then(supplier2user => res.status('201').json(supplier2user));
    });
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when creating Supplier2Users: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
}

let updateSupplierAccess = function(req, res)
{
  let userId = req.params.userId;
  return Supplier2Users.find(userId).then(supplier2user =>
  {
    if(supplier2user)
    {
      const record = { status: req.body.status };
      return Supplier2Users.update(userId, record).then(supplier2user => res.status('200').json(supplier2user));
    } else {
      const message = 'A supplier2user with this ID does not exist.'
      req.opuscapita.logger.error('Error when updating Supplier2Users: %s', message);
      return res.status('404').json({ message : message });
    }
  })
  .catch(error => {
    req.opuscapita.logger.error('Error when updating Supplier2Users: %s', error.message);
    return res.status('400').json({ message : error.message });
  });
}
