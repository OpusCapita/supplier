class Capability {
  constructor(db) {
    this.capability = db.models.Capability;
  }

  create(supplierId, capabilityId) {
    return this.capability.findOrCreate(query(supplierId, capabilityId)).spread((capability, created) => capability);
  }

  delete(supplierId, capabilityId) {
    return this.capability.destroy(query(supplierId, capabilityId)).then(() => null);
  }
};

let query = function(supplierId, capabilityId)
{
  let dbQuery = { supplierId: supplierId };
  if (capabilityId) dbQuery.capabilityId = capabilityId;
  return { where: dbQuery };
}

module.exports = Capability;
