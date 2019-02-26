const CapabilityApi = require('../queries/Capability');

class Capability {
  constructor(app, db) {
    this.app = app;
    this.capabilityApi = new CapabilityApi(db);
  }

  init() {
    this.app.post('/api/suppliers/:supplierId/capabilities/:capabilityId', (req, res) => this.create(req, res));
    this.app.delete('/api/suppliers/:supplierId/capabilities/:capabilityId', (req, res) => this.delete(req, res));
  }

  create(req, res) {
    return this.capabilityApi.create(req.params.supplierId, req.params.capabilityId).then(capability => res.json(capability)).
      catch(error => {
        req.opuscapita.logger.error('Error when creating Capability: %s', error.message);
        return res.status('400').json({ message: error.message })
      });
  }

  delete(req, res) {
    return this.capabilityApi.delete(req.params.supplierId, req.params.capabilityId).then(() => res.json(null)).
      catch(error => {
        req.opuscapita.logger.error('Error when deleting Capability: %s', error.message);
        return res.status('400').json({ message: error.message })
      });
  }
};

module.exports = Capability;
