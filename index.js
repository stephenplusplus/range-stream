var through = require("through2")

module.exports = function (start, end) {
  end += 1
  var bytesReceived = 0
  var lastByteFound = false

  return through(function (chunk, enc, next) {
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
  })
}
