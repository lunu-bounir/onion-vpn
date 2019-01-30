'use strict';

var stream = require('stream');

var buffer = Buffer.alloc(0); // contains all binaries that are not yet parsed
var length = false; // if number, parse this length of messaging.buffer
var observers = [];

var parse = () => {
  // parse message length
  if (length === false && buffer.length >= 4) {
    length = buffer.readUInt32LE(0);
    // Remove the length bytes from the buffer.
    buffer = buffer.slice(4);
  }
  // parse message
  if (length !== false && buffer.length >= length) {
    const binary = buffer.slice(0, length);
    // Remove the bytes for the message from the buffer.
    buffer = buffer.slice(length);
    // Clear the length so we know we need to parse it again.
    length = false;
    // Parse the message bytes.
    observers.forEach(c => c(JSON.parse(binary.toString())));
    parse();
  }
};

class Input extends stream.Transform {
  constructor() {
    super({
      readableObjectMode: true,
      writableObjectMode: false,
      transform(chunk, encoding, done) {
        buffer = Buffer.concat([buffer, chunk]);
        parse();
        done();
      }
    });
  }
}
process.stdin.resume();
process.stdin.pipe(new Input());

class Output extends stream.Transform {
  constructor() {
    super({
      readableObjectMode: false,
      writableObjectMode: true,
      transform(object, encoding, done) {
        const len = Buffer.alloc(4);
        const buf = Buffer.from(JSON.stringify(object));
        len.writeUInt32LE(buf.length, 0);
        this.push(len);
        this.push(buf);
        done();
      }
    });
  }
}

exports.onMessage = {};
exports.onMessage.addListener = callback => {
  observers.push(callback);
};
exports.postMessage = obj => {
  const output = new Output();
  output.pipe(process.stdout);
  output.end(obj);
};
