const listEndpoints = require('express-list-endpoints')

/**
 * Default callback
 */
const defaultCb = function (req, res, next) {
  const err = new Error('Not implemented')

  err.status = 501

  return next(err)
}

/**
 * Puts middleware to set 501 error for unused methods
 */
const implHandler = function (app, callback) {
  const endpoints = listEndpoints(app)
  callback = callback || defaultCb

  endpoints.map(function (endpoint) {
    app.all(endpoint.path, callback)
  })
}

module.exports = implHandler
