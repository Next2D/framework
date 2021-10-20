import { Cache } from "../src/cache/Cache";

describe("Cache", () =>
{
    test("sample", () => {
        const cache = new Cache();
        expect(cache._$store.size).toBe(0);
    });

});