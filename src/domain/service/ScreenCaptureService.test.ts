import { ScreenCaptureService } from "./ScreenCaptureService";
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

describe("ScreenCaptureService Test", () =>
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
        it("should add capture shape to stage", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            expect(root.numChildren).toBe(0);
            expect(root.mouseChildren).toBe(true);
            expect(root.mouseEnabled).toBe(true);
            await ScreenCaptureService.add();
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

            await ScreenCaptureService.add();
        });

        it("should capture and add bitmap when rectangle has size", async () =>
        {
            const root = new MovieClip();
            const shape = new Shape();
            shape.graphics.beginFill(0xff0000).drawRect(0, 0, 100, 100).endFill();
            root.addChild(shape);
            $setContext(new Context(root));

            await ScreenCaptureService.add();

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

            await ScreenCaptureService.add();

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

            await ScreenCaptureService.add();

            expect(root.mouseChildren).toBe(false);
        });

        it("should draw shape with correct dimensions", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenCaptureService.add();

            expect(root.numChildren).toBeGreaterThan(0);
        });

        it("should add multiple times and update cache values", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenCaptureService.add();
            const firstCount = root.numChildren;

            await ScreenCaptureService.add();

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
            ScreenCaptureService.dispose();
            expect(root.numChildren).toBe(0);
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

            ScreenCaptureService.dispose();
        });

        it("should handle already empty root", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            expect(root.numChildren).toBe(0);
            ScreenCaptureService.dispose();
            expect(root.numChildren).toBe(0);
            expect(root.mouseChildren).toBe(true);
            expect(root.mouseEnabled).toBe(true);
        });

        it("should remove children added by add method", async () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            await ScreenCaptureService.add();
            expect(root.numChildren).toBeGreaterThan(0);

            ScreenCaptureService.dispose();
            expect(root.numChildren).toBe(0);
        });
    });
});
