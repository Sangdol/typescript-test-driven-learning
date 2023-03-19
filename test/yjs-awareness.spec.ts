import "mocha";
import { expect } from "chai";

import {
  Doc as YDoc,
} from "yjs";

import * as awareness from "y-protocols/awareness";

/**
 * https://github.com/yjs/y-protocols/blob/master/awareness.test.js
 */
describe("yjs awareness", function (this: Mocha.Suite) {
  it("should sync awareness", async () => {
    const ydoc1 = new YDoc();
    ydoc1.clientID = 1;

    const ydoc2 = new YDoc();
    ydoc2.clientID = 2;

    const aw1 = new awareness.Awareness(ydoc1);
    const aw2 = new awareness.Awareness(ydoc2);

    // Doc: "Listens to awareness changes"
    // Why does it listen to state changes?
    aw1.on("update", ({ added, updated, removed }) => {
      const enc = awareness.encodeAwarenessUpdate(
        aw1,
        added.concat(updated).concat(removed)
      );
      awareness.applyAwarenessUpdate(aw2, enc, "custom");
    });

    expect(aw1.meta?.get(1)?.clock).to.equal(0);
    expect(aw2.meta?.get(1)?.clock).to.equal(undefined);

    console.log("aw1 meta", aw1.meta);
    console.log("aw2 meta", aw2.meta);

    aw1.setLocalState({ x: 3 });

    // Why from 1 unlike the original test code?
    expect(aw2.getStates().get(0)).to.equal(undefined);
    expect(aw2.getStates().get(1)).to.deep.equal({ x: 3 });

    // How does `clock` work?
    expect(aw2.meta?.get(2)?.clock).to.equal(0);
    expect(aw2.meta?.get(1)?.clock).to.equal(1);
    expect(aw1.meta?.get(1)?.clock).to.equal(1);
  });
});
