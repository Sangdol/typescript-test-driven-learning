import "mocha";
import { expect } from "chai";

describe("Utility types", function (this: Mocha.Suite) {
  it("Awaited", async () => {
    type PromiseType = Promise<string>;
    type AwaitedPromiseType = Awaited<PromiseType>;
    const value: AwaitedPromiseType = "Hello";
    expect(value).to.equal("Hello");

    type PromiseType2 = Promise<Promise<string>>;
    type AwaitedPromiseType2 = Awaited<PromiseType2>;
    const value2: AwaitedPromiseType2 = "Hello";
    expect(value2).to.equal("Hello");

    type AwaitedPromiseType3 = Awaited<number | Promise<string>>;
    const value3: AwaitedPromiseType3 = "Hello";
    expect(value3).to.equal("Hello");
    const value4: AwaitedPromiseType3 = 42;
    expect(value4).to.equal(42);
  });

  it("Partial", () => {
    interface User {
      name: string;
      age: number;
    }

    function updateUser(user: User, updates: Partial<User>) {
      return { ...user, ...updates };
    }

    const user: User = { name: "John", age: 30 };
    const updatedUser = updateUser(user, { age: 31 });

    expect(updatedUser).to.deep.equal({ name: "John", age: 31 });
  });

  // Opposite of Partial
  it("Required", () => {
    interface User {
      name: string;
      age?: number;
    }

    function createUser(user: Required<User>) {
      return user;
    }

    // This is not allowed
    //const user = createUser({ name: "John" });

    const user = createUser({ name: "John", age: 30 });
    expect(user).to.deep.equal({ name: "John", age: 30 });
  });

  it("Readonly", () => {
    const arr = [3, 1, 2];

    function sort(arr: ReadonlyArray<number>) {
      // This is not allowed
      // arr.sort()

      return arr.slice().sort();
    }

    const sorted = sort(arr);
    expect(sorted).to.deep.equal([1, 2, 3]);
    expect(arr).to.deep.equal([3, 1, 2]);
  });

  it("Record", () => {
    type Keys = "1" | "2";
    type User = { name: string; age: number };

    const users2: Record<Keys, User> = {
      "1": { name: "John", age: 30 },
      "2": { name: "Jane", age: 25 },
    };

    expect(users2["1"]).to.deep.equal({ name: "John", age: 30 });
    expect(users2["2"]).to.deep.equal({ name: "Jane", age: 25 });
  });

  it("Pick", () => {
    interface User {
      name: string;
      age: number;
      email: string;
    }

    type UserWithoutEmail = Pick<User, "name" | "age">;

    const user: UserWithoutEmail = { name: "John", age: 30 };
    expect(user).to.deep.equal({ name: "John", age: 30 });
  });

  // Opposite of Pick
  it("Omit", () => {
    interface User {
      name: string;
      age: number;
      email: string;
    }

    type UserWithoutEmail = Omit<User, "email">;

    const user: UserWithoutEmail = { name: "John", age: 30 };
    expect(user).to.deep.equal({ name: "John", age: 30 });
  });

  it("Exclude", () => {
    type T0 = Exclude<"a" | "b" | "c", "a">;
    const t0: T0 = "b";
    expect(t0).to.equal("b");

    type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
    const t1: T1 = "c";
    expect(t1).to.equal("c");

    // eslint-disable-next-line @typescript-eslint/ban-types
    type T2 = Exclude<string | number | (() => void), Function>;
    const t2: T2 = "a";
    expect(t2).to.equal("a");
  });

  it("Extract", () => {
    type T0 = Extract<"a" | "b" | "c", "a" | "b">;
    const t0: T0 = "a";
    expect(t0).to.equal("a");

    // eslint-disable-next-line @typescript-eslint/ban-types
    type T1 = Extract<string | number | (() => void), Function>;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const t1: T1 = () => {};
    expect(t1).to.be.a("function");
  });

  it("NonNullable", () => {
    type T0 = NonNullable<string | number | undefined | null>;
    const t0: T0 = "a";
    expect(t0).to.equal("a");

    // This is not allowed
    //const t00: T0 = undefined;
  });

  it("Parameters", () => {
    type T0 = Parameters<() => void>;
    const t0: T0 = [];
    expect(t0).to.deep.equal([]);

    type T1 = Parameters<(a: number, b: string) => void>;
    const t1: T1 = [42, "hello"];
    expect(t1).to.deep.equal([42, "hello"]);

    // Practical example
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function call(f: (...args: any[]) => any, ...args: Parameters<typeof f>) {
      return f(...args);
    }

    const result = call((a: number, b: string) => a + b.length, 42, "hello");
    expect(result).to.equal(47);
  });

  it("ConstructorParameters", () => {
    class User {
      // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
      constructor(name: string, age: number) {}
    }

    type T0 = ConstructorParameters<typeof User>;
    const t0: T0 = ["John", 30];
    expect(t0).to.deep.equal(["John", 30]);

    // Practical example
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function createInstance<T extends new (...args: any[]) => any>(
      ctor: T,
      ...args: ConstructorParameters<T>
    ) {
      return new ctor(...args);
    }

    const user = createInstance(User, "John", 30);
    expect(user).to.be.instanceOf(User);
  });

  it("ReturnType", () => {
    type T0 = ReturnType<() => string>;
    const t0: T0 = "Hello";
    expect(t0).to.equal("Hello");

    type T1 = ReturnType<(a: number, b: string) => number>;
    const t1: T1 = 42;
    expect(t1).to.equal(42);
  });

  it("InstanceType", () => {
    class Car {
      constructor(public model: string, public year: number) {}
    }

    class Bike {
      constructor(public type: string, public gearCount: number) {}
    }

    // Generic factory function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function createInstance<C extends new (...args: any[]) => any>(
      ctor: C,
      ...args: ConstructorParameters<C>
    ): InstanceType<C> {
      return new ctor(...args);
    }

    const car = createInstance(Car, "Tesla", 2020);
    const bike = createInstance(Bike, "Mountain", 21);

    expect(car).to.be.instanceOf(Car);
    expect(car.model).to.equal("Tesla");
    expect(car.year).to.equal(2020);

    expect(bike).to.be.instanceOf(Bike);
    expect(bike.type).to.equal("Mountain");
    expect(bike.gearCount).to.equal(21);
  });

  it("ThisParameterType", () => {
    function greet(this: { name: string }, greeting: string) {
      return `${greeting}, ${this.name}`;
    }

    type GreetThis = ThisParameterType<typeof greet>;

    function callGreet(
      greetFn: typeof greet,
      context: GreetThis,
      greeting: string
    ) {
      return greetFn.call(context, greeting);
    }

    const result = callGreet(greet, { name: "John" }, "Hello");
    expect(result).to.equal("Hello, John");
  });

  it("OmitThisParameter", () => {
    function greet(this: { name: string }, greeting: string) {
      return `${greeting}, ${this.name}`;
    }

    type Greet = OmitThisParameter<typeof greet>;

    const greetToJohn: Greet = greet.bind({ name: "John" });
    const result = greetToJohn("Hello");
    expect(result).to.equal("Hello, John");
  });

  it("String Manipulation Types", () => {
    type T0 = Uppercase<"hello">;
    const t0: T0 = "HELLO";
    expect(t0).to.equal("HELLO");

    type T1 = Lowercase<"HELLO">;
    const t1: T1 = "hello";
    expect(t1).to.equal("hello");

    type T2 = Capitalize<"hello">;
    const t2: T2 = "Hello";
    expect(t2).to.equal("Hello");

    type T3 = Uncapitalize<"Hello">;
    const t3: T3 = "hello";
    expect(t3).to.equal("hello");
  });
});
