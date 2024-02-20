import { assert } from "chai";

describe("ArrayBuffer tests", () => {
  it("should work", () => {
    const buffer = new ArrayBuffer(16);
    const view = new Uint32Array(buffer);
    view[0] = 1;
    view[1] = 2;
    view[2] = 3;
    view[3] = 4;
    assert.equal(view[0], 1);
    assert.equal(view[1], 2);
    assert.equal(view[2], 3);
    assert.equal(view[3], 4);
  });

  it("should work with a slice", () => {
    const buffer = new ArrayBuffer(16);
    const view = new Uint32Array(buffer);
    view[0] = 1;
    view[1] = 2;
    view[2] = 3;
    view[3] = 4;
    const slice = buffer.slice(4, 12);
    const sliceView = new Uint32Array(slice);
    assert.equal(sliceView[0], 2);
    assert.equal(sliceView[1], 3);
  });

  it("should work with a copy", () => {
    const buffer = new ArrayBuffer(16);
    const view = new Uint32Array(buffer);
    view[0] = 1;
    view[1] = 2;
    view[2] = 3;
    view[3] = 4;
    const copy = buffer.slice(0, 16);
    const copyView = new Uint32Array(copy);
    assert.equal(copyView[0], 1);
    assert.equal(copyView[1], 2);
    assert.equal(copyView[2], 3);
    assert.equal(copyView[3], 4);
  });

  it("should work with implicit array buffer", () => {
    const view = new Uint32Array(4);
    view[0] = 1;
    view[1] = 2;
    view[2] = 3;
    view[3] = 4;
    assert.equal(view[0], 1);
    assert.equal(view[1], 2);
    assert.equal(view[2], 3);
    assert.equal(view[3], 4);
  });
});
