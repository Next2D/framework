import "@next2d/player";
import { Capture } from "./Capture";
import { context, $createContext } from "../../application/variable/Context";
import { $setConfig } from "../../application/variable/Config";

describe("CaptureTest", () =>
{
    test("execute test", () =>
    {
        // mock
        const config = {
            "platform": "web",
            "spa": true,
            "stage": {
                "width": 240,
                "height": 240,
                "fps": 12,
                "options": {}
            }
        };

        $setConfig(config);
        const capture = new Capture();
        if (context) {
            capture
                .execute()
                .then((result: void) =>
                {
                    expect(result).toBe(undefined);
                });
        } else {
            $createContext(config)
                .then(() =>
                {
                    capture
                        .execute()
                        .then((result: void) =>
                        {
                            expect(result).toBe(undefined);
                        });
                });
        }
    });
});