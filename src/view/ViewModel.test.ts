import { View } from "./View";
import { ViewModel } from "./ViewModel";
import { describe, expect, it } from "vitest";

describe("ViewModelTest", () =>
{
    it("bind call test", async () =>
    {
        const view = new View();
        const viewModel = new ViewModel();
        expect(await viewModel.bind(view)).toBe(view);
    });

    it("unbind call test", async () =>
    {
        const view = new View();
        const viewModel = new ViewModel();
        expect(await viewModel.unbind(view)).toBe(view);
    });
});