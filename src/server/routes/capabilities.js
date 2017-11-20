const Capability = require('../queries/capabilities');

module.exports = function (app, db, config) {
  Capability.init(db, config).then(() =>
  {
    app.post('/api/suppliers/:supplierId/capabilities/:capabilityId', (req, res) => createCapability(req, res));
    app.delete('/api/suppliers/:supplierId/capabilities/:capabilityId', (req, res) => deleteCapability(req, res));
  });
};

let createCapability = function(req, res)
{
  return Capability.create(req.params.supplierId, req.params.capabilityId).then(capability => res.json(capability)).
    catch(error => {
      req.opuscapita.logger.error('Error when creating Capability: %s', error.message);
      return res.status('400').json({ message: error.message })
    });
};

let deleteCapability = function(req, res)
{
  return Capability.delete(req.params.supplierId, req.params.capabilityId).then(() => res.json(null)).
    catch(error => {
      req.opuscapita.logger.error('Error when deleting Capability: %s', error.message);
      return res.status('400').json({ message: error.message })
    });
};
