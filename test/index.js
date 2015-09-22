var rangeStream = require("../")
var assert = require("assert")
var fs = require("fs")

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