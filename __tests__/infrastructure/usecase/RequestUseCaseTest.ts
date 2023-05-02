import { RequestUseCase } from "../../../src/infrastructure/usecase/RequestUseCase";
import { ConfigParser } from "../../../src/domain/parser/ConfigParser";
import { RequestType } from "../../../src/infrastructure/constant/RequestType";
import { ResponseDTO } from "../../../src/infrastructure/dto/ResponseDTO";

describe("RequestUseCase Test", () =>
{
    test("request test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const packages: Map<string, any> = new Map();

        const TestRepository = {
            "get": () => {
                return "success custom";
            }
        };

        packages.set("TestRepository", TestRepository);

        // @ts-ignore
        next2d.fw.packages = packages;

        const cache: Map<string, any> = new Map();
        cache.set("JSONRepository", "success json");
        cache.set("ContentRepository", "success content");

        // @ts-ignore
        next2d.fw.cache = cache;

        // @ts-ignore
        next2d.fw.config = {
            "routing": {
                "test": {
                    "requests": [
                        {
                            "type": RequestType.CUSTOM,
                            "class": "TestRepository",
                            "access": "static",
                            "method": "get",
                            "name": "TestRepository"
                        },
                        {
                            "type": RequestType.JSON,
                            "cache": true,
                            "name": "JSONRepository"
                        },
                        {
                            "type": RequestType.CONTENT,
                            "cache": true,
                            "name": "ContentRepository"
                        }
                    ]
                }
            }
        };

        const requestUseCase: RequestUseCase = new RequestUseCase();
        const promises = requestUseCase.execute("test");

        Promise
            .all(promises)
            .then((responses) =>
            {
                expect(responses.length).toBe(3);

                const customResponse: ResponseDTO|void = responses[0];
                if (!customResponse) {
                    throw new Error("stop test");
                }
                expect(customResponse.name).toBe("TestRepository");
                expect(customResponse.response).toBe("success custom");

                const jsonResponse: ResponseDTO|void = responses[1];
                if (!jsonResponse) {
                    throw new Error("stop test");
                }
                expect(jsonResponse.name).toBe("JSONRepository");
                expect(jsonResponse.response).toBe("success json");

                const contentResponse: ResponseDTO|void = responses[2];
                if (!contentResponse) {
                    throw new Error("stop test");
                }
                expect(contentResponse.name).toBe("ContentRepository");
                expect(contentResponse.response).toBe("success content");
            });
    });
});
