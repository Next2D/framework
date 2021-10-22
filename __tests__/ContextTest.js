import { Context } from "../src/Context";

describe("ContextTest", () =>
{
    test("sample", () => {
        const context = new Context();
        expect(context._$view).toBe(null);
    });

});