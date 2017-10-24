const SupplierUser = require('../queries/supplier_user');

module.exports = function(app, db, config) {
SupplierUser.init(db, config).then(() =>
  {
    app.get('/api/suppliers/getSupplierAccess', (req, res) => getSupplierAccess(req, res));
  });
};

let getSupplierAccess = function(req, res)
{
  let data = {}
  SupplierUser.getSupplierAccess()
  .then((allReq) => {
    data.requests = []
    for(let index = 0; index < allReq.length ; index ++){
      data.requests.push(allReq[index].dataValues)
    }
    return SupplierUser.getContactDetails(allReq)
  })
  .then((details)=>{
    for(let index = 0; index < details.length ; index ++){
      if(details[index]!== null){
        if(data.requests[index].supplierId == details[index].supplierId)
        data.requests[index].details = details[index].dataValues
      }
    }
    console.log("dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa++++++++++++++++++++++++++++++++++", data)
    res.json(data);
  })
};
