import { Application } from "./Application";
import { MovieClip } from "@next2d/display";
import { Context } from "./Context";
import { $setConfig, $getConfig } from "./variable/Config";
import { $setContext, $getContext } from "./variable/Context";
import { $setPackages, packages } from "./variable/Packages";
import { response } from "../infrastructure/variable/Response";
import { cache } from "./variable/Cache";
import { View } from "../view/View";
import { ViewModel } from "../view/ViewModel";
import { describe, expect, it, beforeEach, vi } from "vitest";

Object.defineProperty(window, "next2d", {
    "value": {
        "createRootMovieClip": vi.fn().mockResolvedValue(new MovieClip())
    },
    "writable": true
});

describe("Application Test", () =>
{
    beforeEach(() =>
    {
        response.clear();
        cache.clear();
        packages.clear();
    });

    describe("constructor", () =>
    {
        it("should initialize with default values", () =>
        {
            const app = new Application();

            expect(app.popstate).toBe(false);
            expect(app.currentName).toBe("");
        });
    });

    describe("initialize", () =>
    {
        it("should initialize application with config and packages", () =>
        {
            const app = new Application();
            const config = {
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            };

            class TestClass {}
            const pkgs = [["TestClass", TestClass]] as const;

            const result = app.initialize(config, pkgs);

            expect(result).toBe(app);
            expect($getConfig()).toEqual(config);
            expect(packages.has("TestClass")).toBe(true);
        });

        it("should initialize with empty packages", () =>
        {
            const app = new Application();
            const config = {
                "platform": "web",
                "spa": true,
                "stage": {
                    "width": 1920,
                    "height": 1080,
                    "fps": 30
                }
            };

            const result = app.initialize(config, []);

            expect(result).toBe(app);
            expect($getConfig()).toEqual(config);
        });
    });

    describe("run", () =>
    {
        it("should run the application", async () =>
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

            const app = new Application();

            await expect(app.run()).resolves.toBeUndefined();
        });
    });

    describe("gotoView", () =>
    {
        it("should navigate to specified view", async () =>
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

            packages.set("TopView", TestView);
            packages.set("TopViewModel", TestViewModel);

            const root = new MovieClip();
            $setContext(new Context(root));

            const app = new Application();

            await app.gotoView("top");

            expect(app.currentName).toBe("top");
        });

        it("should navigate with default empty name", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "defaultTop": "home",
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                }
            });

            class HomeViewModel extends ViewModel
            {
                async initialize(): Promise<void> {}
            }

            class HomeView extends View<HomeViewModel>
            {
                async initialize(): Promise<void> {}
                async onEnter(): Promise<void> {}
                async onExit(): Promise<void> {}
            }

            packages.set("HomeView", HomeView);
            packages.set("HomeViewModel", HomeViewModel);

            const root = new MovieClip();
            $setContext(new Context(root));

            const app = new Application();

            await app.gotoView();

            expect(app.currentName).toBe("home");
        });
    });

    describe("getContext", () =>
    {
        it("should return the current context", () =>
        {
            const root = new MovieClip();
            const context = new Context(root);
            $setContext(context);

            const app = new Application();
            const result = app.getContext();

            expect(result).toBe(context);
            expect(result.root).toBe(root);
        });
    });

    describe("getResponse", () =>
    {
        it("should return the response map", () =>
        {
            const app = new Application();

            response.set("test", { "data": "value" });

            const result = app.getResponse();

            expect(result).toBe(response);
            expect(result.get("test")).toEqual({ "data": "value" });
        });

        it("should return empty map when no responses", () =>
        {
            const app = new Application();
            const result = app.getResponse();

            expect(result.size).toBe(0);
        });
    });

    describe("getCache", () =>
    {
        it("should return the cache map", () =>
        {
            const app = new Application();

            cache.set("cacheKey", { "cached": true });

            const result = app.getCache();

            expect(result).toBe(cache);
            expect(result.get("cacheKey")).toEqual({ "cached": true });
        });

        it("should return empty map when no cache", () =>
        {
            const app = new Application();
            const result = app.getCache();

            expect(result.size).toBe(0);
        });
    });

    describe("popstate", () =>
    {
        it("should be settable", () =>
        {
            const app = new Application();

            expect(app.popstate).toBe(false);
            app.popstate = true;
            expect(app.popstate).toBe(true);
        });
    });

    describe("currentName", () =>
    {
        it("should be settable", () =>
        {
            const app = new Application();

            expect(app.currentName).toBe("");
            app.currentName = "newPage";
            expect(app.currentName).toBe("newPage");
        });
    });
});
