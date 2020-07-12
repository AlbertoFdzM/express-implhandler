/* eslint-env node, mocha */
const mocha = require('mocha')
const chai = require('chai')
chai.use(require('chai-http'))
const express = require('express')
const implHandler = require('../src/index')

const describe = mocha.describe
const it = mocha.it
const expect = chai.expect

describe('express-implhandler', function () {
  let app
  let router

  this.beforeAll(() => {
    const end = function (req, res) {
      return res.end()
    }

    app = express()
    router = express.Router()

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
  })

  describe('when called over an app', () => {
    let agent

    this.beforeAll(() => {
      const errorHandler = (err, req, res, next) => {
        if (err) {
          return res.status(err.status || 500).json(err)
        }

        return next()
      }

      implHandler(app)
      app.use(errorHandler)

      agent = chai.request.agent(app)
    })

    describe('for the app', () => {
      describe('on defined endpoints', () => {
        it('should not change response on defined methods', async () => {
          const responses = await Promise.all([
            agent.get('/'),
            agent.put('/app-test')
          ])

          responses.map((response) => {
            expect(response).to.has.status(200)
          })
        })

        it('should set an error code 501 on undefined methods', async () => {
          const responses = await Promise.all([
            agent.post('/'),
            agent.delete('/app-test')
          ])

          responses.map((response) => {
            expect(response).to.has.status(501)
          })
        })
      })

      describe('on undefined endpoints', () => {
        it('should not set any handler', async () => {
          const responses = await Promise.all([
            agent.get('/some-endpoint'),
            agent.post('/another-endpoint')
          ])

          responses.map((response) => {
            expect(response).to.has.status(404)
          })
        })
      })
    })

    describe('for the attached routers methods', () => {
      it('should not change the response on current methods', async () => {
        const responses = await Promise.all([
          agent.get('/router/'),
          agent.post('/router/router-test'),
          agent.copy('/router/router-test'),
          agent.delete('/router/router-test')
        ])

        responses.map((response) => {
          expect(response).to.has.status(200)
        })
      })

      it('should not set handlers for undefined endpoints', async () => {
        const responses = await Promise.all([
          agent.get('/router/some-endpoint'),
          agent.put('/router/some-endpoint'),
          agent.post('/router/another-endpoint'),
          agent.delete('/router/another-endpoint')
        ])

        responses.map((response) => {
          expect(response).to.has.status(404)
        })
      })
    })
  })
})
