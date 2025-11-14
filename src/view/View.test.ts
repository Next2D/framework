import { View } from "./View";
import { describe, expect, it } from "vitest";

describe("View Test", () =>
{
    it("should create an instance", () =>
    {
        const view = new View();
        expect(view).toBeInstanceOf(View);
    });

    it("should have initialize method", () =>
    {
        const view = new View();
        expect(view.initialize).toBeDefined();
        expect(typeof view.initialize).toBe("function");
    });

    it("should have onEnter method", () =>
    {
        const view = new View();
        expect(view.onEnter).toBeDefined();
        expect(typeof view.onEnter).toBe("function");
    });

    it("should have onExit method", () =>
    {
        const view = new View();
        expect(view.onExit).toBeDefined();
        expect(typeof view.onExit).toBe("function");
    });

    it("initialize should return Promise<void>", async () =>
    {
        const view = new View();
        const result = await view.initialize();
        expect(result).toBeUndefined();
    });

    it("onEnter should return Promise<void>", async () =>
    {
        const view = new View();
        const result = await view.onEnter();
        expect(result).toBeUndefined();
    });

    it("onExit should return Promise<void>", async () =>
    {
        const view = new View();
        const result = await view.onExit();
        expect(result).toBeUndefined();
    });

    it("should be able to call lifecycle methods in sequence", async () =>
    {
        const view = new View();
        await view.initialize();
        await view.onEnter();
        await view.onExit();
        expect(view).toBeInstanceOf(View);
    });

    it("should be extendable", () =>
    {
        class CustomView extends View
        {
            async initialize(): Promise<void>
            {
                // Custom initialization
            }

            async onEnter(): Promise<void>
            {
                // Custom onEnter
            }

            async onExit(): Promise<void>
            {
                // Custom onExit
            }
        }

        const customView = new CustomView();
        expect(customView).toBeInstanceOf(View);
        expect(customView).toBeInstanceOf(CustomView);
    });

    it("extended class should override lifecycle methods", async () =>
    {
        let initCalled = false;
        let enterCalled = false;
        let exitCalled = false;

        class CustomView extends View
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

        const customView = new CustomView();
        await customView.initialize();
        await customView.onEnter();
        await customView.onExit();

        expect(initCalled).toBe(true);
        expect(enterCalled).toBe(true);
        expect(exitCalled).toBe(true);
    });
});
