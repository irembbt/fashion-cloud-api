const express = require('express');;
const { body, validationResult } = require('express-validator');
const cacheService = require('../services/cache');


const router = express.Router();

router.get('/:key', async (req, res) => {
  const cacheKey = req.params.key;
  console.log('Get single cache entry with key: ' + cacheKey);
  const cachedItem = await cacheService.tryGetValue(cacheKey);
  res.json(cachedItem);
})

router.get('/', async (req, res) => {
  console.log('Get all cache keys');
  const allKeys = await cacheService.listAllKeys();
  res.json(allKeys);
})

router.put('/:key', async (req, res) => {
  const cacheKey = req.params.key;
  const cacheVal = req.body.value;
  console.log('Create or replace a cache entry with key: ' + cacheKey);
  var entry = await cacheService.putValue(cacheKey, cacheVal);
  res.json(entry);
})

router.delete('/:key', async (req, res) => {
  const cacheKey = req.params.key
  console.log('Delete single cache entry with key: ' + cacheKey)
  var deleteRes = await cacheService.tryDelete(cacheKey);
  res.json(deleteRes);
})

router.delete('/', async (req, res) => {
  console.log('Flush the cache');
  var flushRes = await cacheService.flushAllKeys();
  res.json(flushRes);
})


module.exports = router