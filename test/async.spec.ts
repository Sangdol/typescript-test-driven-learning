import "mocha";
import { expect } from "chai";

describe("Async", function(this: Mocha.Suite) {
  it("Promise.allSettled", async () => {
    const error = async (): Promise<number> => {
      throw new Error("Hallo");
    }
    const nonError = async (): Promise<number> => {
      return 1;
    }

    const results = await Promise.allSettled([error(), nonError()]);
    expect(results.length).to.be.equal(2);

    expect(results[0].status).to.be.equal("rejected");
    expect((results[0] as PromiseRejectedResult).reason.message).to.be.equal("Hallo");

    expect(results[1].status).to.be.equal("fulfilled");
    expect((results[1] as PromiseFulfilledResult<number>).value).to.be.equal(1);
  });
});
