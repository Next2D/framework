import { Query } from "../../../src/model/common/Query";

describe("Query Test", () =>
{
    test("default size", () =>
    {
        const query = new Query();
        expect(query.length).toBe(0);
    });

    test("'get', 'set', 'has' and 'delete' test case1", () =>
    {
        const query = new Query();
        expect(query.get("test")).toBe(null);

        query.set(100, "test");
        expect(query.length).toBe(1);

        expect(query.has(100)).toBe(true);
        expect(query.has("100")).toBe(false);
        expect(query.get(100)).toBe("test");

        query.delete(100);
        expect(query.length).toBe(0);
        expect(query.get("test")).toBe(null);
    });

    test("clear test case1", () =>
    {
        const query = new Query();
        expect(query.length).toBe(0);

        for (let idx = 0; idx < 10; ++idx) {
            query.set(idx, idx);
        }

        expect(query.length).toBe(10);
        query.clear();
        expect(query.length).toBe(0);

    });
});