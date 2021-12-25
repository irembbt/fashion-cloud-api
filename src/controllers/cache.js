const express = require('express');;
const cacheService = require('../services/cache');


const router = express.Router();

// GET /cache/{key}
// Returns cached data for a given key, if cached data for key exists.
// If not, a random value for the key will be generated, and that will be
// returned.
// Accessing a cacheItem in this manner will also refresh its TTL.
router.get('/:key', async (req, res) => {
  const cacheKey = req.params.key;
  console.log('Get single cache entry with key: ' + cacheKey);
  const cacheRes = await cacheService.tryGetValue(cacheKey);

  if (!cacheRes.isCacheHit)
    res.status(201);

  res.json(cacheRes.item);
})

// GET /cache
// Returns the list of all keys currently in the cache.
// Does not return the values.
router.get('/', async (req, res) => {
  console.log('Get all cache keys');
  const allKeys = await cacheService.listAllKeys();

  if (allKeys.length == 0)
    res.status(204)

  res.json(allKeys);
})

// PUT /cache/{key}
// Upserts a cacheItem with the key specified in the path, and
// the value specified in the body. If a key exists, it's TTL
// is refreshed, and its value is updated to the value in request body.
// If the key does not exist, it will be inserted with the specified
// request value and a fresh TTL.
router.put('/:key', async (req, res) => {
  const cacheKey = req.params.key;
  const cacheVal = req.body.value;
  console.log('Create or replace a cache entry with key: ' + cacheKey);
  var cacheRes = await cacheService.putValue(cacheKey, cacheVal);

  if (cacheRes.isNewItem) {
    res.status(201);
    res.json(cacheRes.item);
  }

  res.json(cacheRes.item);
})

// DELETE /cache/{key}
// Deletes a key value pair from the cache, if it exists
// If it does not exist, and error code 404 is returned.
router.delete('/:key', async (req, res) => {
  const cacheKey = req.params.key
  console.log('Delete single cache entry with key: ' + cacheKey)
  var deleteRes = await cacheService.tryDelete(cacheKey);

  if (!deleteRes.isItemDeleted) {
    res.status(404);
    res.json({ description: `Cache item with key: ${cacheKey} not found in cache, therefore can't be deleted.` })
  }

  res.json(deleteRes.deletedItem);
})

// DELETE /cache
// Deletes all key value pairs in the cache
router.delete('/', async (req, res) => {
  console.log('Flush the cache');
  var flushRes = await cacheService.flushAllKeys();

  res.json({ deletedItemCount: flushRes });
})


module.exports = router