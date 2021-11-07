import { Content } from "../../src/content/Content";

describe("ContentTest", () =>
{
    test("namespace test case1", () => {
        const content = new Content();
        expect(content.namespace).toBe(null);
    });

    test("namespace test case2", () => {

        // setup
        next2d.fw.loaderInfo.set("Content", Content);

        const content = new Content();
        expect(content.namespace).toBe(null);

        // reset
        next2d.fw.loaderInfo.delete("Content");
    });

});