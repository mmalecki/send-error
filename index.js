function stringifyError(err, exclude) {
  var result = {};
  Object.getOwnPropertyNames(err).forEach(function (key) {
    if (exclude.indexOf(key) === -1) result[key] = err[key]
  })
  return JSON.stringify(result)
}

module.exports = function(options) {
  var opts = options || {}
  var exclude = opts.exclude || []
  var contentType = opts.contentType || 'application/json'
  var onerror = opts.onerror

  if (!opts.includeStack && exclude.indexOf('stack') === -1) exclude.push('stack')

  // `req` isn't currently needed, but it seems to be a convention across similar
  // modules. Let's keep it that way.
  return function(req, res, err) {
    if (onerror) onerror(req, res, err)
    res.writeHead(err.statusCode || 500, {'content-type': contentType})
    res.end(stringifyError(err, exclude))
  }
};
