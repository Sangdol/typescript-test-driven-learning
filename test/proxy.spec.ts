import "mocha";
import { expect } from "chai";

describe("Proxy", function (this: Mocha.Suite) {
  it("Basic", () => {
    type Target = Record<string, string>;
    const target: Target = {};
    const handler = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: function (target: Target, prop: string) {
        return `Hello, ${prop}`;
      },
    };
    const p = new Proxy(target, handler);
    expect(p.world).to.equal("Hello, world");

    p.abc = "abc";
    expect(p.abc).to.equal("Hello, abc");
    expect(target.abc).to.equal("abc");
  });

  it("Default value", () => {
    const numbers = [1, 2, 3];
    const p = new Proxy(numbers, {
      get: function (target: number[], prop: string) {
        if (prop in target) {
          return target[prop];
        }
        return 0;
      },
    });

    expect(p[1]).to.equal(2);
    expect(p[3]).to.equal(0);
  });

  it("Proxying a function", () => {
    const target = () => "I am the target";
    const handler = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      apply: function (target: () => string, thisArg: unknown, args: []) {
        return "I am the proxy";
      },
    };
    const p = new Proxy(target, handler);
    expect(p()).to.equal("I am the proxy");
  });

  it("Revocable", () => {
    type Target = Record<string, string>;
    const target: Target = {};
    const handler = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      get: function (target: Target, prop: string) {
        return `Hello, ${prop}`;
      },
    };
    const { proxy, revoke } = Proxy.revocable(target, handler);
    expect(proxy.world).to.equal("Hello, world");
    revoke();

    try {
      proxy.world;
      throw new Error("This should not happen");
    } catch (e) {
      // TypeError: Cannot perform 'get' on a proxy that has been revoked
      expect(e).to.be.instanceOf(TypeError);
    }
  });
});
