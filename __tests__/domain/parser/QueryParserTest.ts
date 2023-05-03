import { QueryParser } from "../../../src/domain/parser/QueryParser";

interface Object {
    name: string;
    queryString: string;
}

describe("QueryParserTest", () =>
{
    test("parse query test case1", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {};

        const query: Map<string, any> = new Map();
        query.set("test", 123);
        expect(query.size).toBe(1);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute();

        expect(query.size).toBe(0);
        expect(object.name).toBe("top");
        expect(object.queryString).toBe("");
    });

    test("parse query test case2", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {};

        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("@test");

        expect(query.size).toBe(0);
        expect(object.name).toBe("test");
        expect(object.queryString).toBe("");
    });

    test("parse location.search test case1", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {};

        // @ts-ignore
        globalThis.location.search = "?q=abc&sample=1";

        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("");

        expect(query.size).toBe(2);
        expect(query.get("q")).toBe("abc");
        expect(query.get("sample")).toBe("1");
        expect(object.name).toBe("top");
        expect(object.queryString).toBe("?q=abc&sample=1");
    });

    test("parse location.pathname un match test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "top": {}
            }
        };

        // @ts-ignore
        globalThis.location.pathname = "/quest/list";

        // @ts-ignore
        globalThis.location.search   = "?q=xyz&sample=0";

        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("");

        expect(query.size).toBe(2);
        expect(query.get("q")).toBe("xyz");
        expect(query.get("sample")).toBe("0");
        expect(object.name).toBe("top");
        expect(object.queryString).toBe("?q=xyz&sample=0");
    });

    test("parse location.pathname public test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "quest/list": {
                    "private": false
                }
            }
        };

        // @ts-ignore
        globalThis.location.pathname = "/quest/list";

        // @ts-ignore
        globalThis.location.search   = "?q=xyz&sample=0";

        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("");

        expect(query.size).toBe(2);
        expect(query.get("q")).toBe("xyz");
        expect(query.get("sample")).toBe("0");
        expect(object.name).toBe("quest/list");
        expect(object.queryString).toBe("?q=xyz&sample=0");
    });

    test("parse location.pathname private test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "quest/list": {
                    "private": true
                }
            }
        };

        // @ts-ignore
        globalThis.location.pathname = "/quest/list";

        // @ts-ignore
        globalThis.location.search   = "?q=xyz&sample=0";

        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("");

        expect(query.size).toBe(2);
        expect(query.get("q")).toBe("xyz");
        expect(query.get("sample")).toBe("0");
        expect(object.name).toBe("top");
        expect(object.queryString).toBe("?q=xyz&sample=0");
    });

    test("parse location.pathname redirect test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "quest/list": {
                    "private": true,
                    "redirect": "quest/detail"
                }
            }
        };

        // @ts-ignore
        globalThis.location.pathname = "/quest/list";

        // @ts-ignore
        globalThis.location.search   = "?q=xyz&sample=0";

        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("");

        expect(query.size).toBe(2);
        expect(query.get("q")).toBe("xyz");
        expect(query.get("sample")).toBe("0");
        expect(object.name).toBe("quest/detail");
        expect(object.queryString).toBe("?q=xyz&sample=0");
    });

    test("parse name query test", () =>
    {
        // mock
        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("page/test?abc=123&xyz=999");

        expect(query.size).toBe(2);
        expect(query.get("abc")).toBe("123");
        expect(query.get("xyz")).toBe("999");
        expect(object.name).toBe("page/test");
        expect(object.queryString).toBe("?abc=123&xyz=999");
    });

    test("parse name path test case1", () =>
    {
        // mock
        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("./test");

        expect(query.size).toBe(0);
        expect(object.name).toBe("test");
    });

    test("parse name path test case2", () =>
    {
        // mock
        const query: Map<string, any> = new Map();
        expect(query.size).toBe(0);

        // @ts-ignore
        next2d.fw.query = query;

        const queryParser = new QueryParser();
        const object: Object = queryParser.execute("./");

        expect(query.size).toBe(0);
        expect(object.name).toBe("top");
    });
});