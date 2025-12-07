import { View } from "./View";
import { ViewModel } from "./ViewModel";
import { describe, expect, it } from "vitest";

/**
 * テスト用の具象ViewModelクラス
 */
class TestViewModel extends ViewModel
{
    async initialize(): Promise<void> {}
}

/**
 * テスト用の具象Viewクラス
 */
class TestView extends View<TestViewModel>
{
    async initialize(): Promise<void> {}
    async onEnter(): Promise<void> {}
    async onExit(): Promise<void> {}
}

describe("View Test", () =>
{
    it("should create an instance", () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        expect(view).toBeInstanceOf(View);
    });

    it("should have initialize method", () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        expect(view.initialize).toBeDefined();
        expect(typeof view.initialize).toBe("function");
    });

    it("should have onEnter method", () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        expect(view.onEnter).toBeDefined();
        expect(typeof view.onEnter).toBe("function");
    });

    it("should have onExit method", () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        expect(view.onExit).toBeDefined();
        expect(typeof view.onExit).toBe("function");
    });

    it("initialize should return Promise<void>", async () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        const result = await view.initialize();
        expect(result).toBeUndefined();
    });

    it("onEnter should return Promise<void>", async () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        const result = await view.onEnter();
        expect(result).toBeUndefined();
    });

    it("onExit should return Promise<void>", async () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        const result = await view.onExit();
        expect(result).toBeUndefined();
    });

    it("should be able to call lifecycle methods in sequence", async () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        await view.initialize();
        await view.onEnter();
        await view.onExit();
        expect(view).toBeInstanceOf(View);
    });

    it("should be extendable", () =>
    {
        class CustomViewModel extends ViewModel
        {
            async initialize(): Promise<void> {}
        }

        class CustomView extends View<CustomViewModel>
        {
            async initialize(): Promise<void> {}
            async onEnter(): Promise<void> {}
            async onExit(): Promise<void> {}
        }

        const vm = new CustomViewModel();
        const customView = new CustomView(vm);
        expect(customView).toBeInstanceOf(View);
        expect(customView).toBeInstanceOf(CustomView);
    });

    it("extended class should override lifecycle methods", async () =>
    {
        let initCalled = false;
        let enterCalled = false;
        let exitCalled = false;

        class CustomViewModel extends ViewModel
        {
            async initialize(): Promise<void> {}
        }

        class CustomView extends View<CustomViewModel>
        {
            async initialize(): Promise<void>
            {
                initCalled = true;
            }

            async onEnter(): Promise<void>
            {
                enterCalled = true;
            }

            async onExit(): Promise<void>
            {
                exitCalled = true;
            }
        }

        const vm = new CustomViewModel();
        const customView = new CustomView(vm);
        await customView.initialize();
        await customView.onEnter();
        await customView.onExit();

        expect(initCalled).toBe(true);
        expect(enterCalled).toBe(true);
        expect(exitCalled).toBe(true);
    });

    it("should have vm property set via constructor", () =>
    {
        const vm = new TestViewModel();
        const view = new TestView(vm);
        expect(view["vm"]).toBe(vm);
    });
});
