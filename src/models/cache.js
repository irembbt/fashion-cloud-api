var mongoose = require('mongoose');

const cacheEntrySchema = new mongoose.Schema({
  key: 'string',
  expireAt: 'number',
  value: 'string',
});

const cacheEntry = mongoose.model('CacheEntry', cacheEntrySchema);

module.exports = cacheEntry
