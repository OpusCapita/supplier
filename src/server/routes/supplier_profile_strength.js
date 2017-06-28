const Supplier = require('../queries/suppliers');
const SupplierAddress = require('../queries/supplier_addresses');
const SupplierContact = require('../queries/supplier_contacts');
const SupplierBankAccount = require('../queries/supplier_bank_accounts');
const _ = require('underscore');

module.exports = function(app, db, config) {
  app.get('/api/suppliers/:supplierId/profile_strength', (req, res) => {
    Promise.all([
      Supplier.init(db, config).then(() => Supplier.find(req.params.supplierId)),
      SupplierAddress.init(db, config).then(() => SupplierAddress.all(req.params.supplierId)),
      SupplierContact.init(db, config).then(() => SupplierContact.all(req.params.supplierId)),
      SupplierBankAccount.init(db, config).then(() => SupplierBankAccount.all(req.params.supplierId))
    ]).
    then(([supplier, addresses, contacts, bankAccounts]) => {
      let suppliers = [];
      if (!_.isEmpty(supplier)) suppliers = [supplier];
      const recordsArray = [suppliers, addresses, contacts, bankAccounts];

      const averages = _.map(recordsArray, (records) => {
        if (_.isEmpty(records)) return 0;

        const sum = records.length;

        return _.reduce(records, (memo, record) => { return memo + recordAverage(record); }, 0) / sum;
      });

      const average = _.reduce(averages, (memo, num) => { return memo + num; }, 0) / recordsArray.length;
      return res.json(Math.round(average * 100));
    });
  });
}

function recordAverage(record) {
  const dataValues = _.values(record.dataValues);
  return _.filter(dataValues, (num) => !_.isNull(num)).length / dataValues.length;
}
