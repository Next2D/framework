import { ResponseDTO } from "./ResponseDTO";
import { describe, expect, it } from "vitest";

describe("ResponseDTOTest", () =>
{
    it("execute test case1", () =>
    {
        const responseDTO = new ResponseDTO("", null);
        expect(responseDTO.name).toBe("");
        expect(responseDTO.response).toBe(null);
        expect(responseDTO.callback).toBeUndefined();
    });

    it("execute test case2", () =>
    {
        const responseDTO = new ResponseDTO("sample", 100);
        expect(responseDTO.name).toBe("sample");
        expect(responseDTO.response).toBe(100);
        expect(responseDTO.callback).toBeUndefined();
    });

    it("execute test case3 with callback", () =>
    {
        const responseDTO = new ResponseDTO("sample", { data: "test" }, "CallbackClass");
        expect(responseDTO.name).toBe("sample");
        expect(responseDTO.response).toEqual({ data: "test" });
        expect(responseDTO.callback).toBe("CallbackClass");
    });

    it("execute test case4 with callback array", () =>
    {
        const responseDTO = new ResponseDTO("sample", 200, ["Callback1", "Callback2"]);
        expect(responseDTO.name).toBe("sample");
        expect(responseDTO.response).toBe(200);
        expect(responseDTO.callback).toEqual(["Callback1", "Callback2"]);
    });
});
