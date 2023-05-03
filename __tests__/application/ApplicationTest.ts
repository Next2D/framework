import { Application } from "../../src/application/Application";

describe("ApplicationTest", () =>
{
    test("initialize test", () => {

        const config = {
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 12,
                "options": {}
            },
            "routing": {
                "test": {}
            }
        };
        const packages = [["app", "app"]];

        const app = new Application(config, packages);

        expect(app.initialize()).toBe(undefined);
        expect(app.gotoView()).toBe(undefined);
    });
});