import { LoadingService } from "./LoadingService";
import { MovieClip } from "@next2d/display";
import { Context } from "../../application/Context";
import { $setContext } from "../../application/variable/Context";
import { $setConfig } from "../../application/variable/Config";
import { $setPackages, packages } from "../../application/variable/Packages";
import { $setInstance, $getInstance } from "../variable/Loading";
import { DefaultLoader } from "../entity/DefaultLoader";
import { describe, expect, it, beforeEach } from "vitest";

describe("LoadingService Test", () =>
{
    beforeEach(() =>
    {
        $setInstance(null as any);
    });

    describe("getInstance", () =>
    {
        it("should return null if config has no loading", () =>
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

            const result = LoadingService.getInstance();

            expect(result).toBeNull();
        });

        it("should return null if loading callback is not set", () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                },
                "loading": {
                    "callback": ""
                }
            });

            const result = LoadingService.getInstance();

            expect(result).toBeNull();
        });

        it("should return DefaultLoader if callback class not in packages", () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                },
                "loading": {
                    "callback": "CustomLoader"
                }
            });

            $setPackages([]);

            const result = LoadingService.getInstance();

            expect(result).toBeInstanceOf(DefaultLoader);
        });

        it("should return same instance on multiple calls", () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                },
                "loading": {
                    "callback": "CustomLoader"
                }
            });

            $setPackages([]);

            const result1 = LoadingService.getInstance();
            const result2 = LoadingService.getInstance();

            expect(result1).toBe(result2);
        });
    });

    describe("start", () =>
    {
        it("should create loader and call start", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                },
                "loading": {
                    "callback": "Loader"
                }
            });

            const root = new MovieClip();
            $setContext(new Context(root));

            $setInstance(null);
            expect($getInstance()).toBeNull();
            await LoadingService.start();
            expect($getInstance()).not.toBeNull();
        });

        it("should call custom loader start method", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                },
                "loading": {
                    "callback": "LoaderTest"
                }
            });

            let state = "none";
            class LoaderTest {
                start(): void {
                    state = "start";
                }
            }

            packages.clear();
            packages.set("LoaderTest", LoaderTest);

            $setInstance(null);
            expect(state).toBe("none");
            await LoadingService.start();
            expect(state).toBe("start");
        });
    });

    describe("end", () =>
    {
        it("should call custom loader end method", async () =>
        {
            $setConfig({
                "platform": "web",
                "spa": false,
                "stage": {
                    "width": 800,
                    "height": 600,
                    "fps": 60
                },
                "loading": {
                    "callback": "LoaderTest"
                }
            });

            let state = "none";
            class LoaderTest {
                end(): void {
                    state = "end";
                }
            }

            packages.clear();
            packages.set("LoaderTest", LoaderTest);

            $setInstance(null);
            expect(state).toBe("none");
            await LoadingService.end();
            expect(state).toBe("end");
        });

        it("should do nothing if no loader configured", async () =>
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

            await LoadingService.end();

            expect($getInstance()).toBeNull();
        });
    });
});
