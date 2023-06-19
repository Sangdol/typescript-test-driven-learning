/**
 * lib0 is a dependency of yjs
 * https://github.com/dmonad/lib0
 */
import "mocha";
import { expect } from "chai";
import { encoding, decoding } from "lib0";

describe("lib0", function (this: Mocha.Suite) {
  it("should encoding and decoding work", () => {
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, 123);
    encoding.writeVarString(encoder, "Hello World");
    const buf = encoding.toUint8Array(encoder);

    // 123 + 11 (length of the string) + ASCII codes of the string
    expect(buf).to.deep.equal(
      new Uint8Array([
        123, 11, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100,
      ])
    );

    const decoder = decoding.createDecoder(buf);
    expect(decoding.readVarUint(decoder)).to.equal(123);
    expect(decoding.readVarString(decoder)).to.equal("Hello World");
    expect(decoding.hasContent(decoder)).to.equal(false);

    // Throws an error when trying to read more than available.
    expect(() => decoding.readVarString(decoder)).to.throw();
  });

  it("should encoding and decoding work with Koreans", () => {
    const encoder = encoding.createEncoder();
    encoding.writeVarString(encoder, "안녕하세요");
    encoding.writeVarString(encoder, "Hallo Welt");

    const buf = encoding.toUint8Array(encoder);

    const decoder = decoding.createDecoder(buf);
    expect(decoding.readVarString(decoder)).to.equal("안녕하세요");
    expect(decoding.readVarString(decoder)).to.equal("Hallo Welt");
    expect(decoding.hasContent(decoder)).to.equal(false);
  });
});
