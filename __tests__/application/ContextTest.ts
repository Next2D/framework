import { Context } from "../../src/application/Context";

describe("ContextTest", () =>
{
    test("initialize test", () => {
        const context = new Context();
        expect(typeof context.addChild).toBe("function");
    });
});