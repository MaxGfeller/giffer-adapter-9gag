var EventEmitter = require('events').EventEmitter
var inherits = require('util').inherits
var http = require('http')
var concat = require('concat-stream')
var request = require('request')

inherits(Adapter, EventEmitter)

    function Adapter(config) {
        this.page = config.page || 'hot'
        this.apiEndpoint = config.apiEndpoint || 'http://infinigag.eu01.aws.af.cm'
        this.maxPages = config.maxPages || 1
        EventEmitter.call(this)
    }

Adapter.prototype.start = function() {
    this.emit('start')
    this._numOfPages = 0

    this._getPage('0')
}

Adapter.prototype.stop = function() {
    this.emit('stop')
}

Adapter.prototype._getPage = function(id) {
    var self = this
    request(this.apiEndpoint + '/' + this.page + '/' + id, function(err, res, body) {
        if (err) throw err

        var obj = null
        try {
            obj = JSON.parse(body)
        } catch(e) {
            console.error(e)
            return self.stop()
        }

        if(!obj.data) return self.stop()

        obj.data.map(function(gag) {
            request(gag.link, function(err, res, body) {
                if (err) throw err

                body.split(' ').forEach(function(str) {
                    if (str.indexOf('cloudfront.net/photo') > -1 && str.indexOf('src') > -1 && str.indexOf('.gif') > -1) {
                        self.emit('gif', str.substring(str.indexOf('"')).replace(/"/g, ''), { origin: gag.link })
                    }
                })
            })
        })

        this._numOfPages++

        if (this._numOfPages < this.maxPages)
            return this._getPage(obj.paging.next)

        this.stop()
    }.bind(this))
}

module.exports = Adapter
