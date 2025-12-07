import { execute } from "./ExecuteCallbackUseCase";
import { packages } from "../variable/Packages";
import { describe, expect, it } from "vitest";

describe("ExecuteCallbackUseCase Test", () =>
{
    it("should return undefined when no callback provided", async () =>
    {
        const result = await execute();
        expect(result).toBe(undefined);
    });

    it("should execute single callback", async () =>
    {
        let state = "none";
        const SingleTest = class SingleTest
        {
            execute (value: unknown): void
            {
                state = value as string;
            }
        };

        packages.clear();
        packages.set("SingleTest", SingleTest);

        expect(state).toBe("none");
        await execute("SingleTest", "single test");
        expect(state).toBe("single test");
    });

    it("should execute multiple callbacks", async () =>
    {
        let state1 = "none";
        const MultipleTestCase1 = class MultipleTest
        {
            execute (value: unknown): void
            {
                state1 = `${value}_1`;
            }
        };

        let state2 = "none";
        const MultipleTestCase2 = class MultipleTest
        {
            execute (value: unknown): void
            {
                state2 = `${value}_2`;
            }
        };

        packages.clear();
        packages.set("multiple.test.case1", MultipleTestCase1);
        packages.set("multiple.test.case2", MultipleTestCase2);

        expect(state1).toBe("none");
        expect(state2).toBe("none");

        await execute(["multiple.test.case1", "multiple.test.case2"], "multiple test");

        expect(state1).toBe("multiple test_1");
        expect(state2).toBe("multiple test_2");
    });

    it("should skip non-existent callbacks", async () =>
    {
        packages.clear();
        const result = await execute("NonExistentCallback", "test");
        expect(result).toBe(undefined);
    });
});
