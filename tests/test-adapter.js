var test = require('tap').test
var Adapter = require('../')

var instance = new Adapter({})

test('Test functionality of adapter', function(t) {
  instance.start()
  instance.on('gif', function(url, metadata) {
      t.ok(url)
      t.ok(metadata)
      t.ok(metadata.origin)
      t.end()
  })
})
