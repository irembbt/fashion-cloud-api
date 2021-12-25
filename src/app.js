const express = require('express');;
const bodyParser = require('body-parser');
const cacheController = require('./controllers/cache');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/cache', cacheController);

module.exports = app
