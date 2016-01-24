/*eslint-env mocha */
var chai = require('chai');
chai.use(require('chai-http'));
var express = require('express');
var implHandler = require('../index');
var expect = chai.expect;
var should = chai.should();

var app = express();
var router = express.Router();

router.route('/')
  .get(function(req, res) {
    return res.end();
  });

router.route('/router-test')
  .post(function(req, res) {
    return res.end();
  })
  .copy(function(req, res) {
    return res.end();
  })
  .delete(function(req, res) {
    return res.end();
  });

app.route('/')
  .get(function(req, res) {
    return res.end();
  });

app.route('/app-test')
  .put(function(req, res) {
    return res.end();
  });

app.use('/router', router);

implHandler(app);

app.use(function(err, req, res, next) {
  if (err) {
    res.status(err.status || 500).send(err);
  }

  next();
});

describe('express-implhandler', function() {
  describe('when called over an app', function() {
    var agent = chai.request.agent(app);

    describe('for the app', function() {
      describe('on defined endpoints', function() {
        it('should not change response on defined methods', function(done) {
          agent.get('/')
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.has.status(200);
            });
          agent.put('/app-test')
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.has.status(200);
              done();
            });
        });

        it('should set an error code 501 on undefined methods', function(done) {
          agent.post('/')
            .end(function(err, res) {
              expect(res.error).to.be.ok;
              expect(res).to.has.status(501);
            });
          agent.delete('/app-test')
            .end(function(err, res) {
              expect(res.error).to.be.ok;
              expect(res).to.has.status(501);
              done();
            });
        });
      });

      describe('on undefined endpoints', function() {
        it('should not set any handler', function(done) {
          agent.get('/some-endpoint')
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.has.status(404);
            });
          agent.post('/another-endpoint')
            .end(function(err, res) {
              expect(err).to.be.null;
              expect(res).to.has.status(404);
              done();
            });
        });
      });
    });

    describe('for the attached router methods', function() {
      it('should not change the response on current methods', function(done) {
        agent.get('/router/')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(200);
          });
        agent.post('/router/router-test')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(200);
          });
        agent.copy('/router/router-test')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(200);
          });
        agent.delete('/router/router-test')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(200);
            done();
          });
      });

      it('should not set handlers for undefined endopints', function(done) {
        agent.get('/router/some-endpoint')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(404);
          });
        agent.put('/router/some-endpoint')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(404);
          });
        agent.post('/router/another-endpoint')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(404);
          });
        agent.delete('/router/another-endpoint')
          .end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.has.status(404);
            done();
          });
      });
    });
  });
});
