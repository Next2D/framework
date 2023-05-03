import { DefaultLoading } from "../../../src/domain/screen/DefaultLoading";

describe("DefaultLoadingTest", () =>
{
    test("start function no element test", () =>
    {
        // @ts-ignore
        $elements.clear();

        // @ts-ignore
        $elements.set(
            "__next2d__framework_loading",
            // @ts-ignore
            document.createElement()
        );

        const defaultLoading = new DefaultLoading();
        defaultLoading.start();

        const element = document
            .getElementById("__next2d__framework_loading");
        if (!element) {
            throw new Error("stop test");
        }

        expect(element.getAttribute("style")).toBe("");
    });

    test("start function no parent test", () =>
    {
        // mock
        // @ts-ignore
        $elements.clear();

        // @ts-ignore
        next2d.fw.context = {
            "root": {
                "stage": {
                    "player": {
                        "contentElementId": "__next2d__"
                    }
                }
            }
        };

        const defaultLoading = new DefaultLoading();
        defaultLoading.start();

        // @ts-ignore
        expect($elements.size).toBe(0);
    });

    test("start function test", () =>
    {
        // mock
        // @ts-ignore
        next2d.fw.context = {
            "root": {
                "stage": {
                    "player": {
                        "contentElementId": "__next2d__"
                    }
                }
            }
        };

        // @ts-ignore
        $elements.clear();

        // @ts-ignore
        $elements.set("__next2d__", document.createElement());

        const defaultLoading = new DefaultLoading();
        defaultLoading.start();

        const element = document
            .getElementById("__next2d__framework_loading");

        if (!element) {
            throw new Error("stop test");
        }

        expect(element.id).toBe("__next2d__framework_loading");
    });

    test("end function no element test", () =>
    {
        // @ts-ignore
        $elements.clear();

        const defaultLoading = new DefaultLoading();
        defaultLoading.end();

        const element = document
            .getElementById("__next2d__framework_loading");

        expect(element).toBe(null);
    });

    test("end function element test", () =>
    {
        // @ts-ignore
        $elements.clear();

        // @ts-ignore
        $elements.set(
            "__next2d__framework_loading",
            // @ts-ignore
            document.createElement()
        );

        const defaultLoading = new DefaultLoading();
        defaultLoading.end();

        const element = document
            .getElementById("__next2d__framework_loading");

        if (!element) {
            throw new Error("stop test");
        }

        expect(element.getAttribute("style")).toBe("display:none;");
    });
});