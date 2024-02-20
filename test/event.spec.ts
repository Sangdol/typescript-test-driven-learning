import "mocha";
import { expect } from "chai";

describe("Event", function (this: Mocha.Suite) {
  it("should work", () => {
    const event = new Event("click");
    expect(event.type).to.equal("click");
  });

  it("should work with options", () => {
    const event = new Event("click", {
      bubbles: true,
      cancelable: true,
    });
    expect(event.bubbles).to.be.true;
    expect(event.cancelable).to.be.true;
  });

  it("should work with custom event", () => {
    class MyEvent extends Event {
      constructor() {
        super("click");
      }
    }

    const event = new MyEvent();
    expect(event.type).to.equal("click");
  });

  it("should work with custom event and options", () => {
    class MyEvent extends Event {
      constructor() {
        super("click", {
          bubbles: true,
          cancelable: true,
        });
      }
    }

    const event = new MyEvent();
    expect(event.bubbles).to.be.true;
    expect(event.cancelable).to.be.true;
  });
});

describe("MessageEvent", function (this: Mocha.Suite) {
  it("should work", () => {
    const event = new MessageEvent("message");
    expect(event.type).to.equal("message");
  });

  it("should work with options", () => {
    const event = new MessageEvent("message", {
      data: "Hello",
      origin: "http://localhost",
    });
    expect(event.data).to.equal("Hello");
    expect(event.origin).to.equal("http://localhost");
  });
});

describe("dispatchEvent", function (this: Mocha.Suite) {
  it("should work", (done) => {
    class Target extends EventTarget {}

    const event = new Event("click");
    const target = new Target();
    target.addEventListener("click", () => {
      done();
    });
    target.dispatchEvent(event);
  });
});
