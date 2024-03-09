import "mocha";
import { expect } from "chai";

describe("object", function (this: Mocha.Suite) {
  // https://javascript.info/property-descriptors
  it("Property flags and descriptors", () => {
    const user = {
      name: "John",
    };

    const descriptor = Object.getOwnPropertyDescriptor(user, "name");
    expect(descriptor).to.deep.equal({
      value: "John",
      writable: true,
      enumerable: true,
      configurable: true,
    });

    // Make name non-writable
    Object.defineProperty(user, "name", { writable: false });

    // Error: Cannot assign to read only property 'name' of object '#<Object>'
    //user.name = "Pete";

    expect(user.name).to.equal("John");

    // Make name non-enumerable
    Object.defineProperty(user, "name", { enumerable: false });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const _ in user) {
      throw new Error("No enumerable properties");
    }
    expect(Object.keys(user)).to.deep.equal([]);

    // Make name non-configurable
    Object.defineProperty(user, "name", { configurable: false });

    // Error: Cannot redefine property: name
    // Object.defineProperty(user, "name", { value: "Pete" });
  });
});
