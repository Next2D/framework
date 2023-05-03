import { ContentService } from "../../../src/infrastructure/service/ContentService";
import { RequestType } from "../../../src/infrastructure/constant/RequestType";
import { ConfigParser } from "../../../src/domain/parser/ConfigParser";
import { ResponseDTO } from "../../../src/infrastructure/dto/ResponseDTO";

interface Object {
    type: string;
    name: string;
    path: string;
    cache?: boolean;
    callback?: string|string[];
    method?: string;
    body?: object;
    headers?: HeadersInit;
}

describe("ContentService Test", () =>
{
    test("execute fetch test use cache", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const cache: Map<string, any> = new Map();
        cache.clear();

        // @ts-ignore
        next2d.fw.cache = cache;

        const packages: Map<string, any> = new Map();

        const TestCallback = function ()
        {
            return {
                "execute": (value: any) => {
                    expect(value.text).toBe("NoCode Tool content");
                }
            };
        };

        packages.set("TestCallback_Case1", TestCallback);

        // @ts-ignore
        next2d.fw.packages = packages;

        const loaderInfo: Map<string, any> = new Map();

        // @ts-ignore
        next2d.fw.loaderInfo = loaderInfo;

        const contentService = new ContentService();

        const object: Object = {
            "type": RequestType.CONTENT,
            "name": "ContentRepository",
            "path": "",
            "cache": true,
            "callback": "TestCallback_Case1"
        };

        expect(cache.size).toBe(0);
        expect(loaderInfo.size).toBe(0);

        contentService
            .execute(object)
            .then((response: ResponseDTO|void) =>
            {
                if (!response) {
                    throw new Error("stop test");
                }

                expect(response.name).toBe("ContentRepository");
                expect(response.response.text).toBe("NoCode Tool content");

                expect(cache.size).toBe(1);
                expect(cache.get("ContentRepository").text).toBe("NoCode Tool content");

                expect(loaderInfo.size).toBe(1);
                expect(loaderInfo.get("app")._$data.symbols.get("app")).toBe("app");
            });
    });

    test("execute fetch test no use cache", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const cache: Map<string, any> = new Map();
        cache.clear();

        // @ts-ignore
        next2d.fw.cache = cache;

        const packages: Map<string, any> = new Map();

        const TestCallback = function ()
        {
            return {
                "execute": (value: any) => {
                    expect(value.text).toBe("NoCode Tool content");
                }
            };
        };

        packages.set("TestCallback_Case1", TestCallback);

        // @ts-ignore
        next2d.fw.packages = packages;

        const loaderInfo: Map<string, any> = new Map();

        // @ts-ignore
        next2d.fw.loaderInfo = loaderInfo;

        const contentService = new ContentService();

        const object: Object = {
            "type": RequestType.CONTENT,
            "name": "ContentRepository",
            "path": "",
            "callback": "TestCallback_Case1"
        };

        expect(cache.size).toBe(0);
        expect(loaderInfo.size).toBe(0);

        contentService
            .execute(object)
            .then((response: ResponseDTO|void) =>
            {
                if (!response) {
                    throw new Error("stop test");
                }

                expect(response.name).toBe("ContentRepository");
                expect(response.response.text).toBe("NoCode Tool content");

                expect(cache.size).toBe(0);

                expect(loaderInfo.size).toBe(1);
                expect(loaderInfo.get("app")._$data.symbols.get("app")).toBe("app");
            });
    });

    test("execute cache test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const cache: Map<string, any> = new Map();
        cache.set("ContentRepository", "success cache content");

        // @ts-ignore
        next2d.fw.cache = cache;

        const packages: Map<string, any> = new Map();

        const TestCallback = function ()
        {
            return {
                "execute": (value: any) => {
                    expect(value).toBe("success cache content");
                }
            };
        };

        packages.set("TestCallback_Case2", TestCallback);

        const contentService = new ContentService();

        const object: Object = {
            "type": RequestType.CONTENT,
            "name": "ContentRepository",
            "cache": true,
            "callback": "TestCallback_Case2",
            "path": ""
        };

        contentService
            .execute(object)
            .then((response: ResponseDTO|void) =>
            {
                if (!response) {
                    throw new Error("stop test");
                }

                expect(response.name).toBe("ContentRepository");
                expect(response.response).toBe("success cache content");
            });
    });
});