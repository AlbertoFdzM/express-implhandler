var express = require('express');
var listEndpoints = require('express-list-endpoints');

/**
 * Puts middleware to set 501 error for not used methods
 */
var implHandler = function(router) {
  var endpoints = [];

  router = router || {};

  if (router.tack) {
    endpoints = listEndpoints(router.stack);
  } else if (router._router) {
    endpoints = listEndpoints(router._router.stack);
  }

  endpoints.map(function(endpoint) {
    router.all(endpoint.path, function(req, res, next) {
      var err = new Error('Not implemented');

      err.status = 501;
      next(err);
    });
  });
};

module.exports = implHandler;
