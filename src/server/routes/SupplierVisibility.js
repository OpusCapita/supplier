const SupplierVisibilityApi = require('../queries/SupplierVisibility');

class SupplierVisibility {
  constructor(app, db) {
    this.app = app;
    this.supplierVisibilityApi = new SupplierVisibilityApi(db);
  }

  init() {
    this.app.get('/api/suppliers/:supplierId/visibility', (req, res) => this.show(req, res));
    this.app.put('/api/suppliers/:supplierId/visibility', (req, res) => this.createOrUpdate(req, res));
  }

  async show(req, res) {
    const supplierId = req.params.supplierId;
    const visibility = await this.supplierVisibilityApi.find(supplierId);
    if (!visibility) return handleContactNotExistError(res, supplierId, req.opuscapita.logger);

    return res.json(visibility);
  }

  createOrUpdate(req, res) {
    return this.supplierVisibilityApi.createOrUpdate(req.params.supplierId, req.body).then(visibility => res.json(visibility)).
      catch(error => {
        req.opuscapita.logger.error('Error when updating SupplierVisibility: %s', error.message);
        return res.status('400').json({ message : error.message });
      });
  }
};

let handleContactNotExistError = function(response, supplierId, logger) {
  const message = 'A SupplierVisibility with supplierId ' + supplierId + ' does not exist.'
  logger.error('Error when getting SupplierVisibility: %s', message);
  return response.status('404').json({ message : message });
};

module.exports = SupplierVisibility;
