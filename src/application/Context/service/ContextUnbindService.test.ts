import { execute } from "./ContextUnbindService";
import { MovieClip } from "@next2d/display";
import { Context } from "../../../application/Context";
import { $setContext } from "../../../application/variable/Context";
import { $setConfig } from "../../../application/variable/Config";
import { View } from "../../../view/View";
import { ViewModel } from "../../../view/ViewModel";
import { describe, expect, it } from "vitest";

describe("ContextUnbindService Test", () =>
{
    it("execute test case", async () =>
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

        const root = new MovieClip();
        const context = new Context(root);
        $setContext(context);

        let onExitCalled = false;

        class TestView extends View
        {
            async onExit ()
            {
                onExitCalled = true;
            }
        }

        context.view = new TestView();
        root.addChild(context.view);
        context.viewModel = new ViewModel();
        
        expect(onExitCalled).toBe(false);
        expect(root.numChildren).toBe(1);

        await execute(context);

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

        context.view = null;
        context.viewModel = new ViewModel();

        await execute(context);

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

        context.view = new View();
        context.viewModel = null;

        await execute(context);

        expect(root.numChildren).toBe(0);
    });
});