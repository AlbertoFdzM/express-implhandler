var listEndpoints = require('express-list-endpoints')

/**
 * Default callback
 */
var defaultCb = function (req, res, next) {
  var err = new Error('Not implemented')

  err.status = 501
  return next(err)
}

/**
 * Puts middleware to set 501 error for unused methods
 */
var implHandler = function (app, callback) {
  var endpoints = listEndpoints(app)
  callback = callback || defaultCb

  endpoints.map(function (endpoint) {
    app.all(endpoint.path, callback)
  })
}

module.exports = implHandler
