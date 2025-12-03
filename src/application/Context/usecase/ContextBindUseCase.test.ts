import { execute } from "./ContextBindUseCase";
import { MovieClip } from "@next2d/display";
import { Context } from "../../../application/Context";
import { $setContext } from "../../../application/variable/Context";
import { $setConfig } from "../../../application/variable/Config";
import { packages } from "../../../application/variable/Packages";
import { View } from "../../../view/View";
import { ViewModel } from "../../../view/ViewModel";
import { describe, expect, it } from "vitest";

describe("ContextBindUseCase Test", () =>
{
    it("execute test case1", async () =>
    {
        // mock
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

        class TestView extends View
        {
            async initialize ()
            {
                viewInitialized = true;
            }

            async onEnter ()
            {
                viewEntered = true;
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

        await execute(context, "test");

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

        await expect(execute(context, "notfound")).rejects.toThrow("not found view or viewMode.");
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

        class TestViewModel extends ViewModel {}
        class TestView extends View {}

        packages.clear();
        packages.set("TestView", TestView);
        packages.set("TestViewModel", TestViewModel);

        const root = new MovieClip();
        root.addChild(new MovieClip());
        root.addChild(new MovieClip());

        const context = new Context(root);
        $setContext(context);

        expect(root.numChildren).toBe(2);

        await execute(context, "test");

        expect(root.numChildren).toBe(1);
        expect(context.view).toBeInstanceOf(TestView);
    });
});