import { Content } from "../../../src/application/content/Content";

describe("ContentTest", () =>
{
    test("initialize test", () => {

        // mock
        const loaderInfo: Map<string, any> = new Map();

        loaderInfo.set("next2d.display.MovieClip", true);

        // @ts-ignore
        next2d.fw.loaderInfo = loaderInfo;

        const content = new Content();
        expect(content.initialize()).toBe(undefined);
    });
});