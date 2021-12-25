const express = require('express');;
const { body, validationResult } = require('express-validator');


const router = express.Router();

router.get('/:key', (req, res) => {
  const cacheKey = req.params.key
  console.log('Get single cache entry with key: ' + cacheKey)
  res.json()
})

router.get('/', (req, res) => {
  console.log('Get all cache entries')
  res.json()
})

router.put('/:key', (req, res) => {
  const cacheKey = req.params.key
  console.log('Create or replace a cache entry with key: ' + cacheKey)
  res.json()
})

router.delete('/:key', (req, res) => {
  const cacheKey = req.params.key
  console.log('Delete single cache entry with key: ' + cacheKey)
  res.json()
})

router.delete('/', (req, res) => {
  console.log('Flush the cache')
  res.json()
})


module.exports = router