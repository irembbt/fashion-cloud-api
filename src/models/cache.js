var mongoose = require('mongoose');

const cacheEntrySchema = new mongoose.Schema({
  _id: 'string',
  expireAt: { type: 'number', required: true },
  value: { type: 'string', required: true },
});

const cacheEntry = mongoose.model('CacheEntry', cacheEntrySchema);

module.exports = cacheEntry
