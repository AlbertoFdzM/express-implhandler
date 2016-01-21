var express = require('express');
var router = express.Router();

/**
 * Print in console all the methods detected for the passed route
 */
var getRouteMethods = function (route, options) {
  options = options || {};

  for (var method in route.methods) {
    if (!options.withAll && method === '_all') continue;

    console.log(options.prefix + route.path + ' - ' + method.toUpperCase());
  }
};

/**
 * Return an array if strings with all the detected endpoints
 */
var getEndpoints = function (routerStack, path, endpoints) {
  var regExp = /^\/\^\\\/(?:(\w*)|(\(\?:\(\[\^\\\/\]\+\?\)\)))\\\/.*/;

  endpoints = endpoints || [];
  path = path || '';

  routerStack.forEach(function (val) {
    var newPath = regExp.exec(val.regexp);

  	if (val.route) {
      endpoints.push(path + val.route.path);
      // getRouteMethods(val.route, {prefix: path});

  	} else if (val.name === 'router' || val.name === 'bound dispatch') {
      if (newPath) {
        getEndpoints(val.handle.stack, path + '/' + newPath[1], endpoints);

      } else {
        getEndpoints(val.handle.stack, path, endpoints);
      }
    }
  });

  return endpoints;
};

/**
 * Puts middleware to set 501 error for not used methods
 */
var implHandler = function (router) {
  var endpoints = [];

  router = router || {};

  if (router.tack) {
    endpoints = getEndpoints(router.stack);
  } else if (router._router) {
    endpoints = getEndpoints(router._router.stack);
  }


  endpoints.map(function (val) {
    router.all(val, function (req, res, next) {
      var err = new Error('Not implemented');

      err.status = 501;
      next(err);
    });
  });
};

module.exports = implHandler;
