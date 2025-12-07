import { ScreenCaptureService } from "./ScreenCaptureService";
import { MovieClip, Shape } from "@next2d/display";
import { Context } from "../../application/Context";
import { $setContext } from "../../application/variable/Context";
import { $setConfig } from "../../application/variable/Config";
import { describe, expect, it, vi } from "vitest";

Object.defineProperty(window, "next2d", {
    "get": vi.fn().mockReturnValue({
        "captureToCanvas": async () => {
            return document.createElement("canvas");
        }
    })
});

describe("ScreenCaptureService Test", () =>
{
    describe("add", () =>
    {
        it("should add capture shape to stage", async () =>
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
            $setContext(new Context(root));

            expect(root.numChildren).toBe(0);
            expect(root.mouseChildren).toBe(true);
            await ScreenCaptureService.add();
            expect(root.numChildren).toBe(1);
            expect(root.mouseChildren).toBe(false);
        });
    });

    describe("dispose", () =>
    {
        it("should remove all children and enable mouse", () =>
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
            $setContext(new Context(root));

            root.mouseChildren = false;
            root.addChild(new Shape());
            root.addChild(new Shape());

            expect(root.numChildren).toBe(2);
            expect(root.mouseChildren).toBe(false);
            ScreenCaptureService.dispose();
            expect(root.numChildren).toBe(0);
            expect(root.mouseChildren).toBe(true);
        });
    });
});
