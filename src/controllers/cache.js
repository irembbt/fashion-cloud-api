const express = require('express');;
const { body, validationResult } = require('express-validator');
const cacheService = require('../services/cache');


const router = express.Router();

router.get('/:key', async (req, res) => {
  const cacheKey = req.params.key
  console.log('Get single cache entry with key: ' + cacheKey)
  res.json()
})

router.get('/', async (req, res) => {
  console.log('Get all cache entries')
  res.json()
})

router.put('/:key', async (req, res) => {
  const cacheKey = req.params.key
  const cacheVal = req.body.value
  console.log('Create or replace a cache entry with key: ' + cacheKey)
  var entry = await cacheService.putValue(cacheKey, cacheVal)
  res.json(entry)
})

router.delete('/:key', async (req, res) => {
  const cacheKey = req.params.key
  console.log('Delete single cache entry with key: ' + cacheKey)
  res.json()
})

router.delete('/', async (req, res) => {
  console.log('Flush the cache')
  res.json()
})


module.exports = router