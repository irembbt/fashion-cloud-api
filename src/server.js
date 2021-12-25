const app = require('./app');;

function start(app) {
  app.listen(3000, () => {
    console.log('Started MongoDB Cache API on empty MongoDB cache.')
  })
}

start(app)
