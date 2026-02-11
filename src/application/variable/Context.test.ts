import { describe, expect, it, vi } from "vitest";

describe("Context variable Test", () =>
{
    it("$getContext should throw error when context is not initialized", async () =>
    {
        // Reset modules to get a fresh Context module state
        vi.resetModules();
        const { $getContext } = await import("./Context");

        expect(() => $getContext()).toThrow("Context is not initialized. Call run() first.");
    });

    it("$setContext should set the context and $getContext should return it", async () =>
    {
        vi.resetModules();
        const { $getContext, $setContext } = await import("./Context");
        const { Context } = await import("../Context");
        const { MovieClip } = await import("@next2d/display");

        const root = new MovieClip();
        const context = new Context(root);

        $setContext(context);
        const result = $getContext();

        expect(result).toBe(context);
        expect(result.root).toBe(root);
    });

    it("$getContext should return the same context that was set", async () =>
    {
        vi.resetModules();
        const { $getContext, $setContext } = await import("./Context");
        const { Context } = await import("../Context");
        const { MovieClip } = await import("@next2d/display");

        const root1 = new MovieClip();
        const context1 = new Context(root1);
        $setContext(context1);
        expect($getContext()).toBe(context1);

        const root2 = new MovieClip();
        const context2 = new Context(root2);
        $setContext(context2);
        expect($getContext()).toBe(context2);
    });
});
