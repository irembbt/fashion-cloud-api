var mongoose = require('mongoose');
var config = require('../config/cache');

// Define the cache key as the mongoDB system id, which is indexed by default.
// specifying expires for field createdAt indexes it automatically. This index
// will also be used for finding and invalidating the oldest cache entry when the
// cache is full.
const cacheEntrySchema = new mongoose.Schema({
  _id: 'string',
  createdAt: { type: Date, required: true, expires: config.ttl },
  value: { type: 'string', required: true },
});

const cacheEntry = mongoose.model('CacheEntry', cacheEntrySchema);

module.exports = cacheEntry
