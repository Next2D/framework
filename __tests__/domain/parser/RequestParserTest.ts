import { RequestParser } from "../../../src/domain/parser/RequestParser";
import { RequestType } from "../../../src/infrastructure/constant/RequestType";

interface Object {
    type: string;
    name: string;
    path: string;
    cache?: boolean;
    class: string;
    access: string;
    method: string;
    callback?: string | string[];
}

describe("RequestParserTest", () =>
{
    test("request parse no match test case1", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {}
        };

        const requestParser: RequestParser = new RequestParser();
        const requests: Object[] = requestParser.execute("top");
        expect(requests.length).toBe(0);
    });

    test("request parse no match test case2", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "top": {}
            }
        };

        const requestParser: RequestParser = new RequestParser();
        const requests: Object[] = requestParser.execute("top");
        expect(requests.length).toBe(0);
    });

    test("request parse match test case1", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "top": {
                    "requests": [
                        {
                            "type": RequestType.JSON,
                            "name": "TopTest",
                            "path": "local"
                        }
                    ]
                }
            }
        };

        const requestParser: RequestParser = new RequestParser();
        const requests: Object[] = requestParser.execute("top");
        expect(requests.length).toBe(1);

        const object: Object = requests[0];
        expect(object.type).toBe(RequestType.JSON);
        expect(object.name).toBe("TopTest");
        expect(object.path).toBe("local");
    });

    test("request parse cluster test case1", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "@sample": {
                    "requests": [
                        {
                            "type": "content",
                            "path": "{{ content.endPoint }}content/sample.json",
                            "name": "MainContent",
                            "cache": true
                        }
                    ]
                },
                "top": {
                    "requests": [
                        {
                            "type": "cluster",
                            "path": "@sample"
                        },
                        {
                            "type": "json",
                            "path": "{{ api.endPoint }}api/top.json",
                            "name": "TopText"
                        }
                    ]
                }
            }
        };

        const requestParser: RequestParser = new RequestParser();
        const requests: Object[] = requestParser.execute("top");
        expect(requests.length).toBe(2);

        const object1: Object = requests[0];
        expect(object1.type).toBe(RequestType.CONTENT);
        expect(object1.name).toBe("MainContent");

        const object2: Object = requests[1];
        expect(object2.type).toBe(RequestType.JSON);
        expect(object2.name).toBe("TopText");
    });
});