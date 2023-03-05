import "mocha";
import sinon from "sinon";

function assert(condition: boolean) {
  if (!condition) {
    throw new Error("Assertion failed");
  }
}

describe("sinon spy", () => {
  it("should spy work", () => {
    const spy = sinon.spy();
    spy();
    assert(spy.called);
  });
});

describe("sinon stub", () => {
  it("should stub work", () => {
    const stub = sinon.stub();
    stub.returns(42);
    assert(stub() === 42);
  });
});

/**
 * https://sinonjs.org/releases/latest/fakes/
 */
describe("sinon fake", () => {
  it("should fake work", () => {
    const fake = sinon.fake.returns(42);
    assert(fake() === 42);
  });
});

/**
 * https://sinonjs.org/releases/latest/mocks/
 */
describe("sinon mock", () => {
  it("should mock work", () => {
    const myObj = {
      foo() {
        return 42;
      },
    };

    const mock = sinon.mock(myObj);
    mock.expects("foo").once().returns(42);

    assert(myObj.foo() === 42);
    mock.verify();
  });
});
