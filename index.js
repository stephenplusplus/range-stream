var Transform = require('stream').Transform


module.exports = function (start, end) {
  end = typeof end === 'number' ? end + 1 : Infinity

  var bytesReceived = 0
  var lastByteFound = false

  return new Transform({
    transform(chunk, enc, next) {
      bytesReceived += chunk.length
      if (!lastByteFound && bytesReceived >= start) {
        if (start - (bytesReceived - chunk.length) > 0)
          chunk = chunk.slice(start - (bytesReceived - chunk.length))

        if (end <= bytesReceived) {
          this.push(chunk.slice(0, chunk.length - (bytesReceived - end)))
          lastByteFound = true
        } else
          this.push(chunk)
      }
      next()
    }
  })
}
