const listEndpoints = require('express-list-endpoints')

/**
 * Puts middleware to set 501 error for unused methods
 */
const implHandler = (app, middleware) => {
  const endpoints = listEndpoints(app)
  middleware = middleware || require('./defaultMiddleware')

  endpoints.map((endpoint) => {
    app.all(endpoint.path, middleware)
  })
}

module.exports = implHandler
