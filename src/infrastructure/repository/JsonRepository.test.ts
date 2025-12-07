import type { IRequest } from "../../interface/IRequest";
import { execute } from "./JsonRepository";
import { describe, expect, it, vi } from "vitest";

describe("JsonRepository Test", () =>
{
    it("execute fetch get test", async () =>
    {
        // mock
        const object: IRequest = {
            "type": "json",
            "name": "JsonRepository",
            "path": "next2d",
            "method": "GET"
        };

        const responseMock = (url: string, options: RequestInit) =>
        {
            expect(url).toBe(object.path);
            expect(options.method).toBe(object.method);

            return Promise.resolve({
                "ok": true,
                "status": 200,
                "statusText": "OK",
                "json": () => {
                    return Promise.resolve("success fetch json");
                }
            });
        };
        global.fetch = vi.fn().mockImplementation(responseMock);

        const responseDTO = await execute(object);
        expect(responseDTO.name).toBe("JsonRepository");
        expect(responseDTO.response).toBe("success fetch json");
    });

    it("execute fetch post test", async () =>
    {
        // mock
        const object: IRequest = {
            "type": "json",
            "name": "JsonRepository",
            "path": "next2d",
            "method": "POST",
            "body": {
                "sample": 999
            },
            "headers": {
                "Content-Type": "application/json"
            }
        };

        const responseMock = (url: string, options: RequestInit) =>
        {

            expect(url).toBe(object.path);
            expect(options.method).toBe(object.method);
            expect(options.body).toBe(JSON.stringify(object.body));
            expect((options.headers as Record<string, string>)["Content-Type"]).toBe("application/json");

            return Promise.resolve({
                "ok": true,
                "status": 200,
                "statusText": "OK",
                "json": () => {
                    return Promise.resolve("success fetch json");
                }
            });
        };
        global.fetch = vi.fn().mockImplementation(responseMock);

        const responseDTO = await execute(object);
        expect(responseDTO.name).toBe("JsonRepository");
        expect(responseDTO.response).toBe("success fetch json");
    });

    it("execute fetch put test", async () =>
    {
        // mock
        const object: IRequest = {
            "type": "json",
            "name": "JsonRepository",
            "path": "next2d",
            "method": "PUT",
            "body": {
                "sample": 123
            },
            "headers": {
                "Content-Type": "application/json"
            }
        };

        const responseMock = (url: string, options: RequestInit) =>
        {
            expect(url).toBe(object.path);
            expect(options.method).toBe(object.method);
            expect(options.body).toBe(JSON.stringify(object.body));
            expect((options.headers as Record<string, string>)["Content-Type"]).toBe("application/json");

            return Promise.resolve({
                "ok": true,
                "status": 200,
                "statusText": "OK",
                "json": () => {
                    return Promise.resolve("success fetch json");
                }
            });
        };
        global.fetch = vi.fn().mockImplementation(responseMock);

        const responseDTO = await execute(object);
        expect(responseDTO.name).toBe("JsonRepository");
        expect(responseDTO.response).toBe("success fetch json");
    });

    it("execute fetch error test", async () =>
    {
        // mock
        const object: IRequest = {
            "type": "json",
            "name": "JsonRepository",
            "path": "next2d",
            "method": "GET"
        };

        const responseMock = () =>
        {
            return Promise.resolve({
                "ok": false,
                "status": 404,
                "statusText": "Not Found",
                "json": () => {
                    return Promise.resolve(null);
                }
            });
        };
        global.fetch = vi.fn().mockImplementation(responseMock);

        await expect(execute(object)).rejects.toThrow("HTTP error: 404 Not Found for next2d");
    });
});
