const SupplierApi = require('../queries/Supplier');

module.exports = function(app, db, config) {
  app.get('/api/suppliers/:supplierId/profile_strength', (req, res) => {
    const supplierApi = new SupplierApi(db);

    supplierApi.find(req.params.supplierId, ['contacts', 'bankAccounts', 'addresses']).then(supplier => {
      if (!supplier) return res.json(0);

      const averages = recordsArray(supplier).map(records => {
        if (records.length === 0) return 0;

        return records.reduce((sum, record) => { return sum + recordAverage(record); }, 0) / records.length;
      });

      const average = averages.reduce((sum, num) => { return sum + num; }, 0) / averages.length;

      res.opuscapita.setNoCache();
      return res.json(Math.round(average * 100));
    });
  });
};

let recordsArray = function(supplier) {
  const addresses = supplier.addresses ? supplier.addresses.map(record => record.dataValues) : [];
  const contacts = supplier.contacts ? supplier.contacts.map(record => record.dataValues) : [];
  const bankAccounts = supplier.bankAccounts ? supplier.bankAccounts.map(record => record.dataValues) : [];

  delete supplier.addresses;
  delete supplier.contacts;
  delete supplier.bankAccounts;

  return [[supplier], addresses, contacts, bankAccounts];
}

let recordAverage = function(record) {
  let recordAttributes = Object.keys(record);
  return recordAttributes.filter(attr => Boolean(record[attr])).length / recordAttributes.length;
};
