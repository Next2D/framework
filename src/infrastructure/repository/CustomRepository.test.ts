import { execute } from "./CustomRepository";
import { packages } from "../../application/variable/Packages";
import { cache } from "../../application/variable/Cache";
import type { IRequest } from "../../interface/IRequest";
import { describe, expect, it, beforeEach } from "vitest";

describe("CustomRepository Test", () =>
{
    beforeEach(() =>
    {
        packages.clear();
        cache.clear();
    });

    it("execute public test", async () =>
    {
        // mock
        const object: IRequest = {
            "type": "custom",
            "name": "CustomRepository",
            "path": "next2d",
            "method": "publicGet",
            "access": "public",
            "class": "CustomClass"
        };

        const CustomClass = class CustomClass
        {
            publicGet ()
            {
                return "publicGet";
            }
        };

        packages.set("CustomClass", CustomClass);

        const responseDTO = await execute(object);
        expect(responseDTO.name).toBe("CustomRepository");
        expect(responseDTO.response).toBe("publicGet");
    });

    it("execute static test", async () =>
    {
        // mock
        const object: IRequest = {
            "type": "custom",
            "name": "CustomRepository",
            "path": "next2d",
            "method": "staticGet",
            "access": "static",
            "class": "CustomClass"
        };

        const CustomClass = class CustomClass
        {
            static staticGet ()
            {
                return "staticGet";
            }
        };

        packages.set("CustomClass", CustomClass);

        const responseDTO = await execute(object);
        expect(responseDTO.name).toBe("CustomRepository");
        expect(responseDTO.response).toBe("staticGet");
    });

    it("should throw error when required fields are missing", async () =>
    {
        const object: IRequest = {
            "type": "custom",
            "name": "",
            "path": "next2d"
        };

        await expect(execute(object)).rejects.toThrow(
            "`class`, `access`, `method` and `name` must be set for custom requests."
        );
    });

    it("should return cached response when cache is available", async () =>
    {
        const object: IRequest = {
            "type": "custom",
            "name": "CachedCustom",
            "path": "next2d",
            "method": "getData",
            "access": "public",
            "class": "CustomClass",
            "cache": true
        };

        const cachedValue = { data: "cached" };
        cache.set("CachedCustom", cachedValue);

        const CustomClass = class CustomClass
        {
            getData ()
            {
                return "fresh data";
            }
        };
        packages.set("CustomClass", CustomClass);

        const responseDTO = await execute(object);
        expect(responseDTO.name).toBe("CachedCustom");
        expect(responseDTO.response).toEqual(cachedValue);
    });

    it("should throw error when package is not found", async () =>
    {
        const object: IRequest = {
            "type": "custom",
            "name": "CustomRepository",
            "path": "next2d",
            "method": "getData",
            "access": "public",
            "class": "NonExistentClass"
        };

        await expect(execute(object)).rejects.toThrow("package not found.");
    });
});
