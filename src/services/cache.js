var crypto = require('crypto')
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
  var entry = new cacheEntry({ key: key, expireAt: Date.now(), value: val })
  const entryRes = await entry.save();
  return entryRes;
}

function tryDelete(key) {

}

function flushAllKeys() {

}

module.exports.putValue = putValue;