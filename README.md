# Express implHandler

Simple express method implementation script to catch error code 501

This script is useful if you'r developing an API with express or you'd like to set a default 501 response for your actual server endpoints.

```javascript
var implHandler = require('express-implhandler');
implHandler(app);
```

## Example of use

Put this inside your API router script just after the 404 error catcher.

Root API endpoint (`/api/v1`) router example:

```javascript
var express = require('express');
var router = express.Router();
var implHandler = require('express-implhandler');
var users = require('./users');
var cars = require('./cars');

// define your routes
router.get('/', function (req, res) {
  res.json({
    message: 'Welcome to this awesome API!'
  });
});

router.use('/users', users)
router.use('/cars', cars)

// catch 501 and forward to error handler
implHandler(router, function (req, res, next) {
  var err = new Error('Not implemented');

  err.status = 501;

  return next(err);
});

// catch 404 and forward to error handler
// ...

module.exports = router;
```

Then if you try to call to your API  endpoints with some method not defined you will receive a 501 response code. For example if you try to make a `PUT` request to `/api/v1/` the server will return a 501 code with the next content:

```json
{
  "message": "Not implemented",
  "error": {
    "status": 501
  }
}
```

## Arguments

### `app` or `router` instance

Your router instance (`router`) or your app instance (`app`).

_**Note:** Pay attention that before call this script the router must have the endpoints registered due to handle them._

### `callback` (optional)

**Default:***
```javascript
implHandler(app, function(req, res, next) {
  var err = new Error('Not implemented');

  err.status = 501;
  return next(err);
});
```

You can override the default callback with one of your preference:
```javascript
implHandler(app, function(req, res, next) {
  var err = new Error(
    'Method not yet implemented. Please refer to our API docs for more info'
  );

  err.status = 501;

  return next(err);
});
```

## Collaborate

Feel free to make pull request or raise issues!

## License

MIT
