import { ConfigParser } from "../../../src/domain/parser/ConfigParser";

describe("ConfigParserTest", () =>
{
    test("parse config test case1", () =>
    {
        // @ts-ignore
        next2d.fw.config = {
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 12,
                "options": {}
            },
            "endPoint": "localhost",
            "v1": "version/1"
        };

        const parser = new ConfigParser();

        expect(parser.execute("{{endPoint}}/{{v1}}/test"))
            .toBe("localhost/version/1/test");
    });

    test("parse config test case2", () =>
    {
        // @ts-ignore
        next2d.fw.config = {
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 12,
                "options": {}
            },
            "api": {
                "platform": {
                    "endPoint": "localhost"
                }
            },
            "v1": "version/1"
        };

        const parser = new ConfigParser();

        expect(parser.execute("{{ api.platform.endPoint }}/{{v1}}/test"))
            .toBe("localhost/version/1/test");
    });
});