import { Cache } from "../../src/cache/Cache";

describe("Cache Test", () =>
{
    test("default size", () =>
    {
        const cache = new Cache();
        expect(cache.length).toBe(0);
    });

    test("'get', 'set', 'has' and 'delete' test case1", () =>
    {
        const cache = new Cache();
        expect(cache.get("test")).toBe(null);

        cache.set(100, "test");
        expect(cache.length).toBe(1);

        expect(cache.has(100)).toBe(true);
        expect(cache.has("100")).toBe(false);
        expect(cache.get(100)).toBe("test");

        cache.delete(100);
        expect(cache.length).toBe(0);
        expect(cache.get("test")).toBe(null);
    });

    test("clear test case1", () =>
    {
        const cache = new Cache();
        expect(cache.length).toBe(0);

        for (let idx = 0; idx < 10; ++idx) {
            cache.set(idx, idx);
        }

        expect(cache.length).toBe(10);
        cache.clear();
        expect(cache.length).toBe(0);

    });
});