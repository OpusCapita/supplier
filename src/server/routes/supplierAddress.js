/**
 * @api {get} /api/suppliers/:supplierId/addresses Get all addresses assigned to the Supplier
 * @apiName GetSupplierAddresses
 * @apiGroup Supplier
 *
 * @apiParam {String} supplierId Unique of Supplier identity
 *
 * @apiParamExample {json} Request-Example:
 *  {
*   "id":3,
*   "salutation":null,
*   "name1":null,
*   "type":"default",
*   "changedBy":"jcadmin",
*   "createdBy":"jcadmin",
*   "createdOn":"2016-02-22T05:30:56.000Z",
*   "changedOn":"2016-02-22T05:30:56.000Z",
*   "supplierId":"hard001",
*   "addressId":"central_office",
*   "address":
*     {
*       "addressId":"central_office",
*       "salutation":"Supplier",
*       "name1":"Central Office",
*       "name2":null,
*       "name3":null,
*       "areaCode":null,
*       "street":"BV Borussia 09 e.V.",
*       "state":null,
*       "pobox":null,
*       "poboxZipCode":null,
*       "email":"jana.pape@jcatalog.com",
*       "zipCode":"220100",
*       "city":"Dortmund",
*       "phoneNo":"+491234512345",
*       "faxNo":null,
*       "countryId":"DE",
*       "changedBy":"jcadmin",
*       "createdBy":"jcadmin",
*       "createdOn":"2016-01-29T00:02:03.000Z",
*       "changedOn":"2016-02-22T05:30:56.000Z"
*     }
*  }
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
*    "id":3,
*    "salutation":null,
*    "name1":null,
*    "type":"default",
*    "changedBy":"jcadmin",
*    "createdBy":"jcadmin",
*    "createdOn":"2016-02-22T05:30:56.000Z",
*    "changedOn":"2016-02-22T05:30:56.000Z",
*    "supplierId":"hard001",
*    "addressId":"central_office",
*    "address":
*      {
*        "addressId":"central_office",
*        "salutation":"Supplier",
*        "name1":"Central Office",
*        "name2":null,
*        "name3":null,
*        "areaCode":null,
*        "street":"BV Borussia 09 e.V.",
*        "state":null,
*        "pobox":null,
*        "poboxZipCode":null,
*        "email":"jana.pape@jcatalog.com",
*        "zipCode":"220100",
*        "city":"Dortmund",
*        "phoneNo":"+491234512345",
*        "faxNo":null,
*        "countryId":"DE",
*        "changedBy":"jcadmin",
*        "createdBy":"jcadmin",
*        "createdOn":"2016-01-29T00:02:03.000Z",
*        "changedOn":"2016-02-22T05:30:56.000Z"
*      }
*   }
 * ]
 */

/**
 * @api {put} /api/suppliers/:supplierId/addresses Insert Supplier to Address association
 * @apiName InsertSupplierAddress
 * @apiGroup Supplier
 *
 * @apiParam {String} supplierId Unique of Supplier identity
 *
 * @apiParamExample {json} Request-Example:
 *  {
*   "salutation":null,
*   "name1":null,
*   "type":"default",
*   "supplierId":"hard001",
*   "addressId":"central_office",
*   "address":
*     {
*       "addressId":"central_office",
*       "salutation":"Supplier",
*       "name1":"Central Office",
*       "name2":null,
*       "name3":null,
*       "areaCode":null,
*       "street":"BV Borussia 09 e.V.",
*       "state":null,
*       "pobox":null,
*       "poboxZipCode":null,
*       "email":"jana.pape@jcatalog.com",
*       "zipCode":"220100",
*       "city":"Dortmund",
*       "phoneNo":"+491234512345",
*       "faxNo":null,
*       "countryId":"DE"
*     }
*  }
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
*    "id":3,
*    "salutation":null,
*    "name1":null,
*    "type":"default",
*    "changedBy":"jcadmin",
*    "createdBy":"jcadmin",
*    "createdOn":"2016-02-22T05:30:56.000Z",
*    "changedOn":"2016-02-22T05:30:56.000Z",
*    "supplierId":"hard001",
*    "addressId":"central_office",
*    "address":
*      {
*        "addressId":"central_office",
*        "salutation":"Supplier",
*        "name1":"Central Office",
*        "name2":null,
*        "name3":null,
*        "areaCode":null,
*        "street":"BV Borussia 09 e.V.",
*        "state":null,
*        "pobox":null,
*        "poboxZipCode":null,
*        "email":"jana.pape@jcatalog.com",
*        "zipCode":"220100",
*        "city":"Dortmund",
*        "phoneNo":"+491234512345",
*        "faxNo":null,
*        "countryId":"DE",
*        "changedBy":"jcadmin",
*        "createdBy":"jcadmin",
*        "createdOn":"2016-01-29T00:02:03.000Z",
*        "changedOn":"2016-02-22T05:30:56.000Z"
*      }
*   }
 * ]
 */

/**
 * @api {post} /api/suppliers/:supplierId/addresses/:addressId Update Supplier to Address association
 * @apiName UpdateSupplierAddress
 * @apiGroup Supplier
 *
 * @apiParam {String} supplierId Unique of Supplier identity
 * @apiParam {Number} addressId Unique of Supplier to Address association
 *
 * @apiParamExample {json} Request-Example:
 *  {
*   "salutation":null,
*   "name1":null,
*   "type":"default",
*   "supplierId":"hard001",
*   "addressId":"central_office",
*   "address":
*     {
*       "addressId":"central_office",
*       "salutation":"Supplier",
*       "name1":"Central Office",
*       "name2":null,
*       "name3":null,
*       "areaCode":null,
*       "street":"BV Borussia 09 e.V.",
*       "state":null,
*       "pobox":null,
*       "poboxZipCode":null,
*       "email":"jana.pape@jcatalog.com",
*       "zipCode":"220100",
*       "city":"Dortmund",
*       "phoneNo":"+491234512345",
*       "faxNo":null,
*       "countryId":"DE"
*     }
*  }
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
*    "id":3,
*    "salutation":null,
*    "name1":null,
*    "type":"default",
*    "changedBy":"jcadmin",
*    "createdBy":"jcadmin",
*    "createdOn":"2016-02-22T05:30:56.000Z",
*    "changedOn":"2016-02-22T05:30:56.000Z",
*    "supplierId":"hard001",
*    "addressId":"central_office",
*    "address":
*      {
*        "addressId":"central_office",
*        "salutation":"Supplier",
*        "name1":"Central Office",
*        "name2":null,
*        "name3":null,
*        "areaCode":null,
*        "street":"BV Borussia 09 e.V.",
*        "state":null,
*        "pobox":null,
*        "poboxZipCode":null,
*        "email":"jana.pape@jcatalog.com",
*        "zipCode":"220100",
*        "city":"Dortmund",
*        "phoneNo":"+491234512345",
*        "faxNo":null,
*        "countryId":"DE",
*        "changedBy":"jcadmin",
*        "createdBy":"jcadmin",
*        "createdOn":"2016-01-29T00:02:03.000Z",
*        "changedOn":"2016-02-22T05:30:56.000Z"
*      }
*   }
 * ]
 */
function cloneSupplier2Attributes(supplier2Address) {
  const changedOn = Math.max(supplier2Address.changedOn, supplier2Address.address.changedOn);

  return Object.assign({}, supplier2Address, changedOn, { address: supplier2Address.address, changedOn });
}

module.exports = function(epilogue, db) {
  let supplierAddressResource = epilogue.resource({
    model: db.models.Supplier2Address,
    endpoints: ['/suppliers/:supplierId/addresses', '/suppliers/:supplierId/addresses/:addressId'],
    include: [{ model: db.models.Address, as: 'address' }]
  });

  supplierAddressResource.use({
    // custom fetching logic to take supplier id into account
    list: {
      fetch: {
        before(req, res, context) {
          db.models.Supplier2Address.findAll({
            include: {
              model: db.models.Address,
              as: "address"
            },
            where: {
              supplierId: req.params.supplierId
            }
          }).then(supplierAddresses => {
            // eslint-disable-next-line no-param-reassign
            context.instance = supplierAddresses.map(supplierAddress => cloneSupplier2Attributes(supplierAddress));
            context.skip();
          })
        }
      }
    },
    create: {
      write: {
        before(req, res, context) {
          // create/update reference to Address during create Supplier2Address
          let addressInstance = req.body.address || { addressId: req.body.addressId };
          let addressId = addressInstance.addressId;

          if (!addressId) {
            context.skip();
            return;
          }

          let criteria = {
            where: {
              addressId: addressId
            }
          };
          db.models.Address.findOne(criteria).then(address => {
            if (address) {
              console.log(`Updating address: ${JSON.stringify(addressInstance)}`);
              return db.models.Address.update(addressInstance, criteria);
            } else {
              console.log(`Create new address: ${JSON.stringify(addressInstance)}`);
              return db.models.Address.create(addressInstance);
            }
          }).then(address => address ? context.continue() : context.skip());
        }
      }
    },

    update: {
      write: {
        before(req, res, context) {
          let instance = req.body;
          let address = instance.address;
          if (address) {
            db.models.Address.update(address, {
              where: {
                addressId: address.addressId
              }
            }).then(function() {
              context.continue();
            });
          } else {
            context.continue();
          }
        },
        after(req, res, context) {
          db.models.Supplier2Address.findById(context.instance.id, {
            include: [{
              model: db.models.Address,
              as: 'address'
            }]
          }).then(supplierAddress => {
            // eslint-disable-next-line no-param-reassign
            context.instance = cloneSupplier2Attributes(supplierAddress);
            context.skip();
          });
        }
      }
    }
  });
}
