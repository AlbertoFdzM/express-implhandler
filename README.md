# Express implHandler

Simple express method implementation script to catch error code 501

This script is useful if you'r developing an API with express or you'd like to set a default 501 response for your actual server endpoints.

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
implHandler(router);

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

The only argument that you will need to pass to the script is your router instance (`router`) or your app router instance (`app._router`).

_**Note:** Pay attention that before call this script the router must have the endpoints registered due to handle them._

## Colaborate

Feel free to make pull request or raise issues!

## License

MIT
