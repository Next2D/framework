import { MovieClip } from "../../../src/model/common/MovieClip";

describe("MovieClipTest", () =>
{
    test("app test", () => {
        const mc = new MovieClip();
        expect(mc.app).toBe("app");
    });

    test("cache test", () => {
        const mc = new MovieClip();
        expect(mc.cache.get("cache")).toBe("cache");
    });

    test("config test", () => {
        const mc = new MovieClip();
        expect(mc.config.stage.width).toBe(240);
    });

    test("context test", () => {
        const mc = new MovieClip();
        expect(mc.context).toBe("context");
    });

    test("packages test", () => {
        const mc = new MovieClip();
        expect(mc.packages.get("class")).toBe("class");
    });

    test("response test", () => {
        const mc = new MovieClip();
        expect(mc.response.get("response")).toBe("response");
    });

    test("query test", () => {
        const mc = new MovieClip();
        expect(mc.query.get("query")).toBe("query");
    });
});