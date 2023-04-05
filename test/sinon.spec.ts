import "mocha";
import sinon from "sinon";

function assert(condition: boolean) {
  if (!condition) {
    throw new Error("Assertion failed");
  }
}

/**
 * https://sinonjs.org/releases/latest/stubs/
 */
describe("sinon stub", () => {
  it("should stub work", () => {
    const stub = sinon.stub();
    stub.returns(42);
    assert(stub() === 42);
  });

  it("should stub work with obj", () => {
    const obj = {
      foo() {
        return 42;
      },
    };
    const stub = sinon.stub(obj, "foo").returns(42);
    assert(obj.foo() === 42);
    assert(stub.calledOnce);

    assert(obj.foo() === 42);
    assert(stub.calledTwice);

    stub.restore();

    assert(obj.foo() === 42);
    assert(stub.calledTwice);
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

/**
 * https://sinonjs.org/releases/latest/spies/
 */
describe("sinon spy", () => {
  it("should spy work", () => {
    const spy = sinon.spy();
    spy();
    assert(spy.called);
  });

  it("should spy work with args", () => {
    const spy = sinon.spy();
    spy(42);
    assert(spy.calledWith(42));
  });

  it("should spy work with obj", () => {
    const obj = {
      foo() {
        return 42;
      },
    };
    const spy = sinon.spy(obj, "foo");
    assert(obj.foo() === 42);
    assert(spy.calledOnce);

    assert(obj.foo() === 42);
    assert(spy.calledTwice);

    spy.restore();

    assert(obj.foo() === 42);
    assert(spy.calledTwice);
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

  it("should fake work with obj", () => {
    const obj = {
      foo() {
        return 42;
      },
    };
    const fake = sinon.fake.returns(42);
    sinon.replace(obj, "foo", fake);
    assert(obj.foo() === 42);
    assert(fake.calledOnce);

    assert(obj.foo() === 42);
    assert(fake.calledTwice);

    sinon.restore();

    assert(obj.foo() === 42);
    assert(fake.calledTwice);
  });
});

describe("sinon fake timer", () => {
  it("should fake timer work", () => {
    const clock = sinon.useFakeTimers();
    const callback = sinon.fake();
    setTimeout(callback, 1000);
    clock.tick(1000);
    assert(callback.calledOnce);
    clock.restore();
  });

  it("should fake timer set date work", () => {
    const clock = sinon.useFakeTimers(new Date(2019, 1, 1));

    assert(new Date().getTime() === new Date(2019, 1, 1).getTime());

    // Back to the future
    clock.restore();
    assert(new Date().getTime() !== new Date(2019, 1, 1).getTime());
  });
});
