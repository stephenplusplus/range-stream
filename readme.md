# range-stream

> Receive a byte range from a readable stream


## Use
```sh
$ npm install --save range-stream
```
```js
var rangeStream = require("range-stream")

fs.createReadStream("file.txt").pipe(rangeStream(50, 100))
```

### Doesn't `fs.createReadStream` have `start` and `end` options?

Yes. And range-stream is meant to behave the same way when consuming a stream that doesn't give you those options.


## Limitations

range-stream currently only works with Buffer streams. Support for object mode is planned (PR welcome :+1:).


## API

### require("range-stream")(start, [end])

#### start

- Type: `Number`

The byte offset to begin consuming data from the source stream.

#### end

- Optional
- Type: `Number`

The byte offset that when hit will end the stream. If not set, the stream will run until all data is consumed.


## License

Copyright (c) 2014 Stephen Sawchuk. Licensed under the MIT license.