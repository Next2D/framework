import { normalizeHttpMethod } from "./NormalizeHttpMethod";
import { describe, expect, it } from "vitest";

describe("NormalizeHttpMethod Test", () =>
{
    it("should return GET when method is undefined", () =>
    {
        expect(normalizeHttpMethod()).toBe("GET");
    });

    it("should return GET when method is empty", () =>
    {
        expect(normalizeHttpMethod("")).toBe("GET");
    });

    it("should normalize lowercase GET", () =>
    {
        expect(normalizeHttpMethod("get")).toBe("GET");
    });

    it("should normalize lowercase POST", () =>
    {
        expect(normalizeHttpMethod("post")).toBe("POST");
    });

    it("should normalize lowercase PUT", () =>
    {
        expect(normalizeHttpMethod("put")).toBe("PUT");
    });

    it("should normalize lowercase DELETE", () =>
    {
        expect(normalizeHttpMethod("delete")).toBe("DELETE");
    });

    it("should normalize lowercase HEAD", () =>
    {
        expect(normalizeHttpMethod("head")).toBe("HEAD");
    });

    it("should normalize lowercase OPTIONS", () =>
    {
        expect(normalizeHttpMethod("options")).toBe("OPTIONS");
    });

    it("should return GET for unknown method", () =>
    {
        expect(normalizeHttpMethod("PATCH")).toBe("GET");
    });
});
