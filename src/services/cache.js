const crypto = require('crypto');
const config = require('../config/cache');
const cacheEntry = require('../models/cache');
const mongoose = require('mongoose');

async function tryGetValue(key) {
  var entry = await cacheEntry.findById(key);

  if (entry === null) {
    console.log('Cache miss')
    entry = await putRandomValue(key);

    return { 'isCacheHit': false, item: { key: entry._id, value: entry.value } };
  }

  console.log('Cache hit');
  return { 'isCacheHit': true, item: { key: entry._id, value: entry.value } };
}

async function listAllKeys() {
  const allKeys = await cacheEntry.find({});
  return allKeys.map(c => c._id);
}

async function putRandomValue(key) {
  var randVal = crypto.randomBytes(32).toString("hex");
  var entry = new cacheEntry({ _id: key, createdAt: Date.now(), value: randVal });
  return await createCacheItem(entry);
}

async function putValue(key, val) {
  var entry = new cacheEntry({ _id: key, createdAt: Date.now(), value: val })

  var cacheRes = await cacheEntry.findByIdAndUpdate(key, entry);
  if (cacheRes === null) {
    cacheRes = await createCacheItem(entry);
    return { isNewItem: true, item: { before: null, after: { key: cacheRes._id, value: cacheRes.value } } };
  }

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

async function createCacheItem(item) {
  const session = await mongoose.startSession();

  var response;

  // withTransaction apparently doesn't return the callbacks return value.
  await session.withTransaction(async () => {
    var currentCacheSize = await cacheEntry.count();

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
