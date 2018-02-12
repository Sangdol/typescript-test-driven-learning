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

    expect(new Greeter("world").greet()).toBe("Hello, world");
    expect(new Greeter("world").greeting).toBe("world");
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
    expect(p.name).toBe("abc");
  });
});