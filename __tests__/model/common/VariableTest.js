import { Variable } from "../../../src/model/common/Variable";

describe("Variable Test", () =>
{
    test("default size", () =>
    {
        const variable = new Variable();
        expect(variable.length).toBe(0);
    });

    test("'get', 'set', 'has' and 'delete' test case1", () =>
    {
        const variable = new Variable();
        expect(variable.get("test")).toBe(null);

        variable.set(100, "test");
        expect(variable.length).toBe(1);

        expect(variable.has(100)).toBe(true);
        expect(variable.has("100")).toBe(false);
        expect(variable.get(100)).toBe("test");

        variable.delete(100);
        expect(variable.length).toBe(0);
        expect(variable.get("test")).toBe(null);
    });

    test("clear test case1", () =>
    {
        const variable = new Variable();
        expect(variable.length).toBe(0);

        for (let idx = 0; idx < 10; ++idx) {
            variable.set(idx, idx);
        }

        expect(variable.length).toBe(10);
        variable.clear();
        expect(variable.length).toBe(0);

    });
});