import { Model } from "../../../src/model/common/Model";

describe("ModelTest", () =>
{
    test("app test", () => {
        const model = new Model();
        expect(model.app).toBe("app");
    });

    test("cache test", () => {
        const model = new Model();
        expect(model.cache.get("cache")).toBe("cache");
    });

    test("config test", () => {
        const model = new Model();
        expect(model.config.stage.width).toBe(240);
    });

    test("context test", () => {
        const model = new Model();
        expect(model.context).toBe("context");
    });

    test("packages test", () => {
        const model = new Model();
        expect(model.packages.get("class")).toBe("class");
    });

    test("response test", () => {
        const model = new Model();
        expect(model.response.get("response")).toBe("response");
    });

    test("variable test", () => {
        const model = new Model();
        expect(model.variable.get("variable")).toBe("variable");
    });

    test("query test", () => {
        const model = new Model();
        expect(model.query.get("query")).toBe("query");
    });
});