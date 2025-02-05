import { execute } from "./CallbackService";
import { packages } from "../../../application/variable/Packages";
import { describe, expect, it } from "vitest";

describe("CallbackService", () =>
{
    it("execute test case1", async () =>
    {
        const result = await execute()
        expect(result).toBe(undefined);
    });

    it("execute single test", async () =>
    {
        // mock
        let state = "none";
        const SingleTest = class SingleTest
        {
            execute (value: any): any
            {
                state = value;
            }
        };

        packages.clear();
        packages.set("SingleTest", SingleTest);

        expect(state).toBe("none");
        await execute("SingleTest", "single test");
        expect(state).toBe("single test");
    });

    // it("execute multiple test", () =>
    // {
    //     // mock
    //     const MultipleTestCase1 = class MultipleTest
    //     {
    //         execute (value: any): any
    //         {
    //             return `${value}_1`;
    //         }
    //     };

    //     const MultipleTestCase2 = class MultipleTest
    //     {
    //         execute (value: any): any
    //         {
    //             return `${value}_2`;
    //         }
    //     };

    //     packages.clear();
    //     packages.set("multiple.test.case1", MultipleTestCase1);
    //     packages.set("multiple.test.case2", MultipleTestCase2);

    //     execute(["multiple.test.case1", "multiple.test.case2"], "multiple test")
    //         .then((results: string[] | void) =>
    //         {
    //             if (!results) {
    //                 throw new Error("stop test");
    //             }

    //             expect(results.length).toBe(2);
    //             const result1: string = results[0];
    //             expect(result1).toBe("multiple test_1");

    //             const result2: string = results[1];
    //             expect(result2).toBe("multiple test_2");
    //         });
    // });
});