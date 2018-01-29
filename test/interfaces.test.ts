describe("interfaces", () => {
  it("Basic", () => {
    interface LabeledValue {
      label: string;
    }

    const returnLabel = (obj: LabeledValue) => {
      return obj.label;
    };

    // No other properties are allowed from TypeScript 1.6
    // https://stackoverflow.com/questions/31816061/why-am-i-getting-an-error-object-literal-may-only-specify-known-properties
    expect(returnLabel({ label: "hi" })).toBe("hi");
  });
});