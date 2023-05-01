import { Content } from "../../../src/application/content/Content";

describe("ContentTest", () =>
{
    test("initialize test", () => {
        const content = new Content();
        expect(typeof content.initialize).toBe("function");
    });
});