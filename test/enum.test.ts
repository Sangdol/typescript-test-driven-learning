import { EnumValues } from "enum-values";

it("Defautl Enum", () => {
  enum Color { Red, Green, Blue }
  const c: Color = Color.Red;
  expect(`${c} ${Color[c]}`).toBe("0 Red");
  expect(Color["Red"]).toBe(Color.Red);
  expect(Color[0]).toBe("Red");
  expect(Color[0]).not.toBe(Color.Red);
  expect(Color.Red).toBe(0);
});

it("String Enum", () => {
  enum StringColor { Red = "RedValue" }
  const sc: StringColor = StringColor["Red"];
  expect(sc).toBe(StringColor.Red);
  expect(StringColor.Red).toBe("RedValue");

  const stringRed: string = StringColor.Red;
  expect(stringRed).toBe("RedValue");

  const scValue: StringColor = StringColor["RedValue"];
  expect(scValue).toBe(undefined);

  const scAny: string = StringColor[<any>"Red"];
  expect(scAny).toBe("RedValue");
  expect(scAny).toBe(StringColor.Red);

  const nullSc: StringColor = StringColor["any"];
  expect(nullSc).toBe(undefined);
});

// https://github.com/Microsoft/TypeScript/issues/17198
// https://stackoverflow.com/questions/18111657/how-does-one-get-the-names-of-typescript-enum-entries
it("String Enum iteration", () => {
  enum Color { red = "1", blue = "2" }

  let count = 0;
  for (const color in Color) {
    // red, blue
    count++;
  }

  expect(count).toBe(2);
});

it("Default Enum iteration", () => {
  enum Color { red, blue }

  let count = 0;
  for (const color in Color) {
    // 0, 1, red, blue
    count++;
  }

  expect(count).toBe(4);
});

// https://github.com/slavik57/enum-values
it("enum values", () => {
  enum Color { red = "1", blue = "2" }

  expect(EnumValues.getValues(Color)).toEqual(["1", "2"]);
});