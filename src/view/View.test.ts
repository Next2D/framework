import { View } from "..";
import { describe, expect, it } from "vitest";

describe("ViewTest", () =>
{
    it("initialize call test", () => {
        const view: View = new View();
        expect(typeof view.initialize).toBe("function");
    });
});