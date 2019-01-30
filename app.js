/* globals require, process */
'use strict';

var {spawn, exec} = require('child_process');
var childs = {};

process.on('exit', () => Object.keys(childs).forEach(name => childs[name].kill()));

// closing node when parent process is killed
process.stdin.on('end', () => process.exit());

/* message passing */
var nativeMessage = require('./messaging');
nativeMessage.onMessage.addListener(request => {
  if (request.method === 'spawn') {
    const sp = spawn(request.command, request.arguments);
    childs[request.id] = sp;

    sp.stdout.on('data', stdout => nativeMessage.postMessage({
      stdout: String(stdout),
      id: request.id
    }));
    sp.stderr.on('data', stderr => nativeMessage.postMessage({
      stderr: String(stderr),
      id: request.id
    }));
    sp.on('close', code => {
      delete childs[request.id];
      nativeMessage.postMessage({
        code,
        id: request.id
      });
    });
  }
  else if (request.method === 'kill') {
    request.ids.forEach(id => {
      if (childs[id]) {
        childs[id].kill();
        delete childs[id];
      }
    });
  }
  else if (request.method === 'exec') {
    exec(request.command);
  }
});

