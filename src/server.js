const connectCache = require('./services/mongo-connection');
const app = require('./app');;

async function start(app) {
  await connectCache();

  app.listen(3000, () => {
    console.log('Started MongoDB Cache API on empty MongoDB cache.')
  })
}

start(app)
