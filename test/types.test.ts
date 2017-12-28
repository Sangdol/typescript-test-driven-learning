describe("Types", () => {
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

    enum Color { Red, Green, Blue }
    const c: Color = Color.Red;
    expect(`${c} ${Color[c]}`).toBe("0 Red");

    const any: any = "string";
    expect(<string>any.length).toBe(6);
    expect((any as string).length).toBe(6);
  });
});