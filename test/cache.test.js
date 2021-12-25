const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');

chai.use(chaiHttp);
chai.should();

describe('Cache', () => {
  describe('GET Operations', () => {
    it('should get all keys in cache', (done) => {
      chai.request(app)
        .get('/cache')
        .end((err, res) => {
          res.should.have.status(204);
          done();
        })
    });
  })
});