import { ViewModel } from "../../src/view/ViewModel";

describe("ViewModelTest", () =>
{
    test("bind call test", () => {
        const viewModel: ViewModel = new ViewModel();
        expect(typeof viewModel.bind).toBe("function");
    });

    test("unbind call test", () => {
        const viewModel: ViewModel = new ViewModel();
        expect(typeof viewModel.unbind).toBe("function");
    });

    test("factory call test", () => {
        const viewModel: ViewModel = new ViewModel();

        viewModel
            .factory()
            .then((value) =>
            {
                expect(value).toBe(undefined);
            });
    });
});