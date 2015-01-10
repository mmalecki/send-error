var assert = require('assert')
var assertCb = require('assert-called')
var sendError = require('../')

var msg = 'some error message';

(sendError())({}, {
  writeHead: assertCb(function(statusCode, headers) {
    assert.equal(statusCode, 500)
    assert.deepEqual(headers, {'content-type': 'application/json'})
  }),
  end: assertCb(function(body) {
    var obj
    assert.doesNotThrow(function() {
      obj = JSON.parse(body)
    })
    assert.equal(obj.message, msg)
  })
}, new Error(msg))

var err = new Error(msg)
err.statusCode = 404;

(sendError())({}, {
  writeHead: assertCb(function(statusCode, headers) {
    assert.equal(statusCode, 404)
    assert.deepEqual(headers, {'content-type': 'application/json'})
  }),
  end: assertCb(function(body) {
    var obj
    assert.doesNotThrow(function() {
      obj = JSON.parse(body)
    })
    assert.equal(obj.message, msg)
    assert.equal(obj.statusCode, 404)
  })
}, err);

(sendError({
  contentType: 'application/error+json'
}))({}, {
  writeHead: assertCb(function(statusCode, headers) {
    assert.deepEqual(headers, {'content-type': 'application/error+json'})
  }),
  end: assertCb(function(){})
}, new Error())

err = new Error(msg)
err.foo = 42;

(sendError({
  exclude: ['foo']
}))({}, {
  writeHead: assertCb(function(){}),
  end: assertCb(function(body) {
    var obj
    assert.doesNotThrow(function() {
      obj = JSON.parse(body)
    })
    assert.equal(obj.message, msg)
    assert(!Object.hasOwnProperty(obj, 'foo'))
  })
}, err);

(sendError({
  onerror: assertCb(function(req, res, err) {
    assert.equal(err.message, msg)
  })
}))({}, {
  writeHead: assertCb(function(){}),
  end: assertCb(function(){})
}, new Error(msg))
