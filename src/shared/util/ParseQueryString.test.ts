import { parseQueryString } from "./ParseQueryString";
import { describe, expect, it } from "vitest";

describe("ParseQueryString Test", () =>
{
    it("should parse single key-value pair", () =>
    {
        const result = parseQueryString("key=value");
        expect(result.get("key")).toBe("value");
    });

    it("should parse multiple key-value pairs", () =>
    {
        const result = parseQueryString("foo=bar&baz=qux");
        expect(result.get("foo")).toBe("bar");
        expect(result.get("baz")).toBe("qux");
    });

    it("should handle leading question mark", () =>
    {
        const result = parseQueryString("?key=value");
        expect(result.get("key")).toBe("value");
    });

    it("should handle empty value", () =>
    {
        const result = parseQueryString("key=");
        expect(result.get("key")).toBe("");
    });

    it("should handle key without value", () =>
    {
        const result = parseQueryString("key");
        expect(result.get("key")).toBe("");
    });

    it("should return empty map for empty string", () =>
    {
        const result = parseQueryString("");
        expect(result.size).toBe(0);
    });
});
