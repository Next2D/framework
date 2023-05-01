import { View } from "../../src/view/View";

describe("ViewTest", () =>
{
    test("initialize call test", () => {
        const view = new View();
        expect(typeof view.initialize).toBe("function");
    });
});