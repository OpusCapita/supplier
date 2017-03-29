/**
 * @api {get} /api/suppliers/:supplierId/contacts Get all contacts assigned to the Supplier
 * @apiName GetSupplierContacts
 * @apiGroup Supplier
 *
 * @apiParam {String} supplierId Unique of Supplier identity
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *   "contactId": "Contact (Internal Buyer)",
 *   "contactType": "quote",
 *   "firstName": "Max",
 *   "lastName": "Mustermann",
 *   "email": "dirk.fischbach@jcatalog.com",
 *   "phone": null,
 *   "alternatePhone": null,
 *   "mobile": "0136/456789",
 *   "url": "http://www.jcatalog.com",
 *   "description": "Alle einkaufsrelevanten Fragen",
 *   "department": null,
 *   "supplierId": "hard001",
 *   "changedBy": "jcadmin",
 *   "createdBy": "jcadmin",
 *   "createdOn": "2016-03-23T05:43:25.000Z",
 *   "changedOn": "2016-03-23T05:43:25.000Z"
 *  }
 * ]
 */

/**
 * @api {put} /api/suppliers/:supplierId/contacts Insert new Contact association fro Supplier
 * @apiName InsertSupplierContact
 * @apiGroup Supplier
 *
 * @apiParam {String} supplierId Unique of Supplier identity
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *   "contactId": "Contact (Internal Buyer)",
 *   "contactType": "quote",
 *   "firstName": "Max",
 *   "lastName": "Mustermann",
 *   "email": "dirk.fischbach@jcatalog.com",
 *   "phone": null,
 *   "alternatePhone": null,
 *   "mobile": "0136/456789",
 *   "url": "http://www.jcatalog.com",
 *   "description": "Alle einkaufsrelevanten Fragen",
 *   "department": null
 *  }
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "contactId": "Contact (Internal Buyer)",
 *   "contactType": "quote",
 *   "firstName": "Max",
 *   "lastName": "Mustermann",
 *   "email": "dirk.fischbach@jcatalog.com",
 *   "phone": null,
 *   "alternatePhone": null,
 *   "mobile": "0136/456789",
 *   "url": "http://www.jcatalog.com",
 *   "description": "Alle einkaufsrelevanten Fragen",
 *   "department": null,
 *   "supplierId": "hard001",
 *   "changedBy": "jcadmin",
 *   "createdBy": "jcadmin",
 *   "createdOn": "2016-03-23T05:43:25.000Z",
 *   "changedOn": "2016-03-23T05:43:25.000Z"
 *  }
 */

/**
 * @api {post} /api/suppliers/:supplierId/contacts/:contactId Update SupplierContact association.
 * @apiName UpdateSupplierContact
 * @apiGroup Supplier
 *
 * @apiParam {String} supplierId Unique of Supplier identity
 * @apiParam {String} contactId Unique of Supplier to Contact association
 *
 * @apiParamExample {json} Request-Example:
 *  {
 *   "contactId": "Contact (Internal Buyer)",
 *   "contactType": "quote",
 *   "firstName": "Max",
 *   "lastName": "Mustermann",
 *   "email": "dirk.fischbach@jcatalog.com",
 *   "phone": null,
 *   "alternatePhone": null,
 *   "mobile": "0136/456789",
 *   "url": "http://www.jcatalog.com",
 *   "description": "Alle einkaufsrelevanten Fragen",
 *   "department": null,
 *   "supplierId": "hard001",
 *   "changedBy": "jcadmin",
 *   "createdBy": "jcadmin",
 *   "createdOn": "2016-03-23T05:43:25.000Z",
 *   "changedOn": "2016-03-23T05:43:25.000Z"
 *  }
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {
 *   "contactId": "Contact (Internal Buyer)",
 *   "contactType": "quote",
 *   "firstName": "Max",
 *   "lastName": "Mustermann",
 *   "email": "dirk.fischbach@jcatalog.com",
 *   "phone": null,
 *   "alternatePhone": null,
 *   "mobile": "0136/456789",
 *   "url": "http://www.jcatalog.com",
 *   "description": "Alle einkaufsrelevanten Fragen",
 *   "department": null,
 *   "supplierId": "hard001",
 *   "changedBy": "jcadmin",
 *   "createdBy": "jcadmin",
 *   "createdOn": "2016-03-23T05:43:25.000Z",
 *   "changedOn": "2016-03-23T05:43:25.000Z"
 *  }
 */

/**
 * @api {delete} /api/suppliers/:supplierId/contacts/:contactId Delete SupplierContact association.
 * @apiName DeleteSupplierContact
 * @apiGroup Supplier
 *
 * @apiParam {String} supplierId Unique of Supplier identity
 * @apiParam {String} contactId Unique of Supplier to Contact association
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 *  {}
 */
module.exports = function(epilogue, db) {
  epilogue.resource({
    model: db.models.SupplierContact,
    endpoints: ['/suppliers/:supplierId/contacts', '/suppliers/:supplierId/contacts/:contactId']
  }).use({
    list: {
      fetch: {
        before: function(req, res, context) {
          db.models.SupplierContact.findAll({
            where: {
              supplierId: req.params.supplierId
            }
          }).then((contacts) => {
            // eslint-disable-next-line no-param-reassign
            context.instance = contacts;
            context.skip();
          })
        }
      }
    }
  });
}
