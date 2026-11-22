import { describe, expect, it, vi, beforeEach } from "vitest";
import { Event } from "@next2d/events";

vi.mock("@next2d/display", async () =>
{
    const { EventDispatcher } = await import("@next2d/events");
    return { "stage": new EventDispatcher() };
});

vi.mock("../../domain/service/LoadingService", () => ({
    "LoadingService": {
        "end": vi.fn().mockResolvedValue(undefined)
    }
}));

vi.mock("../../domain/service/ScreenOverlayService", () => ({
    "ScreenOverlayService": {
        "dispose": vi.fn()
    }
}));

describe("LoadingEndOnExitFrameUseCase Test", () =>
{
    beforeEach(async () =>
    {
        const { cancel } = await import("./LoadingEndOnExitFrameUseCase");
        cancel();
        vi.clearAllMocks();
    });

    it("execute test: ends loading and disposes overlay on EXIT_FRAME", async () =>
    {
        const { stage } = await import("@next2d/display");
        const { LoadingService } = await import("../../domain/service/LoadingService");
        const { ScreenOverlayService } = await import("../../domain/service/ScreenOverlayService");
        const { execute } = await import("./LoadingEndOnExitFrameUseCase");

        let resolved = false;
        const promise = execute().then(() => { resolved = true });

        expect(stage.hasEventListener(Event.EXIT_FRAME)).toBe(true);
        expect(LoadingService.end).not.toHaveBeenCalled();
        expect(ScreenOverlayService.dispose).not.toHaveBeenCalled();

        await Promise.resolve();
        expect(resolved).toBe(false);

        stage.dispatchEvent(new Event(Event.EXIT_FRAME));
        await promise;

        expect(resolved).toBe(true);
        expect(LoadingService.end).toHaveBeenCalledTimes(1);
        expect(ScreenOverlayService.dispose).toHaveBeenCalledTimes(1);
        expect(stage.hasEventListener(Event.EXIT_FRAME)).toBe(false);
    });

    it("execute test: runs only once", async () =>
    {
        const { stage } = await import("@next2d/display");
        const { LoadingService } = await import("../../domain/service/LoadingService");
        const { execute } = await import("./LoadingEndOnExitFrameUseCase");

        const promise = execute();
        stage.dispatchEvent(new Event(Event.EXIT_FRAME));
        await promise;

        stage.dispatchEvent(new Event(Event.EXIT_FRAME));
        await Promise.resolve();

        expect(LoadingService.end).toHaveBeenCalledTimes(1);
    });

    it("execute test: ENTER_FRAME does not end loading", async () =>
    {
        const { stage } = await import("@next2d/display");
        const { LoadingService } = await import("../../domain/service/LoadingService");
        const { execute } = await import("./LoadingEndOnExitFrameUseCase");

        execute();
        stage.dispatchEvent(new Event(Event.ENTER_FRAME));
        await Promise.resolve();

        expect(LoadingService.end).not.toHaveBeenCalled();
        expect(stage.hasEventListener(Event.EXIT_FRAME)).toBe(true);
    });

    it("execute test: previous listener is replaced by a new transition", async () =>
    {
        const { stage } = await import("@next2d/display");
        const { LoadingService } = await import("../../domain/service/LoadingService");
        const { execute } = await import("./LoadingEndOnExitFrameUseCase");

        execute();
        const promise = execute();

        stage.dispatchEvent(new Event(Event.EXIT_FRAME));
        await promise;

        expect(LoadingService.end).toHaveBeenCalledTimes(1);
        expect(stage.hasEventListener(Event.EXIT_FRAME)).toBe(false);
    });

    it("cancel test: removes pending listener", async () =>
    {
        const { stage } = await import("@next2d/display");
        const { LoadingService } = await import("../../domain/service/LoadingService");
        const { execute, cancel } = await import("./LoadingEndOnExitFrameUseCase");

        execute();
        cancel();

        expect(stage.hasEventListener(Event.EXIT_FRAME)).toBe(false);

        stage.dispatchEvent(new Event(Event.EXIT_FRAME));
        await Promise.resolve();
        expect(LoadingService.end).not.toHaveBeenCalled();
    });

    it("execute test: rejects when loading end fails", async () =>
    {
        const { stage } = await import("@next2d/display");
        const { LoadingService } = await import("../../domain/service/LoadingService");
        const { execute } = await import("./LoadingEndOnExitFrameUseCase");

        vi.mocked(LoadingService.end).mockRejectedValueOnce(new Error("end failed"));

        const promise = execute();
        stage.dispatchEvent(new Event(Event.EXIT_FRAME));

        await expect(promise).rejects.toThrow("end failed");
    });
});
