const express = require('express');;
const cacheService = require('../services/cache');


const router = express.Router();

router.get('/:key', async (req, res) => {
  const cacheKey = req.params.key;
  console.log('Get single cache entry with key: ' + cacheKey);
  const cacheRes = await cacheService.tryGetValue(cacheKey);

  if (!cacheRes.isCacheHit)
    res.status(201);

  res.json(cacheRes.item);
})

router.get('/', async (req, res) => {
  console.log('Get all cache keys');
  const allKeys = await cacheService.listAllKeys();

  if (allKeys.length == 0)
    res.status(204)

  res.json(allKeys);
})

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

router.delete('/', async (req, res) => {
  console.log('Flush the cache');
  var flushRes = await cacheService.flushAllKeys();

  res.json({ deletedItemCount: flushRes });
})


module.exports = router