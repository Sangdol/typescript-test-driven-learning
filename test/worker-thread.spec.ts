import "mocha";
import { expect } from "chai";
import path from "path";

import { Worker } from 'worker_threads';

describe('Worker', () => {
  it('should be able to create a worker', (done) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'));
    worker.on('message', (result) => {
      expect(result).to.be.equal(3);
      done();
    });
    worker.postMessage({ a: 1, b: 2 });
  });
});
