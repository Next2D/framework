import { execute } from "./ContentBuilderService";
import { ShapeContent } from "../../ShapeContent";
import { loaderInfoMap } from "../../../variable/LoaderInfoMap";
import { Shape, type LoaderInfo } from "@next2d/display";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("ContentBuilderService Test", () =>
{
    beforeEach(() =>
    {
        loaderInfoMap.clear();
    });

    it("should sync display object when all data is valid", () =>
    {
        const displayObject = new ShapeContent();

        let state = "none";
        displayObject.$sync = vi.fn(() =>
        {
            state = "sync";
        });

        const map: Map<string, number> = new Map();
        map.set(Shape.namespace, 1);
        loaderInfoMap.set(Shape.namespace, {
            "data": {
                "stage": {
                    "width": 100,
                    "height": 100,
                    "fps": 60,
                    "bgColor": "#000000"
                },
                "characters": [
                    {
                        "extends": Shape.namespace,
                        "bounds": { "xMin": 0, "yMin": 0, "xMax": 100, "yMax": 100 },
                        "bitmapId": 0
                    },
                    {
                        "extends": Shape.namespace,
                        "bounds": { "xMin": 0, "yMin": 0, "xMax": 100, "yMax": 100 },
                        "bitmapId": 0
                    }
                ],
                "symbols": map
            }
        } as LoaderInfo);

        expect(state).toBe("none");
        expect(displayObject.characterId).toBe(-1);
        execute(displayObject);
        expect(state).toBe("sync");
        expect(displayObject.characterId).toBe(1);
    });

    it("should return early when loaderInfo is not found", () =>
    {
        const displayObject = new ShapeContent();
        displayObject.$sync = vi.fn();

        execute(displayObject);

        expect(displayObject.$sync).not.toHaveBeenCalled();
        expect(displayObject.characterId).toBe(-1);
    });

    it("should return early when loaderInfo.data is null", () =>
    {
        const displayObject = new ShapeContent();
        displayObject.$sync = vi.fn();

        loaderInfoMap.set(Shape.namespace, {
            "data": null
        } as unknown as LoaderInfo);

        execute(displayObject);

        expect(displayObject.$sync).not.toHaveBeenCalled();
        expect(displayObject.characterId).toBe(-1);
    });

    it("should return early when characterId is not found in symbols", () =>
    {
        const displayObject = new ShapeContent();
        displayObject.$sync = vi.fn();

        const map: Map<string, number> = new Map();
        // Do not set the namespace in the map
        loaderInfoMap.set(Shape.namespace, {
            "data": {
                "symbols": map,
                "characters": []
            }
        } as unknown as LoaderInfo);

        execute(displayObject);

        expect(displayObject.$sync).not.toHaveBeenCalled();
        expect(displayObject.characterId).toBe(-1);
    });

    it("should return early when character is not found", () =>
    {
        const displayObject = new ShapeContent();
        displayObject.$sync = vi.fn();

        const map: Map<string, number> = new Map();
        map.set(Shape.namespace, 5); // characterId 5 doesn't exist in characters array
        loaderInfoMap.set(Shape.namespace, {
            "data": {
                "symbols": map,
                "characters": [
                    { "extends": Shape.namespace }
                ]
            }
        } as unknown as LoaderInfo);

        execute(displayObject);

        expect(displayObject.$sync).not.toHaveBeenCalled();
        expect(displayObject.characterId).toBe(-1);
    });
});