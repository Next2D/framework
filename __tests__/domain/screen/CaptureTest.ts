import { Capture } from "../../../src/domain/screen/Capture";

describe("CaptureTest", () =>
{
    test("execute test", () =>
    {
        // mock

        // @ts-ignore
        next2d.fw.context = {
            "root": {
                "_$created": true,
                "_$createWorkerInstance": () =>
                {
                    return undefined;
                },
                "stage": {
                    "canvasWidth": 100,
                    "canvasHeight": 100,
                    "_$player": {
                        "_$matrix": [1,0,0,1,10,10]
                    }
                },
                "addChild": (child: any) =>
                {
                    return child;
                },
                "numChildren": 1,
                "removeChild": (number: any) =>
                {
                    // @ts-ignore
                    next2d.fw.context.root.numChildren = number;
                },
                "getChildAt": () =>
                {
                    return 0;
                }
            }
        };

        const capture = new Capture();
        capture
            .execute()
            .then((result: void) =>
            {
                expect(result).toBe(undefined);
            });
    });
});