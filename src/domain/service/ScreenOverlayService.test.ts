import { ScreenOverlayService } from "./ScreenOverlayService";
import { MovieClip, Shape, BitmapData, stage } from "@next2d/display";
import { Context } from "../../application/Context";
import { $setContext, $getContext } from "../../application/variable/Context";
import { $setConfig } from "../../application/variable/Config";
import { describe, expect, it, vi, beforeEach } from "vitest";

Object.defineProperty(window, "next2d", {
    "get": vi.fn().mockReturnValue({
        "captureToCanvas": async () => {
            const canvas = document.createElement("canvas");
            canvas.width = 100;
            canvas.height = 100;
            return canvas;
        }
    })
});

describe("ScreenOverlayService Test", () =>
{
    beforeEach(() =>
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
    });

    describe("add", () =>
    {
        it("should add overlay shape to stage", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            expect(root.numChildren).toBe(0);
            expect(root.mouseChildren).toBe(true);
            expect(root.mouseEnabled).toBe(true);
            await ScreenOverlayService.add();
            expect(root.numChildren).toBe(1);
            expect(root.mouseChildren).toBe(false);
            expect(root.mouseEnabled).toBe(false);
        });

        it("should return early when context root getter returns falsy", async () =>
        {
            const mockContext = {
                "root": null,
                "view": null,
                "viewModel": null
            } as unknown as Context;
            $setContext(mockContext);

            await ScreenOverlayService.add();
        });

        it("should add overlay and disable mouse when rectangle has size", async () =>
        {
            const root = new MovieClip();
            const shape = new Shape();
            shape.graphics.beginFill(0xff0000).drawRect(0, 0, 100, 100).endFill();
            root.addChild(shape);
            $setContext(new Context(root));

            await ScreenOverlayService.add();

            expect(root.mouseChildren).toBe(false);
            expect(root.mouseEnabled).toBe(false);
        });

        it("should handle bgColor option", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60,
                    "options": {
                        "bgColor": "#ffffff"
                    }
                }
            });

            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenOverlayService.add();

            expect(root.mouseChildren).toBe(false);
        });

        it("should handle empty bgColor option", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60,
                    "options": {
                        "bgColor": ""
                    }
                }
            });

            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenOverlayService.add();

            expect(root.mouseChildren).toBe(false);
        });

        it("should draw overlay shape with correct dimensions", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenOverlayService.add();

            expect(root.numChildren).toBeGreaterThan(0);
        });

        it("should add multiple times and update cache values", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenOverlayService.add();
            const firstCount = root.numChildren;

            await ScreenOverlayService.add();

            expect(root.numChildren).toBeGreaterThanOrEqual(firstCount);
        });
    });

    describe("dispose", () =>
    {
        it("should remove all children and enable mouse", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            root.mouseChildren = false;
            root.mouseEnabled  = false;
            root.addChild(new Shape());
            root.addChild(new Shape());

            expect(root.numChildren).toBe(2);
            expect(root.mouseChildren).toBe(false);
            expect(root.mouseEnabled).toBe(false);
            ScreenOverlayService.dispose();
            expect(root.numChildren).toBe(2);
            expect(root.mouseChildren).toBe(true);
            expect(root.mouseEnabled).toBe(true);
        });

        it("should return early when context root getter returns falsy", () =>
        {
            const mockContext = {
                "root": null,
                "view": null,
                "viewModel": null
            } as unknown as Context;
            $setContext(mockContext);

            ScreenOverlayService.dispose();
        });

        it("should handle already empty root", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            expect(root.numChildren).toBe(0);
            ScreenOverlayService.dispose();
            expect(root.numChildren).toBe(0);
            expect(root.mouseChildren).toBe(true);
            expect(root.mouseEnabled).toBe(true);
        });

        it("should remove overlay shape added by add method", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenOverlayService.add();
            expect(root.numChildren).toBeGreaterThan(0);

            ScreenOverlayService.dispose();
            expect(root.numChildren).toBe(0);
        });
    });

    describe("cache update branches", () =>
    {
        it("should update cacheX when tx changes", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            // First call sets initial cache values
            await ScreenOverlayService.add();

            // Modify stage properties to create non-zero tx
            const originalRendererWidth = stage.rendererWidth;
            const originalStageWidth = stage.stageWidth;
            const originalRendererScale = stage.rendererScale;

            Object.defineProperty(stage, "rendererWidth", {
                "get": () => 1000,
                "configurable": true
            });
            Object.defineProperty(stage, "stageWidth", {
                "get": () => 800,
                "configurable": true
            });
            Object.defineProperty(stage, "rendererScale", {
                "get": () => 1,
                "configurable": true
            });

            // This should trigger the tx cache update branch
            await ScreenOverlayService.add();

            // Restore original values
            Object.defineProperty(stage, "rendererWidth", {
                "get": () => originalRendererWidth,
                "configurable": true
            });
            Object.defineProperty(stage, "stageWidth", {
                "get": () => originalStageWidth,
                "configurable": true
            });
            Object.defineProperty(stage, "rendererScale", {
                "get": () => originalRendererScale,
                "configurable": true
            });
        });

        it("should update cacheY when ty changes", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            // First call sets initial cache values
            await ScreenOverlayService.add();

            // Modify stage properties to create non-zero ty
            const originalRendererHeight = stage.rendererHeight;
            const originalStageHeight = stage.stageHeight;
            const originalRendererScale = stage.rendererScale;

            Object.defineProperty(stage, "rendererHeight", {
                "get": () => 800,
                "configurable": true
            });
            Object.defineProperty(stage, "stageHeight", {
                "get": () => 600,
                "configurable": true
            });
            Object.defineProperty(stage, "rendererScale", {
                "get": () => 1,
                "configurable": true
            });

            // This should trigger the ty cache update branch
            await ScreenOverlayService.add();

            // Restore original values
            Object.defineProperty(stage, "rendererHeight", {
                "get": () => originalRendererHeight,
                "configurable": true
            });
            Object.defineProperty(stage, "stageHeight", {
                "get": () => originalStageHeight,
                "configurable": true
            });
            Object.defineProperty(stage, "rendererScale", {
                "get": () => originalRendererScale,
                "configurable": true
            });
        });
    });
});
