import { ViewModel } from "../../src/view/ViewModel";
import { View } from "../../src/view/View";

describe("ViewModelTest", () =>
{
    test("bind call test", () => {
        const viewModel: ViewModel = new ViewModel();
        expect(viewModel.bind(new View())).toBe(undefined);
    });

    test("unbind call test", () => {
        const viewModel: ViewModel = new ViewModel();
        expect(viewModel.unbind(new View())).toBe(undefined);
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