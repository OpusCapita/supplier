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
module.exports = function(epilogue, db) {
  let userSupplierResource = epilogue.resource({
    model: db.models.User2Supplier,
    endpoints: ['/suppliers/:supplierId/users', '/suppliers/:supplierId/users/:userId'],
    actions: ['list', 'create', 'delete']
  });

  userSupplierResource.use({
    // List all users (users IDs) of a supplier.
    list: {
      fetch: {
        before(req, res, context) {
          db.models.User2Supplier.findAll({
            attributes: [
              'LoginName'
            ],
            where: {
              supplierId: req.params.supplierId
            }
          }).then(users => {
            context.instance = users.map(user => user.loginName);  // eslint-disable-line no-param-reassign
            context.skip();
          })
        }
      }
    }
  });
}
