# MongoDB Cache API Project

This project implements an NodeJS + ExpressJS API that manages a cache implemented in MongoDB.
It supports a configurable time to live, automatic refreshes to said TTL, item updates and
explicit item deletes.

### Default values

Default configuration values are defined under `src/config/cache`. Configurable parameters are:

- `dbUri`: mongoDB connection string
- `ttl`: time to live for every cache item, in seconds.
- `maxCacheSize`: Maximum amount of items allowed in the cache.

### How to run

- `npm start` runs the api in standalone.
- `npm test` starts the api and and runs tests.

### Testing

Tests are implemented using mocha and chai for each endpoint.
