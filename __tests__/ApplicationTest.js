import { Application } from "../src/Application";

describe("ApplicationTest", () =>
{
    test("initialize test", () => {

        const app = new Application({
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 12,
                "options": {}
            },
            "routing": {
                "test": {}
            }},
            [
                ["app", "app"]
            ]
        );

        expect(app.initialize()).toBe(undefined);
        expect(app.gotoView()).toBe(undefined);
    });

    test("_$parseConfig test case1", () => {

        const app = new Application({
                "stage": {
                    "width": 240,
                    "height": 240,
                    "fps": 12,
                    "options": {}
                },
                "endPoint": "localhost",
                "v1": "version/1"
            },
            [
                ["app", "app"]
            ]
        );

        expect(app._$parseConfig("{{endPoint}}/{{v1}}/test"))
            .toBe("localhost/version/1/test");
    });

    test("_$parseConfig test case2", () => {

        const app = new Application({
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
            },
            [
                ["app", "app"]
            ]
        );

        expect(app._$parseConfig("{{ api.platform.endPoint }}/{{v1}}/test"))
            .toBe("localhost/version/1/test");
    });

    test("_$callback test case1", () => {

        let result = null;
        const app = new Application({
                "stage": {
                    "width": 240,
                    "height": 240,
                    "fps": 12,
                    "options": {}
                }
            },
            [
                ["CallBack", class CallBack {
                    constructor (value = null)
                    {
                        this._$value = value;
                    }
                    execute ()
                    {
                        result = "execute";
                    }
                }]
            ]
        );
        expect(result).toBe(null);

        app._$callback("CallBack");
        expect(result).toBe("execute");

    });

    test("_$callback test case2", () => {

        let result = null;
        const app = new Application({
                "stage": {
                    "width": 240,
                    "height": 240,
                    "fps": 12,
                    "options": {}
                }
            },
            [
                ["CallBack", class CallBack {
                    constructor (value = null)
                    {
                        this._$value = value;
                    }
                    execute ()
                    {
                        result = "execute-v2";
                    }
                }]
            ]
        );
        expect(result).toBe(null);

        app._$callback(["CallBack"]);
        expect(result).toBe("execute-v2");

    });
});