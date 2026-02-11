import { ViewModel } from "./ViewModel";
import { describe, expect, it } from "vitest";

/**
 * テスト用の具象ViewModelクラス
 */
class TestViewModel extends ViewModel
{
    async initialize(): Promise<void> {}
}

describe("ViewModel Test", () =>
{
    it("should create an instance", () =>
    {
        const viewModel = new TestViewModel();
        expect(viewModel).toBeInstanceOf(ViewModel);
    });

    it("should have initialize method", () =>
    {
        const viewModel = new TestViewModel();
        expect(viewModel.initialize).toBeDefined();
        expect(typeof viewModel.initialize).toBe("function");
    });

    it("initialize should return Promise<void>", async () =>
    {
        const viewModel = new TestViewModel();
        const result = await viewModel.initialize();
        expect(result).toBeUndefined();
    });

    it("should be able to call initialize multiple times", async () =>
    {
        const viewModel = new TestViewModel();
        await viewModel.initialize();
        await viewModel.initialize();
        expect(viewModel).toBeInstanceOf(ViewModel);
    });

    it("should be extendable", () =>
    {
        class CustomViewModel extends ViewModel
        {
            async initialize(): Promise<void>
            {
                // Custom initialization
            }
        }

        const customViewModel = new CustomViewModel();
        expect(customViewModel).toBeInstanceOf(ViewModel);
        expect(customViewModel).toBeInstanceOf(CustomViewModel);
    });

    it("extended class should override initialize method", async () =>
    {
        let initCalled = false;

        class CustomViewModel extends ViewModel
        {
            async initialize(): Promise<void>
            {
                initCalled = true;
            }
        }

        const customViewModel = new CustomViewModel();
        await customViewModel.initialize();

        expect(initCalled).toBe(true);
    });

    it("extended class can have additional properties", () =>
    {
        class CustomViewModel extends ViewModel
        {
            public data: string = "test";

            async initialize(): Promise<void>
            {
                this.data = "initialized";
            }
        }

        const customViewModel = new CustomViewModel();
        expect(customViewModel.data).toBe("test");
    });

    it("extended class can modify properties in initialize", async () =>
    {
        class CustomViewModel extends ViewModel
        {
            public data: string = "test";

            async initialize(): Promise<void>
            {
                this.data = "initialized";
            }
        }

        const customViewModel = new CustomViewModel();
        await customViewModel.initialize();
        expect(customViewModel.data).toBe("initialized");
    });

    it("extended class can have async operations in initialize", async () =>
    {
        class CustomViewModel extends ViewModel
        {
            public loaded: boolean = false;

            async initialize(): Promise<void>
            {
                await new Promise(resolve => setTimeout(resolve, 10));
                this.loaded = true;
            }
        }

        const customViewModel = new CustomViewModel();
        expect(customViewModel.loaded).toBe(false);
        await customViewModel.initialize();
        expect(customViewModel.loaded).toBe(true);
    });
});
