# Express implHandler

[![Build Status](https://travis-ci.org/AlbertoFdzM/express-implhandler.svg?branch=master)](https://travis-ci.org/AlbertoFdzM/express-implhandler) [![codecov](https://codecov.io/gh/AlbertoFdzM/express-implhandler/branch/develop/graph/badge.svg)](https://codecov.io/gh/AlbertoFdzM/express-implhandler) [![Known Vulnerabilities](https://snyk.io/test/github/AlbertoFdzM/express-implhandler/badge.svg?targetFile=package.json)](https://snyk.io/test/github/AlbertoFdzM/express-implhandler?targetFile=package.json)

[![NPM](https://nodei.co/npm/express-implhandler.png)](https://nodei.co/npm/express-implhandler/)

Simple express method implementation script to catch error code 501

This script is useful if you're developing an API with [Express](https://expressjs.com/) or you'd like to set a default 501 error for your actual server endpoints unused verbs.

```javascript
const implHandler = require('express-implhandler')

implHandler(app)
```

## Example of use

Put this inside your API router just before the 404 error catcher.

Root API endpoint (`/api/v1`) router example:

```javascript
const express = require('express')
const router = express.Router()
const implHandler = require('express-implhandler')

const users = require('./users')
const cars = require('./cars')

// define your routes
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to this awesome API!'
  })
})

router.use('/users', users)
router.use('/cars', cars)

// catch 501 and forward to error handler
implHandler(router, (req, res, next) => {
  const err = new Error('Not implemented')

  err.status = 501

  return next(err)
})

// catch 404 and forward to error handler
// ...

// JSON error middleware

module.exports = router
```

Then if you try to call to your API  endpoints with some method not defined you will receive a 501 response code. For example if you try to make a request `PUT /api/v1/` the server will return a [`501` HTTP code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501) with the next content:

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

_**Note:** Pay attention that before call this script the router must have the endpoints registered in order to handle them._

### `middleware` (optional)

**Default:***
```javascript
implHandler(app, (req, res, next) => {
  const err = new Error('Not implemented')

  err.status = 501

  return next(err)
})
```

You can override the default middleware with one of your preference:
```javascript
implHandler(app, (req, res, next) => {
  const err = new Error(
    'Method not yet implemented. Please refer to API docs for more info'
  )

  err.status = 501

  return next(err)
})
```

## Collaborate

Feel free to make pull request or raise issues!

## License

MIT
