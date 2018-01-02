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

  it("Enum", () => {
    enum Color { Red, Green, Blue }
    const c: Color = Color.Red;
    expect(`${c} ${Color[c]}`).toBe("0 Red");
  });

  it("any", () => {
    const any: any = "string";
    expect(<string>any.length).toBe(6);
    expect((any as string).length).toBe(6);
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