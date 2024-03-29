import "mocha";
import { expect } from "chai";

// Ignore all type-checking errors for explaining the TS types.
/* eslint-disable */

/**
 * https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 */
describe("Everyday Types", function (this: Mocha.Suite) {
  it("Basic Types", () => {
    const isBoolean: boolean = true;
    const n: number = 10;
    const name: string = "name";
    const list: number[] = [1, 2];
    const tuple: [string, number, boolean] = ["name", 1, true];

    expect(`${isBoolean} ${n} ${name} ${list} ${tuple}`).to.equal(
      "true 10 name 1,2 name,1,true"
    );
  });
  it("any", () => {
    const any: any = "string";
    expect(<string>any.length).to.equal(6);
    expect((any as string).length).to.equal(6);
  });

  it("Union", () => {
    const union1: string | number = "abc";
    const union2: string | number = 1;

    expect(`${union1} ${union2}`).to.equal("abc 1");
  });

  it("Union: narrowing", () => {
    function pringId(id: number | string) {
      if (typeof id === "string") {
        // type guard
        return id.toUpperCase();
      } else {
        return id;
      }
    }

    expect(pringId("abc")).to.equal("ABC");
    expect(pringId(1)).to.equal(1);
  });

  /**
   * Use interface when it's possible
   */
  it("Type Aliases", () => {
    type Name = string;
    type NameResolver = () => string;
    type NameOrResolver = Name | NameResolver;

    const getName = (n: NameOrResolver): Name => {
      if (typeof n === "string") {
        return n;
      } else {
        return n();
      }
    };

    expect(getName("name")).to.equal("name");
    expect(getName(() => "name")).to.equal("name");

    // Extending types via intersection
    type Animal = {
      name: string;
    };

    type Bear = Animal & {
      honey: boolean;
    };

    const bear: Bear = { name: "bear", honey: true };
    expect(`${bear.name} ${bear.honey}`).to.equal("bear true");
  });

  it("Interfaces", () => {
    interface Point {
      x: number;
      y: number;
    }

    const point: Point = { x: 1, y: 2 };
    expect(`${point.x} ${point.y}`).to.equal("1 2");

    // Extending interfaces via extends
    interface Point3D extends Point {
      z: number;
    }

    const point3D: Point3D = { x: 1, y: 2, z: 3 };
    expect(`${point3D.x} ${point3D.y} ${point3D.z}`).to.equal("1 2 3");
  });

  it("Type Assertions", () => {
    const someValue: any = "this is a string";
    const strLength: number = (<string>someValue).length;
    expect(strLength).to.equal(16);

    const someValue2: any = "this is a string";
    const strLength2: number = (someValue2 as string).length;
    expect(strLength2).to.equal(16);

    interface Point {
      x: number;
      y: number;
    }
    // Coercion
    const point: Point = {} as any as Point;
    point.x = 1;
    point.y = 2;
    expect(`${point.x} ${point.y}`).to.equal("1 2");
  });

  it("Literal Types", () => {
    type Direction = "North" | "East" | "South" | "West";
    const direction: Direction = "North";
    expect(direction).to.equal("North");

    // Numeric Literal Types
    type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    const digit: Digit = 1;
    expect(digit).to.equal(1);

    // Literal Type to string
    function move(distance: number, direction: Direction) {
      return `${distance} ${direction}`;
    }

    // Avoiding "Argument of type 'string' is not assignable to parameter of type Direction."
    const wrappedNorth1 = { North: "North" as "North" };
    expect(move(1, wrappedNorth1.North)).to.equal("1 North");

    const wrappedNorth2 = { North: "North" } as const;
    expect(move(2, wrappedNorth2.North)).to.equal("2 North");
  });

  it("Non-null assertion operator", () => {
    function liveDangerously(x?: number | null) {
      // Avoiding "Object is possibly 'null'."
      return x!.toFixed();
    }

    expect(liveDangerously(1)).to.equal("1");
  });

  it("symbol", () => {
    const s1 = Symbol("s");
    const s2 = Symbol("s");

    expect(s1).to.be.not.equal(s2);
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */
describe("Advanced Types", () => {
  it("Type Guards / Type Predicates", () => {
    type Fish = { swim: () => string };
    type Bird = { fly: () => string };

    const getSmallPet = (): Fish | Bird => {
      return { swim: () => "swim" };
    };

    // Type Predicate: pet is Fish
    const isFish = (pet: Fish | Bird): pet is Fish => {
      return "swim" in pet;
    };

    const pet = getSmallPet();

    expect(isFish(pet)).to.equal(true);
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-oop.html
 */
describe("TS for Java/C# Programmers", () => {
  it("Structural obj type", () => {
    interface PointLike {
      x: number;
      y: number;
    }

    interface Named {
      name: string;
    }

    const obj = {
      x: 1,
      y: 2,
      name: "abc",
    };

    function add(point: PointLike) {
      return point.x + point.y;
    }

    function name(named: Named) {
      return named.name;
    }

    // TS's type system is structural, not nominal.
    expect(add(obj)).to.be.equal(3);
    expect(name(obj)).to.be.equal("abc");

    interface Empty {}

    function empty(e: Empty) {
      return "";
    }

    // This is not a problem as well.
    expect(empty(obj)).to.be.equal("");
  });

  it("Identical types", () => {
    class Car {
      drive() {
        return "car";
      }
    }

    class Golfer {
      drive() {
        return "golfer";
      }
    }

    // This is also not a problem.
    const car: Car = new Golfer();

    expect(car.drive()).to.be.equal("golfer");
  });

  it("Reflection not possible", () => {
    class Car {
      drive() {
        return "car";
      }
    }

    const car: Car = new Car();

    // TS's typs system is not reified. No type information at runtime.
    // No "Car".
    expect(typeof car).to.be.equal("object");
  });

  it("unknown", () => {
    const value: unknown = "string";
    expect((value as string).length).to.be.equal(6);

    // This is a problem.
    // expect(value.length).to.be.equal(6);
    // Property 'length' does not exist on type 'unknown'.

    function processValue(value: unknown) {
      if (typeof value === "string") {
        return value.toUpperCase();
      } else if (typeof value === "number") {
        return value.toFixed(2);
      } else {
        return "";
      }
    }

    expect(processValue("string")).to.be.equal("STRING");
    expect(processValue(1)).to.be.equal("1.00");
  });

  it("never", () => {
    function error(message: string): never {
      throw new Error(message);
    }

    // This is not a problem.
    expect(() => error("error")).to.throw("error");
  });

  it("Readonly Array", () => {
    const a: number[] = [1, 2, 3, 4];
    const ro: ReadonlyArray<number> = a;

    expect(ro[0]).to.be.equal(1);

    // This is a problem.
    // ro[0] = 12;
    // Index signature in type 'readonly number[]' only permits reading.
  });

  it("Tuple Types", () => {
    let x: [string, number];
    x = ["hello", 10];

    expect(x[0]).to.be.equal("hello");

    // This is a problem.
    // x[3] = "world";

    type Either2dOr3d = [number, number, number?];

    function setCoordinate(coord: Either2dOr3d) {
      const [x, y, z] = coord;
      return `${x} ${y} ${z}`;
    }

    expect(setCoordinate([1, 2])).to.be.equal("1 2 undefined");
  });

  it("typeof types", () => {
    function f() {
      return { x: 10, y: 3 };
    }

    type P = ReturnType<typeof f>;

    function g(p: P) {
      return p.x;
    }

    expect(g(f())).to.be.equal(10);
  });

  it("Indexed Access Types", () => {
    type Person = { age: number; name: string; alive: boolean };
    type Age = Person["age"];

    const age: Age = 10;
    expect(age).to.be.equal(10);

    type I1 = Person["age" | "name"];
    type I2 = Person[keyof Person];

    const i1: I1 = 10;
    const i2: I2 = true;
    expect(`${i1} ${i2}`).to.be.equal("10 true");

    // indexing array with number
    const MyArray = [
      { name: "Alice", age: 15 },
      { name: "Bob", age: 23 },
    ];

    type Person1 = (typeof MyArray)[number];
    type Age1 = (typeof MyArray)[number]["age"];

    const p: Person1 = { name: "Alice", age: 15 };
    const a: Age1 = 15;
    expect(`${p.name} ${a}`).to.be.equal("Alice 15");

    // You can only use types to index into other types.
    // const key = "name"; <= This is illegal.
    type key = "name";
    type Name = Person[key];

    const name: Name = "Alice";
    expect(name).to.be.equal("Alice");
  });

  it("Conditional Types", () => {
    interface Animal {
      live(): void;
    }

    interface Dog extends Animal {
      woof(): void;
    }

    type Example1 = Dog extends Animal ? number : string;
    type Example2 = RegExp extends Animal ? number : string;

    const e1: Example1 = 1;
    const e2: Example2 = "string";
    expect(`${e1} ${e2}`).to.be.equal("1 string");

    // Practical example with generics
    interface IdLabel {
      id: number;
    }

    interface NameLabel {
      name: string;
    }

    // We can avoid overloads with conditional types.
    type NameOrId<T extends number | string> = T extends number
      ? IdLabel
      : NameLabel;

    const nameOrId1: NameOrId<number> = { id: 1 };
    const nameOrId2: NameOrId<string> = { name: "name" };
    expect(`${nameOrId1.id} ${nameOrId2.name}`).to.be.equal("1 name");

    // Flatten array
    type Flatten<T> = T extends any[] ? T[number] : T;

    type Str = Flatten<string[]>;
    type Num = Flatten<number>;

    const str: Str = "string";
    const num: Num = 1;
    expect(`${str} ${num}`).to.be.equal("string 1");

    // infer: a keyword for conditional types
    type Unpacked<T> = T extends Array<infer U> ? U : T;

    type T0 = Unpacked<string[]>;
    type T1 = Unpacked<number>;

    const t0: T0 = "string";
    const t1: T1 = 1;
    expect(`${t0} ${t1}`).to.be.equal("string 1");
  });

  it("Mapped Types", () => {
    type OptionsFlags<Type> = {
      [Property in keyof Type]: boolean;
    };

    type FeatureFlags = {
      darkMode: () => void;
      newUserProfile: () => void;
    };

    type FeatureOptions = OptionsFlags<FeatureFlags>;

    const featureOptions: FeatureOptions = {
      darkMode: true,
      newUserProfile: false,
    };

    expect(
      `${featureOptions.darkMode} ${featureOptions.newUserProfile}`
    ).to.be.equal("true false");
  });
});
