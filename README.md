# send-error
Send errors as HTTP bodies, with some opinionated, but sensible defaults and
conventions.

## Why?
Because errors are important, and I found that having a convention around them
helps with making sure that they end up being handled and reported.

## How?
```js
var http = require('http')
var sendError = require('send-error')()
var db = require('./db.js')()

function NotFoundError(msg) {
  this.statusCode = 404
  Error.call(this, msg || 'Not found')
}

http.createServer(function(req, res) {
  db.get('foo', function(err, entity) {
    if (err) return sendError(req, res, err)
    if (!entity) return sendError(req, res, new NotFoundError())
    res.writeHead(200, {'content-type': 'application/json'})
    res.end(JSON.stringify(entity))
  })
})
```

## API

### `SendError(options)`

* `options` - optional
  * `options.contentType` (`String`, optional, defaults to `'application/json'`) -
    what Content-Type header to use for errors. This might be useful if your service
    defines its own Content-Type .
  * `options.exclude` (`Array`, optional, defaults to `[]`)- which error properties
    to exlude from the stringified error.
  * `options.includeStack` (`Boolean`)- whether to include stack trace. As
    including the stack trace in the error is a potential security risk (also,
    users of your API rarely care about it and you should be reporting it
    somewhere yourself), this option defaults to `false`.
  * `onerror` (`Function(http.IncomingMessage, http.ServerResponse, Error)`, optional) -
    a function to call when the function returned by the constructor is called.
    When called, it's passed the request, response and error.

### `sendError(req, res, error)`
Returned by the `SendError` constructor.

* `req` (`http.IncomingMessage`)
* `req` (`http.ServerResponse`)\
* `err` (`Error`) - error you want to be sent
