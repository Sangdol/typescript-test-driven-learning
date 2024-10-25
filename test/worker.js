const { parentPort, workerData } = require('worker_threads')

function add(a, b) {
  return a + b;
}

if (parentPort) {
  parentPort.on('message', (message) => {
    parentPort.postMessage(add(message.a, message.b));
  });
}
