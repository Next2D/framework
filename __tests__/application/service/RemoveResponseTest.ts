import { RemoveResponse } from "../../../src/application/service/RemoveResponse";
import { RequestType } from "../../../src/infrastructure/constant/RequestType";

describe("RemoveResponseTest", () =>
{
    test("execute test", () =>
    {
        // mock
        const loaderInfo = new Map();
        loaderInfo.set("symbol_1", "abc");
        loaderInfo.set("symbol_2", "xyz");
        loaderInfo.set("symbol_3", "cache data");
        expect(loaderInfo.size).toBe(3);
        expect(loaderInfo.get("symbol_1")).toBe("abc");
        expect(loaderInfo.get("symbol_2")).toBe("xyz");
        expect(loaderInfo.get("symbol_3")).toBe("cache data");

        // @ts-ignore
        next2d.fw.loaderInfo = loaderInfo;

        // mock
        const symbols = new Map();
        symbols.set("symbol_1", true);

        const response = new Map();
        response.set("test1", {
            "_$loaderInfo": {
                "_$data": {
                    "symbols": symbols
                }
            }
        });
        response.set("test2", []);
        expect(response.size).toBe(2);

        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "test": {
                    "requests": [
                        {
                            "type": RequestType.CONTENT,
                            "name": "test1"
                        },
                        {
                            "type": RequestType.JSON,
                            "name": "test2"
                        },
                        {
                            "type": RequestType.CONTENT,
                            "name": "test3",
                            "cache": true
                        }
                    ]
                }
            }
        };

        // @ts-ignore
        next2d.fw.response = response;

        // execute
        new RemoveResponse().execute("test");

        // test
        expect(response.size).toBe(0);
        expect(loaderInfo.size).toBe(2);
        expect(loaderInfo.has("symbol_1")).toBe(false);
        expect(loaderInfo.has("symbol_2")).toBe(true);
        expect(loaderInfo.has("symbol_3")).toBe(true);
    });
});