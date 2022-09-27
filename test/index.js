var Readable    = require("stream").Readable
var assert      = require("assert")
var fs          = require("fs")
var pipeline    = require("stream").pipeline // as of node v10
var rangeStream = require("../")


// generate an infinite readable stream
function infiniteStream () {
  return new Readable({
    async read (/*size*/) {
      this.push('here'+Math.random())  // just keep on generatin' data
    }
  })
}


describe("range-stream", function () {
  it("behaves like fs.createReadStream options open/close offsets", function (done) {
    var textFile = "./test/fixtures/big-text-file.txt"

    var start = 1510
    var end = 29090

    var fsWritten = ""
    var rangeWritten = ""

    fs.createReadStream(textFile, { start: start, end: end })
      .on("data", function (chunk) { fsWritten += chunk.toString() })
      .on("end", function () {

        fs.createReadStream(textFile)
          .pipe(rangeStream(start, end))
          .on("data", function (chunk) { rangeWritten += chunk.toString() })
          .on("end", function () {

            assert.equal(fsWritten, rangeWritten)
            done()
          })
      })
  })

  it("closes the range stream after last bytes is read", function (done) {
    var result = ""

    pipeline(
      infiniteStream(),
      rangeStream(5, 4096).on('data', (dat) => {
        result += dat.toString()
      }),
      (err) => {
        assert.equal(result.length, 4092)
        done()
      }
    )
  })

  it("does not require an end", function (done) {
    var textFile = "./test/fixtures/big-text-file.txt"

    var start = 1510

    var fsWritten = ""
    var rangeWritten = ""

    fs.createReadStream(textFile, { start: start })
      .on("data", function (chunk) { fsWritten += chunk.toString() })
      .on("end", function () {

        fs.createReadStream(textFile)
          .pipe(rangeStream(start))
          .on("data", function (chunk) { rangeWritten += chunk.toString() })
          .on("end", function () {

            assert.equal(fsWritten, rangeWritten)
            done()
          })
      })
  })
})
