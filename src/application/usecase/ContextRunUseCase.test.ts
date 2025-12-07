import { execute } from "./ContextRunUseCase";
import { $getContext } from "../variable/Context";
import { describe, expect, it, vi } from "vitest";
import { MovieClip } from "@next2d/display";

const root = new MovieClip();

Object.defineProperty(window, "next2d", {
    "get": vi.fn().mockReturnValue({
        "createRootMovieClip": async () => {
            return root;
        }
    })
});

describe("ContextRunUseCase Test", () =>
{
    it("execute test case", async () =>
    {
        const config = {
            "platform": "web",
            "spa": false,
            "stage": {
                "width": 800,
                "height": 600,
                "fps": 60
            }
        };

        await execute(config);
        const context = $getContext();
        expect(context).not.toBeNull();
        expect(context.root.instanceId).toBe(root.instanceId);
    });
});
