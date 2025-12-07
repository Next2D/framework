import { ViewBinderService } from "./ViewBinderService";
import { MovieClip } from "@next2d/display";
import { Context } from "../../application/Context";
import { $setContext } from "../../application/variable/Context";
import { $setConfig } from "../../application/variable/Config";
import { packages } from "../../application/variable/Packages";
import { View } from "../../view/View";
import { ViewModel } from "../../view/ViewModel";
import { describe, expect, it } from "vitest";

describe("ViewBinderService Test", () =>
{
    describe("bind", () =>
    {
        it("should bind View and ViewModel", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            });

            let viewModelInitialized = false;
            let viewInitialized = false;
            let viewEntered = false;

            class TestViewModel extends ViewModel
            {
                async initialize ()
                {
                    viewModelInitialized = true;
                }
            }

            class TestView extends View<TestViewModel>
            {
                async initialize ()
                {
                    viewInitialized = true;
                }

                async onEnter ()
                {
                    viewEntered = true;
                }

                async onExit ()
                {
                }
            }

            packages.clear();
            packages.set("TestView", TestView);
            packages.set("TestViewModel", TestViewModel);

            const root = new MovieClip();
            const context = new Context(root);
            $setContext(context);

            expect(viewModelInitialized).toBe(false);
            expect(viewInitialized).toBe(false);
            expect(viewEntered).toBe(false);
            expect(root.numChildren).toBe(0);

            await ViewBinderService.bind(context, "test");

            expect(viewModelInitialized).toBe(true);
            expect(viewInitialized).toBe(true);
            expect(viewEntered).toBe(true);
            expect(root.numChildren).toBe(1);
            expect(context.view).toBeInstanceOf(TestView);
            expect(context.viewModel).toBeInstanceOf(TestViewModel);
        });

        it("should throw error when packages not found", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            });

            packages.clear();

            const root = new MovieClip();
            const context = new Context(root);
            $setContext(context);

            await expect(ViewBinderService.bind(context, "notfound")).rejects.toThrow("not found view or viewModel.");
        });

        it("should remove existing children before adding view", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            });

            class TestViewModel extends ViewModel
            {
                async initialize(): Promise<void> {}
            }
            class TestView extends View<TestViewModel>
            {
                async initialize(): Promise<void> {}
                async onEnter(): Promise<void> {}
                async onExit(): Promise<void> {}
            }

            packages.clear();
            packages.set("TestView", TestView);
            packages.set("TestViewModel", TestViewModel);

            const root = new MovieClip();
            root.addChild(new MovieClip());
            root.addChild(new MovieClip());

            const context = new Context(root);
            $setContext(context);

            expect(root.numChildren).toBe(2);

            await ViewBinderService.bind(context, "test");

            expect(root.numChildren).toBe(1);
            expect(context.view).toBeInstanceOf(TestView);
        });
    });

    describe("unbind", () =>
    {
        it("should unbind View and ViewModel", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            });

            const root = new MovieClip();
            const context = new Context(root);
            $setContext(context);

            let onExitCalled = false;

            class TestViewModel extends ViewModel
            {
                async initialize(): Promise<void> {}
            }

            class TestView extends View<TestViewModel>
            {
                async initialize(): Promise<void> {}
                async onEnter(): Promise<void> {}
                async onExit ()
                {
                    onExitCalled = true;
                }
            }

            const vm = new TestViewModel();
            context.view = new TestView(vm);
            root.addChild(context.view);
            context.viewModel = vm;

            expect(onExitCalled).toBe(false);
            expect(root.numChildren).toBe(1);

            await ViewBinderService.unbind(context);

            expect(onExitCalled).toBe(true);
            expect(root.numChildren).toBe(0);
        });

        it("should return early if view is null", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            });

            const root = new MovieClip();
            const context = new Context(root);
            $setContext(context);

            class TestViewModel extends ViewModel
            {
                async initialize(): Promise<void> {}
            }

            context.view = null;
            context.viewModel = new TestViewModel();

            await ViewBinderService.unbind(context);

            expect(root.numChildren).toBe(0);
        });

        it("should return early if viewModel is null", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            });

            const root = new MovieClip();
            const context = new Context(root);
            $setContext(context);

            class TestViewModel extends ViewModel
            {
                async initialize(): Promise<void> {}
            }

            class TestView extends View<TestViewModel>
            {
                async initialize(): Promise<void> {}
                async onEnter(): Promise<void> {}
                async onExit(): Promise<void> {}
            }

            const vm = new TestViewModel();
            context.view = new TestView(vm);
            context.viewModel = null;

            await ViewBinderService.unbind(context);

            expect(root.numChildren).toBe(0);
        });
    });
});
