var mongoose = require('mongoose');
var cahceConfig = require('../config/cache')

function connectCache() {
  mongoose.connect(cahceConfig.dbUri)

  return mongoose.connection
}

module.exports = connectCache