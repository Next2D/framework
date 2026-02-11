import { execute } from "./RequestResponseProcessService";
import { cache } from "../../application/variable/Cache";
import { describe, expect, it, beforeEach } from "vitest";

describe("RequestResponseProcessService Test", () =>
{
    beforeEach(() =>
    {
        cache.clear();
    });

    it("should return ResponseDTO with name and value", async () =>
    {
        const result = await execute({
            "type": "json",
            "name": "test"
        }, { "data": "response" });

        expect(result.name).toBe("test");
        expect(result.response).toEqual({ "data": "response" });
    });

    it("should save to cache if cache is enabled", async () =>
    {
        expect(cache.has("test")).toBe(false);

        await execute({
            "type": "json",
            "name": "test",
            "cache": true
        }, { "data": "cached" });

        expect(cache.has("test")).toBe(true);
        expect(cache.get("test")).toEqual({ "data": "cached" });
    });

    it("should not save to cache if cache is disabled", async () =>
    {
        await execute({
            "type": "json",
            "name": "test",
            "cache": false
        }, { "data": "not-cached" });

        expect(cache.has("test")).toBe(false);
    });
});
