import { execute } from "./RequestCacheCheckService";
import { cache } from "../../application/variable/Cache";
import { describe, expect, it, beforeEach } from "vitest";

describe("RequestCacheCheckService Test", () =>
{
    beforeEach(() =>
    {
        cache.clear();
    });

    it("should return null if cache is not enabled", async () =>
    {
        const result = await execute({
            "type": "json",
            "name": "test",
            "cache": false
        });

        expect(result).toBeNull();
    });

    it("should return null if name is not set", async () =>
    {
        const result = await execute({
            "type": "json",
            "cache": true
        });

        expect(result).toBeNull();
    });

    it("should return null if cache does not contain the key", async () =>
    {
        const result = await execute({
            "type": "json",
            "name": "test",
            "cache": true
        });

        expect(result).toBeNull();
    });

    it("should return ResponseDTO if cache contains the key", async () =>
    {
        cache.set("test", { "data": "cached" });

        const result = await execute({
            "type": "json",
            "name": "test",
            "cache": true
        });

        expect(result).not.toBeNull();
        expect(result?.name).toBe("test");
        expect(result?.response).toEqual({ "data": "cached" });
    });
});
