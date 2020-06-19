describe("Basic Types", () => {
  /**
   * https://www.typescriptlang.org/docs/handbook/basic-types.html
   */
  it("Basic Types", () => {
    const isBoolean: boolean = true;
    const n: number = 10;
    const name: string = "name";
    const list: number[] = [1, 2];
    const tuple: [string, number, boolean] = ["name", 1, true];

    expect(`${isBoolean} ${n} ${name} ${list} ${tuple}`)
      .toBe("true 10 name 1,2 name,1,true");
  });
  it("any", () => {
    const any: any = "string";
    expect(<string>any.length).toBe(6);
    expect((any as string).length).toBe(6);
  });

  it("Array type", () => {
    function buildArray() {
      let a = []  // any[]
      a.push(1)   // number[]
      a.push('x') // (number | string)[]
      return a;   // the type is defined and fixed at this point.
    }

    let myArray = buildArray();

    // It's not possible to know the type of an array.
    // https://stackoverflow.com/questions/23130292/test-for-array-of-string-type-in-typescript
    expect(typeof (myArray)).toBe('object');
    expect(myArray instanceof Array).toBeTruthy();

    // Error 2345: Argument of type 'true' is not
    // assignable to parameter of type 'string | number'.
    // myArray.push(true);
  });
});

/**
 * https://www.typescriptlang.org/docs/handbook/advanced-types.html
 */
describe("Advanced Types", () => {
  it("Union", () => {
    const union1: string | number = "abc";
    const union2: string | number = 1;

    expect(`${union1} ${union2}`).toBe("abc 1");
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

    expect(getName("name")).toBe("name");
    expect(getName(() => "name")).toBe("name");
  });
});