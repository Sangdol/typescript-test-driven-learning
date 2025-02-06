import "mocha";
import { expect } from "chai";
import _ from "lodash";

import {
  Doc as YDoc,
  applyUpdate,
  encodeStateAsUpdate,
  encodeStateVector,
  encodeStateVectorFromUpdate,
  diffUpdate,
  mergeUpdates,
} from "yjs";

describe("yjs update", function (this: Mocha.Suite) {
  it("should sync with remote doc with applyUpdate and encodeStateAsUpdate", () => {
    const ydoc1 = new YDoc();
    const ydoc2 = new YDoc();

    const ytext1 = ydoc1.getText("sang");
    const ytext2 = ydoc2.getText("sang");

    ydoc1.on("update", (update) => {
      console.log("ydoc1 update", update);

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

  it("should sync with remote doc with applyUpdate and encodeStateAsUpdate - map", () => {
    const ydoc1 = new YDoc();
    const ydoc2 = new YDoc();

    const ymap1 = ydoc1.getMap("map");
    const ymap2 = ydoc2.getMap("map");

    ydoc1.on("update", (update) => {
      applyUpdate(ydoc2, update);
    });

    ymap1.set("key", "value");

    expect(ymap1.get("key")).to.equal(ymap2.get("key"));
    expect(ymap2.get("key")).to.equal("value");

    ymap2.set("key", "value2");

    expect(ymap1.get("key")).to.not.equal(ymap2.get("key"));
    expect(ymap1.get("key")).to.equal("value");
    expect(ymap2.get("key")).to.equal("value2");

    ydoc2.on("update", (update) => {
      applyUpdate(ydoc1, update);
    });

    ymap2.set("key", "value3");

    expect(ymap1.get("key")).to.not.equal(ymap2.get("key"));
    expect(ymap1.get("key")).to.equal("value");
    expect(ymap2.get("key")).to.equal("value3");

    applyUpdate(ydoc1, encodeStateAsUpdate(ydoc2));

    expect(ymap1.get("key")).to.equal(ymap2.get("key"));
    expect(ymap1.get("key")).to.equal("value3");
  });

  it("should sync with remote doc with applyUpdate with state vector", () => {
    const ydoc1 = new YDoc();
    const ydoc2 = new YDoc();

    const ytext1 = ydoc1.getText("sang");
    const ytext2 = ydoc2.getText("sang");

    ytext1.insert(0, "Hello World ");
    ytext2.insert(0, "Hallo Welt ");

    const stateVector1 = encodeStateVector(ydoc1);
    const stateVector2 = encodeStateVector(ydoc2);

    // This can reduce the size of the update.
    const diff1 = encodeStateAsUpdate(ydoc2, stateVector1);
    applyUpdate(ydoc1, diff1);

    // The insert order is not guaranteed.
    expect(ytext1.toString()).to.satisfy((text: string) => {
      return (
        text === "Hallo Welt Hello World " || text === "Hello World Hallo Welt "
      );
    });

    expect(ytext1.toString()).to.not.equal(ytext2.toString());

    const diff2 = encodeStateAsUpdate(ydoc1, stateVector2);
    applyUpdate(ydoc2, diff2);
    expect(ytext1.toString()).to.equal(ytext2.toString());
  });

  it("should sync without loading the Y.Doc using encodeStateAsUpdate", () => {
    const ydoc1 = new YDoc();
    const ydoc2 = new YDoc();

    const ytext1 = ydoc1.getText("sang");
    const ytext2 = ydoc2.getText("sang");

    ytext1.insert(0, "Hello World");
    ytext2.insert(0, "Hallo Welt ");

    const update1 = encodeStateAsUpdate(ydoc1);
    const update2 = encodeStateAsUpdate(ydoc2);

    ydoc1.destroy();
    ydoc2.destroy();

    const stateVector1 = encodeStateVectorFromUpdate(update1);
    const stateVector2 = encodeStateVectorFromUpdate(update2);

    const diff1 = diffUpdate(update2, stateVector1);
    const diff2 = diffUpdate(update1, stateVector2);

    const newState1 = mergeUpdates([update1, diff1]);
    const newState2 = mergeUpdates([update2, diff2]);

    const newYDoc1 = new YDoc();
    const newYDoc2 = new YDoc();

    applyUpdate(newYDoc1, newState1);
    applyUpdate(newYDoc2, newState2);

    expect(newYDoc1.getText("sang").toString()).to.equal(
      newYDoc2.getText("sang").toString()
    );
  });

  it("should json has all information", () => {
    const ydoc = new YDoc();
    const ytext = ydoc.getText("sang");

    ytext.insert(0, "Hello World");
    expect(ytext.toJSON()).to.deep.equal("Hello World");

    ytext.insert(1, "e");
    expect(ytext.toJSON()).to.deep.equal("Heello World");

    expect(ydoc.toJSON()).to.deep.equal({
      sang: "Heello World",
    });

    ytext.delete(1, 1);
    expect(ydoc.toJSON()).to.deep.equal({
      sang: "Hello World",
    });

    const ymap = ydoc.getMap("map");
    ymap.set("key", "value");
    expect(ydoc.toJSON()).to.deep.equal({
      sang: "Hello World",
      map: {
        key: "value",
      },
    });
  });

  it("should encoded size by encodeStateAsUpdate only increase", () => {
    const ydoc = new YDoc();
    const ytext = ydoc.getText("sang");

    expect(encodeStateAsUpdate(ydoc).byteLength).to.equal(2);

    ytext.insert(0, "Hello World");
    expect(encodeStateAsUpdate(ydoc).byteLength).to.equal(28);

    ytext.delete(0, 1);
    expect(encodeStateAsUpdate(ydoc).byteLength).to.equal(43);
  });

  it("should debounce updates with lodash", async () => {
    const ydoc1 = new YDoc();
    const ydoc2 = new YDoc();

    const ytext1 = ydoc1.getText("sang");
    const ytext2 = ydoc2.getText("sang");

    const update = new Promise((resolve) => {
      ydoc1.on(
        "update",
        _.debounce((update) => {
          applyUpdate(ydoc2, update);
          resolve("done");
        }, 100)
      );
    });

    ytext1.insert(0, "Hello World1 ");
    ytext1.insert(0, "Hello World2 ");

    await update;

    // This actually doesn't work.
    expect(ytext1.toString()).to.not.equal(ytext2.toString());
    expect(ytext1.toString()).to.equal("Hello World2 Hello World1 ");
    expect(ytext2.toString()).to.equal("");
  });

  it("should encodeStateAsUpdate add up", () => {
    const ydoc1 = new YDoc();
    const ydoc2 = new YDoc();

    const ytext1 = ydoc1.getText("sang");
    const ytext2 = ydoc2.getText("sang");

    ytext1.insert(0, "Hello World ");
    ytext2.insert(0, "Hello World ");

    applyUpdate(ydoc1, encodeStateAsUpdate(ydoc2));

    expect(ytext1.toString()).to.equal("Hello World Hello World ");
  });
});
