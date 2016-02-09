/*eslint-env mocha */
var chai = require('chai');
chai.use(require('chai-http'));
var express = require('express');
var implHandler = require('../index');
var expect = chai.expect;
var should = chai.should();
var Q = global.Promise;

var app = express();
var router = express.Router();

var errorHandler = function(err, req, res, next) {
  if (err) {return res.status(err.status || 500).json(err);}

  return next();
};

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

describe('express-implhandler', function() {
  describe('when called over an app', function() {
    implHandler(app);
    app.use(errorHandler);
    var agent = chai.request.agent(app);

    describe('for the app', function() {
      describe('on defined endpoints', function() {
        it('should not change response on defined methods', function(done) {
          Q.all([
            agent.get('/'),
            agent.put('/app-test')
          ]).then(function (values) {
            values.forEach(function(res) {
              expect(res).to.has.status(200);
            });
            done();
          });
        });

        it('should set an error code 501 on undefined methods', function(done) {
          Q.all([
            agent.post('/'),
            agent.delete('/app-test')
          ]).then(function(values) {
            values.forEach(function(res) {
              expect(res).to.has.status(501);
            });
            done();
          });
        });
      });

      describe('on undefined endpoints', function() {
        it('should not set any handler', function(done) {
          Q.all([
            agent.get('/some-endpoint'),
            agent.post('/another-endpoint')
          ]).then(function(values) {
            values.forEach(function(res) {
              expect(res).to.has.status(404);
            });
            done();
          });
        });
      });
    });

    describe('for the attached routers methods', function() {
      it('should not change the response on current methods', function(done) {
        Q.all([
          agent.get('/router/'),
          agent.post('/router/router-test'),
          agent.copy('/router/router-test'),
          agent.delete('/router/router-test')
        ]).then(function(values) {
          values.forEach(function(res) {
            expect(res).to.has.status(200);
          });
          done();
        });
      });

      it('should not set handlers for undefined endopints', function(done) {
        Q.all([
          agent.get('/router/some-endpoint'),
          agent.put('/router/some-endpoint'),
          agent.post('/router/another-endpoint'),
          agent.delete('/router/another-endpoint')
        ]).then(function(values) {
          values.forEach(function(res) {
            expect(res).to.has.status(404);
          });
          done();
        });
      });
    });
  });
});
