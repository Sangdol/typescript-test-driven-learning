import "mocha";
import { expect } from "chai";

import {
  Doc as YDoc,
  applyUpdate,
  encodeStateAsUpdate,
} from "yjs";

describe("yjs", function (this: Mocha.Suite) {
  it("should sync with remote doc", () => {
    const ydoc1 = new YDoc();
    const ydoc2 = new YDoc();

    const ytext1 = ydoc1.getText("sang");
    const ytext2 = ydoc2.getText("sang");

    ydoc1.on("update", (update) => {
      applyUpdate(ydoc2, update);
    });

    ytext1.insert(0, "Hello World");

    expect(ytext1.toString()).to.equal(ytext2.toString());
    expect(ytext2.toString()).to.equal("Hello World");

    ytext2.insert(0, "Hallo Welt ");

    // ytext1 didn't get updated
    expect(ytext1.toString()).to.not.equal(ytext2.toString());
    expect(ytext1.toString()).to.equal("Hello World");
    expect(ytext2.toString()).to.equal("Hallo Welt Hello World");

    ydoc2.on("update", (update) => {
      // This doesn't do anything once it misses the first update.
      applyUpdate(ydoc1, update);
    });

    ytext2.insert(0, "Hola Mundo ");

    // ytext1 didn't get updated yet.
    expect(ytext1.toString()).to.not.equal(ytext2.toString());
    expect(ytext1.toString()).to.equal("Hello World");
    expect(ytext2.toString()).to.equal("Hola Mundo Hallo Welt Hello World");

    applyUpdate(ydoc1, encodeStateAsUpdate(ydoc2));

    // ytext1 got updated.
    expect(ytext1.toString()).to.equal(ytext2.toString());
    expect(ytext1.toString()).to.equal("Hola Mundo Hallo Welt Hello World");
  });
});
