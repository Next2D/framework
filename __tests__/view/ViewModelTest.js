import {ViewModel} from "../../src/view/ViewModel";

describe("ViewModelTest", () =>
{
    test("bind call", () => {
        const viewModel = new ViewModel();
        expect(viewModel.bind()).toBe(undefined);
    });

    test("unbind call", () => {
        const viewModel = new ViewModel();
        expect(viewModel.unbind()).toBe(undefined);
    });
});