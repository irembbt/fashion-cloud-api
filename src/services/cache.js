const crypto = require('crypto');
const config = require('../config/cache');
const cacheEntry = require('../models/cache');

async function tryGetValue(key) {

}

async function listAllKeys() {

}

async function putRandomValue(key) {
  var randVal = crypto.randomBytes(32).toString("hex");
  return putValue(key, randVal);
}

async function putValue(key, val) {
  var entry = new cacheEntry({ _id: key, createdAt: Date.now(), value: val })

  var entryRes = await cacheEntry.findByIdAndUpdate(key, entry);
  if (entryRes === null) {
    entryRes = await createCacheItem(entry);
  }

  return entryRes;
}

async function tryDelete(key) {
  var flushRes = await cacheEntry.findByIdAndDelete(key);

  return flushRes;
}

async function flushAllKeys() {
  var flushRes = await cacheEntry.deleteMany({});

  return flushRes;
}

async function createCacheItem(item) {
  var currentCacheSize = await cacheEntry.count();

  if (currentCacheSize >= config.maxCacheSize) {
    var res = await cacheEntry.find().sort({ createdAt: 1 }).limit(1).remove();

    console.log('Dropped a key from cache');
  }
  await item.save();

  return item
}

module.exports.putValue = putValue;
module.exports.tryGetValue = tryGetValue;
module.exports.listAllKeys = listAllKeys;
module.exports.tryDelete = tryDelete;
module.exports.flushAllKeys = flushAllKeys;