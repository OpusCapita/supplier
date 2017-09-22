const Supplier2Users = require('../queries/supplier2users');
const Suppliers = require('../queries/suppliers');

module.exports = function(app, db, config) {
Promise.all([Supplier2Users.init(db, config), Suppliers.init(db, config)]).then(() =>
  {
    app.post('/api/supplier_access', (req, res) => createSupplierAccess(req, res));
    app.get('/api/supplier_access/:userId', (req, res) => sendSupplierAccess(req, res));
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
  const attributes = req.body;
  return Supplier2Users.find(attributes.userId).then(supplier2user => {
    if (supplier2user) return res.status('200').json(supplier2user);

    attributes.status = 'requested';
    return Supplier2Users.create(attributes).
      then(supplier2user => res.status('201').json(supplier2user)).
      catch(error => {
        req.opuscapita.logger.error('Error when creating Supplier2User: %s', error.message);

        return res.status('400').json({ message : error.message });
      });
  });
}
