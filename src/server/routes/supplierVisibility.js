const SupplierVisibility = require('../queries/supplier_visibility');

module.exports = function(app, db, config) {
  SupplierVisibility.init(db, config).then(() =>
  {
    app.get('/api/suppliers/:supplierId/visibility', (req, res) => sendSupplierVisibility(req, res));
    app.put('/api/suppliers/:supplierId/visibility', (req, res) => createOrUpdateSupplierVisibility(req, res));
  });
};


let sendSupplierVisibility = async function(req, res)
{
  const supplierId = req.params.supplierId;
  const visibility = await SupplierVisibility.find(supplierId);
  if (!visibility) return handleContactNotExistError(res, supplierId, req.opuscapita.logger);

  return res.json(visibility);
};

let createOrUpdateSupplierVisibility = function(req, res)
{
  return SupplierVisibility.createOrUpdate(req.params.supplierId, req.body).then(visibility => res.json(visibility)).
    catch(error => {
      req.opuscapita.logger.error('Error when updating SupplierVisibility: %s', error.message);
      return res.status('400').json({ message : error.message });
    });
};

let handleContactNotExistError = function(response, supplierId, logger) {
  const message = 'A SupplierVisibility with supplierId ' + supplierId + ' does not exist.'
  logger.error('Error when getting SupplierVisibility: %s', message);
  return response.status('404').json({ message : message });
};
