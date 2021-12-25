var mongoose = require('mongoose');
var config = require('../config/cache');

const cacheEntrySchema = new mongoose.Schema({
  _id: 'string',
  createdAt: { type: Date, required: true, expires: config.ttl },
  value: { type: 'string', required: true },
});

const cacheEntry = mongoose.model('CacheEntry', cacheEntrySchema);

module.exports = cacheEntry
