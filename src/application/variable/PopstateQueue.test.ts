import { popstateQueue, setPopstateQueue } from "./PopstateQueue";
import { describe, expect, it } from "vitest";

describe("PopstateQueue Test", () =>
{
    it("popstateQueue should be a resolved Promise initially", async () =>
    {
        const result = await popstateQueue;
        expect(result).toBeUndefined();
    });

    it("setPopstateQueue should update the popstateQueue", async () =>
    {
        let executed = false;
        const newQueue = Promise.resolve().then(() =>
        {
            executed = true;
        });

        setPopstateQueue(newQueue);

        await popstateQueue;

        expect(executed).toBe(true);
    });
});
