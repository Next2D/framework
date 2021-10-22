import { View } from "../../src/view/View";

describe("ViewTest", () =>
{
    test("initialize call", () => {
        const view = new View();
        expect(view.initialize()).toBe(undefined);
    });
});