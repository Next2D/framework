import { describe, expect, it } from "vitest";
import {
    View,
    ViewModel
} from "..";

describe("ViewModelTest", () =>
{
    it("bind call test", () =>
    {
        const view: View = new View();
        const viewModel: ViewModel = new ViewModel();

        viewModel
            .bind(view)
            .then((result) =>
            {
                expect(result instanceof View).toBe(true);
            });

    });

    it("unbind call test", () =>
    {
        const viewModel: ViewModel = new ViewModel();
        expect(viewModel.unbind(new View())).toBe(undefined);
    });

    it("factory call test", () =>
    {
        const view: View = new View();
        const viewModel: ViewModel = new ViewModel();

        viewModel
            .factory(view)
            .then((result) =>
            {
                expect(result instanceof View).toBe(true);
            });
    });
});