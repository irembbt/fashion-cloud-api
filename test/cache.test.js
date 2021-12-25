const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/server');

chai.use(chaiHttp);
chai.should();

describe('Cache', () => {
  describe('GET Operations', () => {
    it('should indicate no content', (done) => {
      chai.request(app)
        .get('/cache')
        .end((err, res) => {
          res.should.have.status(204);
          done();
        })
    });

    it('should put a random value to key', (done) => {
      const key = 1;

      chai.request(app)
        .get(`/cache/${key}`)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        })
    });

    it('should get all keys in cache', (done) => {
      chai.request(app)
        .get('/cache')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        })
    });

  });

  describe('PUT Operations', () => {
    const key = 5;

    it('should add a key if key does not exist', (done) => {
      chai.request(app)
        .put(`/cache/${key}`)
        .send({ value: "abcdef" })
        .end((err, res) => {
          console.log(err);
          console.log(res);
          res.should.have.status(201);
          res.body.should.be.a('object');
          done();
        })
    });

    it('should update an existing key', (done) => {
      chai.request(app)
        .put(`/cache/${key}`)
        .send({ value: "updated val for key 5" })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        })
    });
  });

  describe('DELETE Operations', () => {
    it('should delete a specific key', (done) => {
      const key = 1;

      chai.request(app)
        .delete(`/cache/${key}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        })
    });

    it('should delete all keys', (done) => {
      chai.request(app)
        .delete('/cache')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        })
    });
  });
});