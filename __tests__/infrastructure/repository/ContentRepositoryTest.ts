import { ContentRepository } from "../../../src/infrastructure/repository/ContentRepository";
import { RequestType } from "../../../src/infrastructure/constant/RequestType";
import { ConfigParser } from "../../../src/domain/parser/ConfigParser";
import {ResponseDTO} from "../../../src/infrastructure/dto/ResponseDTO";

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

describe("ContentRepository Test", () =>
{
    test("execute json content test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const cache: Map<string, any> = new Map();
        cache.clear();

        // @ts-ignore
        next2d.fw.cache = cache;

        const loaderInfo: Map<string, any> = new Map();
        loaderInfo.clear();

        // @ts-ignore
        next2d.fw.loaderInfo = loaderInfo;

        const object: Object = {
            "type": RequestType.CONTENT,
            "name": "ContentRepository",
            "path": "",
            "method": "GET",
            "body": {
                "sample": 12345
            },
            "headers": {
                "Content-Type": "application/json"
            }
        };

        expect(cache.size).toBe(0);
        expect(loaderInfo.size).toBe(0);

        const contentRepository = new ContentRepository();
        contentRepository
            .execute(object)
            .then((response: any) =>
            {
                if (!response) {
                    throw new Error("stop test");
                }

                expect(response.text).toBe("NoCode Tool content");
            });
    });

    test("execute image content test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const cache: Map<string, any> = new Map();
        cache.clear();

        // @ts-ignore
        next2d.fw.cache = cache;

        const loaderInfo: Map<string, any> = new Map();
        loaderInfo.clear();

        // @ts-ignore
        next2d.fw.loaderInfo = loaderInfo;

        const object: Object = {
            "type": RequestType.IMAGE,
            "name": "ContentRepository",
            "path": "",
            "method": "GET",
            "body": {
                "sample": 12345
            },
            "headers": {
                "Content-Type": "application/json"
            }
        };

        expect(cache.size).toBe(0);
        expect(loaderInfo.size).toBe(0);

        const contentRepository = new ContentRepository();
        contentRepository
            .execute(object)
            .then((response: any) =>
            {
                if (!response) {
                    throw new Error("stop test");
                }

                expect(response.text).toBe("NoCode Tool image content");
            });
    });
});