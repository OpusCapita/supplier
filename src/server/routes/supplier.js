/**
* @api {get} /api/suppliers Get all suppliers
* @apiName GetSuppliers
* @apiGroup Supplier
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* [
*  {
*    "supplierId":"hard001",
*    "supplierName":"jCatalog",
*    "foundedOn":"2015-10-04T22:00:00.000Z",
*    "legalForm":"KG",
*    "registrationNumber":"MI651355",
*    "cityOfRegistration":"Dortmund",
*    "countryOfRegistration":"Germany",
*    "taxId":"1234567",
*    "vatRegNo":null,
*    "globalLocationNo":"123",
*    "homePage":"http://jcatalog.com/",
*    "dunsNo":null,
*    "createdOn":"2016-02-19T10:45:26.000Z",
*    "changedOn":"2016-02-19T10:45:26.000Z",
*    "changedBy":"jcadmin",
*    "createdBy":"jcadmin"
*   }
* ]
*/

/**
* @api {put} /api/suppliers/:supplierId Update Supplier
* @apiName UpdateSupplier
* @apiGroup Supplier
*
* @apiParam {String} supplierId Unique of Supplier identity
*
* @apiParamExample {json} Request-Example:
*  {
*   "supplierId":"hard001",
*   "supplierName":"jCatalog",
*   "foundedOn":"2015-10-04T22:00:00.000Z",
*   "legalForm":"KG",
*   "registrationNumber":"MI651355",
*   "cityOfRegistration":"Dortmund",
*   "countryOfRegistration":"Germany",
*   "taxId":"1234567",
*   "vatRegNo":null,
*   "globalLocationNo":"123",
*   "homePage":"http://jcatalog.com/",
*   "dunsNo":null,
*   "createdOn":"2016-02-19T10:45:26.000Z",
*   "changedOn":"2016-02-19T10:45:26.000Z",
*   "changedBy":"jcadmin",
*   "createdBy":"jcadmin"
*  }
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*   "supplierId":"hard001",
*   "supplierName":"jCatalog",
*   "foundedOn":"2015-10-04T22:00:00.000Z",
*   "legalForm":"KG",
*   "registrationNumber":"MI651355",
*   "cityOfRegistration":"Dortmund",
*   "countryOfRegistration":"Germany",
*   "taxId":"1234567",
*   "vatRegNo":null,
*   "globalLocationNo":"123",
*   "homePage":"http://jcatalog.com/",
*   "dunsNo":null,
*   "createdOn":"2016-02-19T10:45:26.000Z",
*   "changedOn":"2016-02-19T10:45:26.000Z",
*   "changedBy":"jcadmin",
*   "createdBy":"jcadmin"
*   }
*/

/**
* @api {post} /api/suppliers Insert new Supplier
* @apiName InsertSupplier
* @apiGroup Supplier
*
* @apiParamExample {json} Request-Example:
*  {
*   "supplierId":"hard001",
*   "supplierName":"jCatalog",
*   "foundedOn":"2015-10-04T22:00:00.000Z",
*   "legalForm":"KG",
*   "registrationNumber":"MI651355",
*   "cityOfRegistration":"Dortmund",
*   "countryOfRegistration":"Germany",
*   "taxId":"1234567",
*   "vatRegNo":null,
*   "globalLocationNo":"123",
*   "homePage":"http://jcatalog.com/",
*   "dunsNo":null,
*   "createdOn":"2016-02-19T10:45:26.000Z",
*   "changedOn":"2016-02-19T10:45:26.000Z",
*   "changedBy":"jcadmin",
*   "createdBy":"jcadmin"
*  }
*
* @apiSuccessExample Success-Response:
* HTTP/1.1 200 OK
* {
*   "supplierId":"hard001",
*   "supplierName":"jCatalog",
*   "foundedOn":"2015-10-04T22:00:00.000Z",
*   "legalForm":"KG",
*   "registrationNumber":"MI651355",
*   "cityOfRegistration":"Dortmund",
*   "countryOfRegistration":"Germany",
*   "taxId":"1234567",
*   "vatRegNo":null,
*   "globalLocationNo":"123",
*   "homePage":"http://jcatalog.com/",
*   "dunsNo":null,
*   "createdOn":"2016-02-19T10:45:26.000Z",
*   "changedOn":"2016-02-19T10:45:26.000Z",
*   "changedBy":"jcadmin",
*   "createdBy":"jcadmin"
*   }
*/

const _ = require('lodash');

module.exports = function(epilogue, db) {
  let supplier = epilogue.resource({
    model: db.models.Supplier,
    endpoints: ['/suppliers', '/suppliers/:supplierId']
  });

  supplier.use({
    list: {
      fetch: {
        before(req, res, context) {
          if (!req.query.userId) {
            return context.continue;
          }

          return db.models.Supplier.findAll({
            include: [{
              model: db.models.User2Supplier,
              where: {
                LoginName: req.query.userId
              }
            }]
          }).then(suppliers => {
            // eslint-disable-next-line no-param-reassign
            context.instance = suppliers;
            return context.skip;
          });
        }
      }
    },
    update: {
      write: {
        before(req, res, context) {
          let { supplierId } = req.params;

          if (supplierId !== req.body.supplierId || !req.body.createdBy) {
            return context.error(422, 'inconsistent data');
          }

          return db.models.Supplier.findById(supplierId).then(supplier => {
            if (supplier.dataValues.createdBy !== req.body.changedBy) {
              return context.error(403, 'operation is not authorized');
            }

            return context.continue;
          });
        }
      }
    },
    create: {
      write: {
        before(req, res, context) {
          const { createdBy, changedBy } = req.body;
          return db.
            transaction(t => db.models.Supplier.
              findOrCreate({
                where: _.omit(req.body, ['_objectLabel', 'createdBy', 'changedBy', 'createdOn', 'changedOn']),  // Comparison is case-insensitive (at least in MySQL).
                transaction: t,
                defaults: {
                  createdBy,
                  changedBy
                }
              }).
              spread(function (supplier) {
                return db.models.User2Supplier.destroy({
                  where: {
                    SupplierID: {
                      $ne: supplier.dataValues.supplierId
                    },
                    loginName: changedBy
                  },
                  transaction: t
                }).then(function (rowsDeletedCount) {
                  return db.models.User2Supplier.create({
                    supplierId: supplier.dataValues.supplierId,
                    loginName: changedBy
                  }, {
                    transaction: t,
                    onDuplicate: 'UPDATE SupplierID = SupplierID' // Safe analog of INSERT IGNORE
                  })
                  
                }).then(user2Supplier => {
                  // eslint-disable-next-line no-param-reassign
                  context.instance = supplier;
                  return context.skip;
                })
            })
            ).
            catch(err => {
              if (err.errors &&
                Array.isArray(err.errors) &&
                err.errors.length &&
                err.errors[0].type === 'unique violation' &&
                err.errors[0].path === 'PRIMARY' &&
                err.errors[0].value === req.body.supplierId
              ) {
                return context.error(409,
                  'A supplier with the same supplierID but different set of properties already exists'
                );
              }
            return Promise.reject(err);
            });
        }
      }
    }
  })
}
