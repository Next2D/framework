import { execute } from "./ApplicationGotoViewUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MovieClip } from "@next2d/display";
import { Context } from "../../Context";
import { $setConfig } from "../../variable/Config";
import { $setContext } from "../../variable/Context";
import { response } from "../../../infrastructure/Response/variable/Response";

vi.mock("../../../domain/screen/Capture/service/AddScreenCaptureService", () => ({
    execute: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("../../../domain/screen/Capture/service/DisposeCaptureService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../domain/loading/Loading/service/LoadingStartService", () => ({
    execute: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("../../../domain/loading/Loading/service/LoadingEndService", () => ({
    execute: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("../../../infrastructure/Response/usecase/ResponseRemoveVariableUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../service/ApplicationQueryStringParserService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../infrastructure/Request/usecase/RequestUseCase", () => ({
    execute: vi.fn().mockResolvedValue([])
}));

vi.mock("../../../domain/callback/service/CallbackService", () => ({
    execute: vi.fn().mockResolvedValue(undefined)
}));

vi.mock("../../Context/usecase/ContextBindUseCase", () => ({
    execute: vi.fn().mockResolvedValue(null)
}));

vi.mock("../../Context/service/ContextUnbindService", () => ({
    execute: vi.fn().mockResolvedValue(undefined)
}));

describe("ApplicationGotoViewUseCase Test", () =>
{
    let mockApplication: any;
    let mockContext: Context;
    let root: MovieClip;

    beforeEach(() =>
    {
        response.clear();

        mockApplication = {
            currentName: "",
            popstate: false
        };

        root = new MovieClip();
        mockContext = new Context(root);

        $setContext(mockContext);
        $setConfig({
            platform: "web",
            spa: false,
            stage: {
                width: 800,
                height: 600,
                fps: 60
            }
        });

        global.history = {
            pushState: vi.fn()
        } as any;

        global.location = {
            origin: "http://localhost"
        } as any;

        vi.clearAllMocks();
    });

    it("execute test case1: basic navigation without loading", async () =>
    {
        const { execute: applicationQueryStringParserService } = await import("../service/ApplicationQueryStringParserService");
        const { execute: requestUseCase } = await import("../../../infrastructure/Request/usecase/RequestUseCase");
        const { execute: contextBindUseCase } = await import("../../Context/usecase/ContextBindUseCase");

        vi.mocked(applicationQueryStringParserService).mockReturnValue({
            name: "home",
            queryString: ""
        });

        vi.mocked(requestUseCase).mockResolvedValue([]);

        await execute(mockApplication, "home");

        expect(mockApplication.currentName).toBe("home");
        expect(contextBindUseCase).toHaveBeenCalledWith(mockContext, "home");
    });

    it("execute test case2: navigation with response data", async () =>
    {
        const { execute: applicationQueryStringParserService } = await import("../service/ApplicationQueryStringParserService");
        const { execute: requestUseCase } = await import("../../../infrastructure/Request/usecase/RequestUseCase");

        vi.mocked(applicationQueryStringParserService).mockReturnValue({
            name: "dashboard",
            queryString: ""
        });

        const mockResponses = [
            { name: "user", response: { id: 1, name: "Test User" } },
            { name: "settings", response: { theme: "dark" } }
        ];

        vi.mocked(requestUseCase).mockResolvedValue(mockResponses);

        await execute(mockApplication, "dashboard");

        expect(response.get("user")).toEqual({ id: 1, name: "Test User" });
        expect(response.get("settings")).toEqual({ theme: "dark" });
        expect(mockApplication.currentName).toBe("dashboard");
    });

    it("execute test case3: handle response without name", async () =>
    {
        const { execute: applicationQueryStringParserService } = await import("../service/ApplicationQueryStringParserService");
        const { execute: requestUseCase } = await import("../../../infrastructure/Request/usecase/RequestUseCase");

        vi.mocked(applicationQueryStringParserService).mockReturnValue({
            name: "test",
            queryString: ""
        });

        const mockResponses = [
            { name: "", response: { data: "should be skipped" } },
            { name: "valid", response: { data: "should be set" } }
        ];

        vi.mocked(requestUseCase).mockResolvedValue(mockResponses);

        await execute(mockApplication, "test");

        expect(response.has("")).toBe(false);
        expect(response.get("valid")).toEqual({ data: "should be set" });
    });
});
