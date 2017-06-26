module.exports = function(epilogue, db) {
  epilogue.resource({
    model: db.models.Country,
    endpoints: ['/countries', '/countries/:id'],
    actions: ['list'],
    pagination: false
  });
}

