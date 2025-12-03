import { execute } from "./ApplicationParseQueryStringService";
import { query } from "../../variable/Query";
import { describe, expect, it, beforeEach } from "vitest";

describe("ApplicationParseQueryStringService Test", () =>
{
    beforeEach(() =>
    {
        query.clear();
    });

    it("should parse query string without leading ?", () =>
    {
        execute("key1=value1&key2=value2");

        expect(query.get("key1")).toBe("value1");
        expect(query.get("key2")).toBe("value2");
    });

    it("should parse query string with leading ?", () =>
    {
        execute("?key1=value1&key2=value2");

        expect(query.get("key1")).toBe("value1");
        expect(query.get("key2")).toBe("value2");
    });

    it("should parse single parameter", () =>
    {
        execute("single=param");

        expect(query.get("single")).toBe("param");
        expect(query.size).toBe(1);
    });
});
