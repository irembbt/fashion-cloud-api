var crypto = require('crypto');
const config = require('../config/cache');
var cacheEntry = require('../models/cache');

function tryGetValue(key) {

}

function listAllKeys() {

}

function putRandomValue(key) {
  var randVal = crypto.randomBytes(32).toString("hex");
  putValue(key, randVal);
}

async function putValue(key, val) {
  var entry = new cacheEntry({ _id: key, expireAt: Date.now(), value: val })

  var entryRes = await cacheEntry.findByIdAndUpdate(key, entry);
  if (entryRes === null) {
    entryRes = await createCacheItem(entry);
  }

  return entryRes;
}

function tryDelete(key) {

}

function flushAllKeys() {

}

async function createCacheItem(item) {
  var currentCacheSize = await cacheEntry.count();

  if (currentCacheSize >= config.maxCacheSize) {
    var res = await cacheEntry.find().sort({ expireAt: 1 }).limit(1).remove();

    console.log('Dropped a key from cache');
  }

  await item.save();
}

module.exports.putValue = putValue;