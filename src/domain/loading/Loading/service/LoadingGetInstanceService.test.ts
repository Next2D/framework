import { execute } from "./LoadingGetInstanceService";
import { $setConfig } from "../../../../application/variable/Config";
import { $setPackages } from "../../../../application/variable/Packages";
import { $setInstance } from "../../Loading";
import { DefaultLoader } from "../../DefaultLoader";
import { describe, expect, it, beforeEach } from "vitest";

describe("LoadingGetInstanceService Test", () =>
{
    beforeEach(() =>
    {
        $setInstance(null as any);
    });

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

        const result = execute();

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

        const result = execute();

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

        const result = execute();

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

        const result1 = execute();
        const result2 = execute();

        expect(result1).toBe(result2);
    });
});
