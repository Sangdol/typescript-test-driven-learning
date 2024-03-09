import "mocha";
import { expect } from "chai";

describe("Async", function (this: Mocha.Suite) {
  // See also PromiseSettledResult
  it("Promise.allSettled", async () => {
    const error = async (): Promise<number> => {
      throw new Error("Hallo");
    };
    const nonError = async (): Promise<number> => {
      return 1;
    };

    const results = await Promise.allSettled([error(), nonError()]);
    expect(results.length).to.be.equal(2);

    expect(results[0].status).to.be.equal("rejected");
    expect((results[0] as PromiseRejectedResult).reason.message).to.be.equal(
      "Hallo"
    );

    expect(results[1].status).to.be.equal("fulfilled");
    expect((results[1] as PromiseFulfilledResult<number>).value).to.be.equal(1);

    // Using filter and type guards
    const fulfilled = results.filter(
      (result): result is PromiseFulfilledResult<number> =>
        result.status === "fulfilled"
    );
    expect(fulfilled.length).to.be.equal(1);
    expect(fulfilled[0].value).to.be.equal(1);

    const rejected = results.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    );
    expect(rejected.length).to.be.equal(1);
    expect(rejected[0].reason.message).to.be.equal("Hallo");
  });

  it("Promise.allSettled: passing IDs", async () => {
    const makeNumber = async (id: number): Promise<number> => {
      if (id === 1) {
        throw new Error("Hallo");
      }
      return id * 100;
    };

    const ids = [1, 2];
    const promises = ids.map((id) => {
      // To access the id, it has to wrap the result in an object,
      // which hides the real status returning "fulfilled" always.
      return makeNumber(id)
        .then((result) => {
          return { id, number: result, realStatus: "success" };
        })
        .catch((error) => {
          return { id, error, realStatus: "failure" };
        });
    });

    const results = await Promise.allSettled(promises);
    expect(results.length).to.be.equal(2);

    const fulfilled = results.filter(
      (
        result
      ): result is PromiseSettledResult<{
        id: number;
        number: number;
        realStatus: string;
      }> => result.status === "fulfilled"
    );

    expect(fulfilled.length).to.be.equal(2);

    const rejected = results.filter(
      (
        result
      ): result is PromiseSettledResult<{
        id: number;
        error: Error;
        realStatus: string;
      }> => result.status === "rejected"
    );

    expect(rejected.length).to.be.equal(0);

    results.forEach((result) => {
      const status = result.status;
      // To access the value, the type must be PromiseFulfilledResult.
      const value = (
        result as PromiseFulfilledResult<{
          id: number;
          number: number;
          realStatus: string;
        }>
      ).value;
      const id = value.id;
      const number = value.number;
      const realStatus = value.realStatus;

      if (id === 1) {
        expect(status).to.be.equal("fulfilled");
        expect(number).to.be.undefined;
        expect(realStatus).to.be.equal("failure");
      } else if (id === 2) {
        expect(status).to.be.equal("fulfilled");
        expect(number).to.be.equal(200);
        expect(realStatus).to.be.equal("success");
      }
    });
  });

  it("promisification", async () => {
    const setTimeoutPromise = (ms: number) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    const start = Date.now();
    await setTimeoutPromise(10);
    const end = Date.now();
    expect(end - start).to.be.greaterThan(5);
  });

  // https://javascript.info/promisify
  it("promisify", async () => {
    const fs = await import("fs");
    const { promisify } = await import("util");

    // fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => { ... });
    const readFile = promisify(fs.readFile);

    const file = "package.json";
    const data = await readFile(file, "utf8");
    expect(data).to.be.a("string");
  });
});
