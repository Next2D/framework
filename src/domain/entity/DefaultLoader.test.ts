import { DefaultLoader } from "./DefaultLoader";
import { MovieClip, Shape } from "@next2d/display";
import { Context } from "../../application/Context";
import { $setContext } from "../../application/variable/Context";
import { $setConfig } from "../../application/variable/Config";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("DefaultLoader Test", () =>
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

    describe("constructor", () =>
    {
        it("should create DefaultLoader with sprite", () =>
        {
            const loader = new DefaultLoader();

            expect(loader.sprite).toBeDefined();
            expect(loader.sprite.numChildren).toBe(3);
        });
    });

    describe("initialize", () =>
    {
        it("should add 3 shapes to sprite", () =>
        {
            const loader = new DefaultLoader();

            expect(loader.sprite.numChildren).toBe(3);
            for (let i = 0; i < 3; i++) {
                const child = loader.sprite.getChildAt(i);
                expect(child).toBeInstanceOf(Shape);
            }
        });
    });

    describe("start", () =>
    {
        it("should return early when context root getter returns falsy", () =>
        {
            const mockContext = {
                "root": null,
                "view": null,
                "viewModel": null
            } as unknown as Context;
            $setContext(mockContext);

            const loader = new DefaultLoader();

            loader.start();
        });

        it("should add sprite to root when root exists", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();

            expect(root.numChildren).toBe(0);
            loader.start();
            expect(root.numChildren).toBe(1);
            expect(root.getChildAt(0)).toBe(loader.sprite);
        });

        it("should set initial scale and alpha on shapes", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();
            loader.start();

            for (let i = 0; i < 3; i++) {
                const shape = loader.sprite.getChildAt<Shape>(i);
                if (shape) {
                    expect(shape.scaleX).toBe(0.1);
                    expect(shape.scaleY).toBe(0.1);
                    expect(shape.alpha).toBe(0);
                }
            }
        });

        it("should position sprite in center of stage", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();
            loader.start();

            const config = { "stage": { "width": 800, "height": 600 } };
            const expectedX = (config.stage.width - loader.sprite.width) / 2;
            const expectedY = (config.stage.height - loader.sprite.height) / 2;

            expect(loader.sprite.x).toBe(expectedX);
            expect(loader.sprite.y).toBe(expectedY);
        });

        it("should draw circles on shapes", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();
            loader.start();

            for (let i = 0; i < 3; i++) {
                const shape = loader.sprite.getChildAt<Shape>(i);
                if (shape) {
                    expect(shape.graphics).toBeDefined();
                }
            }
        });

        it("should setup tween jobs on shapes", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();
            loader.start();

            for (let i = 0; i < 3; i++) {
                const shape = loader.sprite.getChildAt<Shape>(i);
                if (shape) {
                    expect(shape.hasLocalVariable("expandJob")).toBe(true);
                    expect(shape.hasLocalVariable("reduceJob")).toBe(true);
                }
            }
        });

        it("should not redraw shapes if size matches", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();

            loader.start();
            const firstShape = loader.sprite.getChildAt<Shape>(0);
            const width1 = firstShape?.width;

            loader.start();
            const width2 = firstShape?.width;

            expect(width1).toBe(width2);
        });
    });

    describe("end", () =>
    {
        it("should return early when context root getter returns falsy", () =>
        {
            const mockContext = {
                "root": null,
                "view": null,
                "viewModel": null
            } as unknown as Context;
            $setContext(mockContext);

            const loader = new DefaultLoader();

            loader.end();
        });

        it("should remove sprite from root", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();

            loader.start();
            expect(root.numChildren).toBe(1);

            loader.end();
            expect(root.numChildren).toBe(0);
        });

        it("should stop all tween jobs", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();

            loader.start();

            for (let i = 0; i < 3; i++) {
                const shape = loader.sprite.getChildAt<Shape>(i);
                if (shape) {
                    expect(shape.hasLocalVariable("expandJob")).toBe(true);
                    expect(shape.hasLocalVariable("reduceJob")).toBe(true);
                }
            }

            loader.end();

            expect(root.numChildren).toBe(0);
        });

        it("should handle shapes without jobs gracefully", () =>
        {
            const root = new MovieClip();
            $setContext(new Context(root));

            const loader = new DefaultLoader();
            root.addChild(loader.sprite);

            loader.end();

            expect(root.numChildren).toBe(0);
        });
    });

    describe("sprite property", () =>
    {
        it("should be readonly", () =>
        {
            const loader = new DefaultLoader();
            const sprite = loader.sprite;

            expect(sprite).toBe(loader.sprite);
        });
    });
});
