import { ViewModel } from "../../src/view/ViewModel";

describe("ViewModelTest", () =>
{
    test("bind call test", () => {
        const viewModel = new ViewModel();
        expect(typeof viewModel.bind).toBe("function");
    });

    test("unbind call test", () => {
        const viewModel = new ViewModel();
        expect(typeof viewModel.unbind).toBe("function");
    });
});