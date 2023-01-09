import { expect } from "chai";


describe("Class", () => {
  it("Basic", () => {
    class Greeter {
      greeting: string;
      constructor(message: string) {
        this.greeting = message;
      }
      greet() {
        return "Hello, " + this.greeting;
      }
    }

    expect(new Greeter("world").greet()).to.equal("Hello, world");
    expect(new Greeter("world").greeting).to.equal("world");
  });

  it("Accessors", () => {
    class Person {
      private _name;

      set name(name: string) {
        this._name = name;
      }

      get name() {
        return this._name;
      }
    }

    const p: Person = new Person();
    p.name = "abc";
    expect(p.name).to.equal("abc");
  });
});
