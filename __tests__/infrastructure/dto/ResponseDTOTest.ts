import { ResponseDTO } from "../../../src/infrastructure/dto/ResponseDTO";

describe("ResponseDTO Test", () =>
{
    test("property check", () =>
    {
        const responseDTO: ResponseDTO = new ResponseDTO("string", "any");
        expect(responseDTO.name).toBe("string");
        expect(responseDTO.response).toBe("any");
    });
});
