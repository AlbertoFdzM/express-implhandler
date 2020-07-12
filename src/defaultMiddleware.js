/**
 * Default middleware
 */
const defaultMiddleware = (req, res, next) => {
  const err = new Error('Not implemented')

  err.status = 501

  return next(err)
}

module.exports = defaultMiddleware
