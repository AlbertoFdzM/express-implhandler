var listEndpoints = require('express-list-endpoints');

/**
 * Puts middleware to set 501 error for not used methods
 */
var implHandler = function(router, callback) {
  var endpoints = [];
  var defaultCb = function(req, res, next) {
    var err = new Error('Not implemented');

    err.status = 501;
    return next(err);
  };

  router = router || {};
  callback = callback || defaultCb;

  if (router.stack) {
    endpoints = listEndpoints(router.stack);
  } else if (router._router) {
    endpoints = listEndpoints(router._router.stack);
  }

  endpoints.map(function(endpoint) {
    router.all(endpoint.path, callback);
  });
};

module.exports = implHandler;
