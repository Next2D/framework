import { CustomRepository } from "../../../src/infrastructure/repository/CustomRepository";
import { RequestType } from "../../../src/infrastructure/constant/RequestType";
import { ConfigParser } from "../../../src/domain/parser/ConfigParser";

interface Object {
    type: string;
    name: string;
    path: string;
    cache?: boolean;
    class: string;
    access: string;
    method: string;
    callback?: string|string[];
    body?: object;
    headers?: HeadersInit;
}

describe("CustomRepository Test", () =>
{
    test("execute public test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const object: Object = {
            "type": RequestType.CUSTOM,
            "name": "CustomRepository",
            "path": "next2d",
            "method": "publicGet",
            "access": "public",
            "class": "CustomClass"
        };

        const packages: Map<string, any> = new Map();

        const CustomClass = class CustomClass
        {
            publicGet ()
            {
                return "publicGet";
            }
        };

        packages.set("CustomClass", CustomClass);

        // @ts-ignore
        next2d.fw.packages = packages;

        const customRepository = new CustomRepository();
        customRepository
            .execute(object)
            .then((response) =>
            {
                expect(response).toBe("publicGet");
            });
    });

    test("execute static test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const object: Object = {
            "type": RequestType.CUSTOM,
            "name": "CustomRepository",
            "path": "next2d",
            "method": "staticGet",
            "access": "static",
            "class": "CustomClass"
        };

        const packages: Map<string, any> = new Map();

        const CustomClass = class CustomClass
        {
            static staticGet ()
            {
                return "staticGet";
            }
        };

        packages.set("CustomClass", CustomClass);

        // @ts-ignore
        next2d.fw.packages = packages;

        const customRepository = new CustomRepository();
        customRepository
            .execute(object)
            .then((response) =>
            {
                expect(response).toBe("staticGet");
            });
    });

    test("execute not found test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.parser = new ConfigParser();

        const object: Object = {
            "type": RequestType.CUSTOM,
            "name": "CustomRepository",
            "path": "next2d",
            "method": "staticGet",
            "access": "static",
            "class": "CustomClass"
        };

        const packages: Map<string, any> = new Map();
        packages.clear();

        // @ts-ignore
        next2d.fw.packages = packages;

        const customRepository = new CustomRepository();
        customRepository
            .execute(object)
            .then((response) =>
            {
                expect(response).toBe(null);
            });
    });
});
