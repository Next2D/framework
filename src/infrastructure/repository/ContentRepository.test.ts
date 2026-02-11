import { execute } from "./ContentRepository";
import { cache } from "../../application/variable/Cache";
import { loaderInfoMap } from "../../application/variable/LoaderInfoMap";
import { describe, expect, it, beforeEach, vi } from "vitest";

vi.mock("@next2d/display", () => ({
    "Loader": class MockLoader {
        private _content: any = { "type": "content" };
        private _loaderInfo: any = {
            "data": {
                "symbols": new Map([["Symbol1", 1], ["Symbol2", 2]])
            }
        };

        get content (): any
        {
            return this._content;
        }

        get loaderInfo (): any
        {
            return this._loaderInfo;
        }

        async load (_: any): Promise<void>
        {
            return;
        }
    }
}));

vi.mock("@next2d/net", () => ({
    "URLRequest": class MockURLRequest {
        public method: string = "GET";
        public data: any = null;
        public requestHeaders: Array<{ name: string; value: string }> = [];

        constructor (public url: string) {}
    }
}));

describe("ContentRepository Test", () =>
{
    beforeEach(() =>
    {
        cache.clear();
        loaderInfoMap.clear();
    });

    describe("execute", () =>
    {
        it("should throw error when path is not set", async () =>
        {
            await expect(execute({
                "type": "content",
                "name": "test"
            })).rejects.toThrow("`path` and `name` must be set for content requests.");
        });

        it("should throw error when name is not set", async () =>
        {
            await expect(execute({
                "type": "content",
                "path": "/path/to/content"
            })).rejects.toThrow("`path` and `name` must be set for content requests.");
        });

        it("should throw error when both path and name are not set", async () =>
        {
            await expect(execute({
                "type": "content"
            })).rejects.toThrow("`path` and `name` must be set for content requests.");
        });

        it("should load content successfully", async () =>
        {
            const result = await execute({
                "type": "content",
                "path": "/path/to/content.json",
                "name": "testContent"
            });

            expect(result.name).toBe("testContent");
            expect(result.response).toEqual({ "type": "content" });
        });

        it("should register symbols to loaderInfoMap", async () =>
        {
            expect(loaderInfoMap.size).toBe(0);

            await execute({
                "type": "content",
                "path": "/path/to/content.json",
                "name": "testContent"
            });

            expect(loaderInfoMap.size).toBe(2);
            expect(loaderInfoMap.has("Symbol1")).toBe(true);
            expect(loaderInfoMap.has("Symbol2")).toBe(true);
        });

        it("should use POST method when specified", async () =>
        {
            const result = await execute({
                "type": "content",
                "path": "/path/to/content.json",
                "name": "testContent",
                "method": "POST"
            });

            expect(result.name).toBe("testContent");
        });

        it("should include headers when specified", async () =>
        {
            const result = await execute({
                "type": "content",
                "path": "/path/to/content.json",
                "name": "testContent",
                "headers": {
                    "Authorization": "Bearer token123",
                    "Content-Type": "application/json"
                }
            });

            expect(result.name).toBe("testContent");
        });

        it("should include body when specified", async () =>
        {
            const result = await execute({
                "type": "content",
                "path": "/path/to/content.json",
                "name": "testContent",
                "body": { "key": "value" }
            });

            expect(result.name).toBe("testContent");
        });

        it("should return cached response when available", async () =>
        {
            cache.set("cachedContent", { "cached": true });

            const result = await execute({
                "type": "content",
                "path": "/path/to/cached.json",
                "name": "cachedContent",
                "cache": true
            });

            expect(result.name).toBe("cachedContent");
            expect(result.response).toEqual({ "cached": true });
        });
    });
});
