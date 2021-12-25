const crypto = require('crypto');
const config = require('../config/cache');
const cacheEntry = require('../models/cache');
const mongoose = require('mongoose');

async function tryGetValue(key) {
  // Fetches the cached value while updating its TTL.
  var entry = await cacheEntry.findByIdAndUpdate(key, { createdAt: Date.now() });

  if (entry === null) {
    console.log('Cache miss')
    entry = await putRandomValue(key);

    return { 'isCacheHit': false, item: { key: entry._id, value: entry.value } };
  }

  else {
    console.log('Cache hit');
    return { 'isCacheHit': true, item: { key: entry._id, value: entry.value } };
  }
}

async function listAllKeys() {
  const allKeys = await cacheEntry.find({});
  return allKeys.map(c => c._id);
}

// Generates a random value, and uses the standart item creation method to add a new
// item to the cache. Should only be used when we are certain key does not exist in cache.
async function putRandomValue(key) {
  var randVal = crypto.randomBytes(32).toString("hex");
  var entry = new cacheEntry({ _id: key, createdAt: Date.now(), value: randVal });
  return await createCacheItem(entry);
}

async function putValue(key, val) {
  var entry = new cacheEntry({ _id: key, createdAt: Date.now(), value: val })

  // Update operation will return null and do nothing in the cache, if the key
  // doesn't exist.
  var cacheRes = await cacheEntry.findByIdAndUpdate(key, entry);
  if (cacheRes === null) {
    // Cache miss, we have to create the item
    cacheRes = await createCacheItem(entry);
    return { isNewItem: true, item: { before: null, after: { key: cacheRes._id, value: cacheRes.value } } };
  }

  // Cache hit, the item is updated, return both old and new state of the cached item.
  return {
    isNewItem: false,
    item: {
      before: { key: cacheRes._id, value: cacheRes.value },
      after: { key: entry._id, value: entry.value },
    }
  };
}

async function tryDelete(key) {
  var deletedItem = await cacheEntry.findByIdAndDelete(key);

  if (deletedItem === null) {
    return { isItemDeleted: false };
  }

  return { isItemDeleted: true, deletedItem: { key: deletedItem._id, value: deletedItem.value } };
}

async function flushAllKeys() {
  var flushRes = await cacheEntry.deleteMany({});

  return flushRes.deletedCount;
}

// Standard way to add new items to cache. Assumes the specified key isn't in
// the cache. It encapsulates logic maintaining a fixed cache size, by querying
// the current cache size for every create operation.
async function createCacheItem(item) {
  const session = await mongoose.startSession();

  var response;

  // Use a transaction, since we have to do 2 DML oeprations.
  // withTransaction apparently doesn't return the callbacks return value.
  await session.withTransaction(async () => {
    var currentCacheSize = await cacheEntry.count();

    // Check if cache is full (or somehow beyond full) // delete the oldest
    // cached item if so. 
    if (currentCacheSize >= config.maxCacheSize) {
      await cacheEntry.find().sort({ createdAt: 1 }).limit(1).deleteOne();
      console.log('Dropped a key from cache');
    }
    response = await item.save();
  });

  return response;
}

module.exports.putValue = putValue;
module.exports.tryGetValue = tryGetValue;
module.exports.listAllKeys = listAllKeys;
module.exports.tryDelete = tryDelete;
module.exports.flushAllKeys = flushAllKeys;
