import "mocha";
import { expect } from "chai";

describe("Class", function (this: Mocha.Suite) {
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
      private _name: string;

      constructor(name: string) {
        this._name = name;
      }

      get name() {
        return this._name;
      }
    }

    const p: Person = new Person("abc");
    expect(p.name).to.equal("abc");
  });

  it("private properties", () => {
    // # sign
    class Animal {
      #name: string;
      constructor(name: string) {
        this.#name = name;
      }

      getName() {
        return this.#name;
      }
    }

    const a = new Animal("abc");
    // This is not possible:
    //  Property '#name' is not accessible outside class 'Animal' because it has a private identifier. (tsserver 2341)
    //  Property '#name' is private and only accessible within class 'Animal'. (tsserver 18013)
    //  console.log(a.#name);

    expect(a.getName()).to.equal("abc");
  });

  it("instanceof", () => {
    class Mammal {}
    class Animal extends Mammal {}

    // inheritance with extends
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function Person() {}
    Person.prototype = Object.create(Mammal.prototype);

    const a: Animal = new Animal();
    const p = new Person();

    expect(a instanceof Animal).to.equal(true);
    expect(a instanceof Person).to.equal(false);
    expect(p instanceof Animal).to.equal(false);
    expect(p instanceof Person).to.equal(true);

    // prototype
    expect(Animal.prototype instanceof Animal).to.equal(false);
    expect(Person.prototype instanceof Person).to.equal(false);
    expect(Person.prototype instanceof Mammal).to.equal(true);

    // Everything is object
    expect(Animal.prototype instanceof Object).to.equal(true);

    // Everything is function
    expect(Animal instanceof Function).to.equal(true);
  });

  it("super", () => {
    class A {
      value: number;
      constructor() {
        this.value = 0;
      }
      increment() {
        this.value++;
      }
    }

    class B extends A {
      increment() {
        this.value += 2;
        super.increment();
      }
    }

    // Skip
    class C extends B {}

    class D extends C {
      increment() {
        this.value += 3;
        super.increment();
      }
    }

    const d = new D();

    expect(d.value).to.equal(0);

    d.increment();
    expect(d.value).to.equal(6);
  });
});
