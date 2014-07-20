var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits
var http = require('http')
var concat = require('concat-stream')
var request = require('request')

inherits(Adapter, EventEmitter)

function Adapter(config) {
  this.page = config.page || 'hot'
  this.apiEndpoint = config.apiEndpoint || 'http://infinigag.eu01.aws.af.cm'
  EventEmitter.call(this)
}

Adapter.prototype.start = function() {
  this.emit('start')
  this.currentPage = 0

  var self = this
  request(this.apiEndpoint + '/' + this.page + '/0', function(err, res, body) {
    if(err) throw err

    var obj = JSON.parse(body)
    obj.data.forEach(function(gag) {
      request(gag.link, function (err, res, body) {
        if(err) throw err

        // console.log(body.match(/|http:\/\/d24w6bsrhbeh9d\.cloudfront\.net\/photo\/.+?\.gif/g))
        body.split(' ').forEach(function(str) {
            if(str.indexOf('cloudfront.net/photo') > -1
                && str.indexOf('src') > -1
                && str.indexOf('.gif') > -1) {
                    self.emit('gif', str.substring(str.indexOf('"')).replace(/"/g, ''))
                }
        })
      })
    })
  })
}

Adapter.prototype.stop = function() {
  this.emit('stop')
  // stop grabbing gifs
}

module.exports = Adapter
