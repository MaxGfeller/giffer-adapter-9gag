var test = require('tap').test
var Adapter = require('../')

var instance = new Adapter({})

test('Test functionality of adapter', function(t) {
  instance.start()
  instance.on('gif', function(url) {
      t.ok(url)
      t.end()
  })
})
