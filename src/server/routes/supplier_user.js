const SupplierUser = require('../queries/supplier_user');

module.exports = function(app, db, config) {
SupplierUser.init(db, config).then(() =>
  {
    app.get('/api/suppliers/getSupplierAccess', (req, res) => getSupplierAccess(req, res));
  });
};

let getSupplierAccess = function(req, res)
{
  SupplierUser.getSupplierAccess().then(requests =>
  {
    res.json(requests);
  });
};
