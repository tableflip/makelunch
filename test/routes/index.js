var routes = require('../../routes')
var test = require('tape')

test('Can list routes', function (t) {
  var arr = routes()
  t.ok(arr && arr.length, 'Routes found')
  t.end()
})
