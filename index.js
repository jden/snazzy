'use strict'
module.exports = StandardCodeclimateTransform

var inherits = require('inherits')
var stream = require('stream')
var standardJson = require('standard-json')

inherits(StandardCodeclimateTransform, stream.Transform)

function StandardCodeclimateTransform (opts) {
  if (!(this instanceof StandardCodeclimateTransform)) {
    return new StandardCodeclimateTransform(opts)
  }
  stream.Transform.call(this, opts)
  this.opts = opts || {}
  this._buffer = []
}

StandardCodeclimateTransform.prototype._transform = function (chunk, encoding, cb) {
  this._buffer.push(chunk)
  cb(null)
}

StandardCodeclimateTransform.prototype._flush = function (cb) {
  var lines = Buffer.concat(this._buffer).toString()
  var jsonResults = standardJson(lines, {noisey: true})

  jsonResults.forEach(file => {
    file.messages.forEach(message => {
      const codeclimateMessage = formatMessage(message, file)
      let messageString = JSON.stringify(codeclimateMessage)

      // code climate requires null-byte delimiters
      if (this.opts.nullDelimited) {
        messageString += '\0'
      } else {
        messageString += '\n'
      }

      this.push(messageString)
    })
  })
  cb(null)
}

function formatMessage (message, file) {
  return {
    type: 'issue',
    check_name: message.ruleId || message.message,
    description: message.message,
    // content: Content,
    categories: ['Style'],
    location: {
      path: file.filePath,
      begin: {
        line: message.line,
        column: message.column
      },
      end: {
        line: message.line,
        column: message.column
      }
    }
    // other_locations: [Location],
    // remediation_points: 500,
    // severity: Severity
  }
}
