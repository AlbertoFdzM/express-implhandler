/* eslint-env node, mocha */
var chai = require('chai')
chai.use(require('chai-http'))
var express = require('express')
var implHandler = require('../index')
var expect = chai.expect
var Q = global.Promise

var app = express()
var router = express.Router()

var multiCatch = function (promises, errHandler, cb, index) {
  index = index || 0
  promises[index].catch(function (err) {
    errHandler(err)
    index++
    if (index < promises.length) {
      multiCatch(promises, errHandler, cb, index)
    } else {
      cb()
    }
  })
}

var checkResponses = function (code, values, cb) {
  values.forEach(function (res) {
    expect(res).to.has.status(code)
  })

  cb()
}

var end = function (req, res) {
  return res.end()
}

var errorHandler = function (err, req, res, next) {
  if (err) {
    return res.status(err.status || 500).json(err)
  }

  return next()
}

router.route('/')
  .get(end)

router.route('/router-test')
  .post(end)
  .copy(end)
  .delete(end)

app.route('/')
  .get(end)

app.route('/app-test')
  .put(end)

app.use('/router', router)

describe('express-implhandler', function () {
  describe('when called over an app', function () {
    var agent

    implHandler(app)
    app.use(errorHandler)
    agent = chai.request.agent(app)

    describe('for the app', function () {
      describe('on defined endpoints', function () {
        it('should not change response on defined methods', function (done) {
          Q.all([
            agent.get('/'),
            agent.put('/app-test')
          ])
            .then(function (values) {
              checkResponses(200, values, done)
            })
        })

        it('should set an error code 501 on undefined methods', function (done) {
          multiCatch([
            agent.post('/'),
            agent.delete('/app-test')
          ], function (err) {
            expect(err).to.has.status(501)
          }, done)
        })
      })

      describe('on undefined endpoints', function () {
        it('should not set any handler', function (done) {
          multiCatch([
            agent.get('/some-endpoint'),
            agent.post('/another-endpoint')
          ], function (err) {
            expect(err).to.has.status(404)
          }, done)
        })
      })
    })

    describe('for the attached routers methods', function () {
      it('should not change the response on current methods', function (done) {
        Q.all([
          agent.get('/router/'),
          agent.post('/router/router-test'),
          agent.copy('/router/router-test'),
          agent.delete('/router/router-test')
        ]).then(function (values) {
          checkResponses(200, values, done)
        })
      })

      it('should not set handlers for undefined endopints', function (done) {
        multiCatch([
          agent.get('/router/some-endpoint'),
          agent.put('/router/some-endpoint'),
          agent.post('/router/another-endpoint'),
          agent.delete('/router/another-endpoint')
        ], function (err) {
          expect(err).to.has.status(404)
        }, done)
      })
    })
  })
})
