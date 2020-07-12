const listEndpoints = require('express-list-endpoints')

/**
 * Puts middleware to set 501 error for unused methods
 */
const implHandler = (app, callback) => {
  const endpoints = listEndpoints(app)
  callback = callback || require('./defaultCallback')

  endpoints.map((endpoint) => {
    app.all(endpoint.path, callback)
  })
}

module.exports = implHandler
