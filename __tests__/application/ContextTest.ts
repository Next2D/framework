import { Context } from "../../src/application/Context";
import { View } from "../../src/view/View";

describe("ContextTest", () =>
{
    test("initialize test", () =>
    {
        // mock
        const packages: Map<string, any> = new Map();
        packages.clear();

        // @ts-ignore
        next2d.fw.packages = packages;

        const context = new Context();
        context
            .addChild("test")
            .then((result) =>
            {
                expect(result).toBe(undefined);
                expect(context.viewName).toBe("Test");
                expect(typeof context.root).toBe("object");
                expect(context.view).toBe(null);
                expect(context.viewModel).toBe(null);
            });
    });

    test("initialize not view test", () =>
    {
        // mock
        const packages: Map<string, any> = new Map();
        packages.clear();

        // @ts-ignore
        next2d.fw.packages = packages;

        const context = new Context();
        context
            .addChild("abc")
            .then((result) =>
            {
                expect(result).toBe(undefined);
                expect(context.view).toBe(null);
                expect(context.viewModel).toBe(null);
            });
    });

    test("initialize test case1", () =>
    {
        // mock
        const packages: Map<string, any> = new Map();

        const view_initialize: string = "view_initialize";

        // @ts-ignore
        packages.set("XyzView", class XyzView extends View
        {
            // eslint-disable-next-line no-unreachable
            private event: Map<string, any>;

            constructor ()
            {
                super();
                this.event = new Map();
            }

            initialize ()
            {
                expect(view_initialize).toBe("view_initialize");
            }

            addEventListener (type: string, callback: any): void
            {
                this.event.set(type, callback);
                callback({
                    "target": "view_model_unbind"
                });
            }
        });

        const view_model_bind: string = "view_model_bind";
        packages.set("XyzViewModel", class XyzViewModel
        {
            bind (): Promise<void>
            {
                expect(view_model_bind).toBe("view_model_bind");
                return Promise.resolve();
            }

            unbind (view: any)
            {
                expect(view).toBe("view_model_unbind");
            }
        });

        // @ts-ignore
        next2d.fw.packages = packages;

        const context = new Context();
        context
            .addChild("xyz")
            .then((result) =>
            {
                expect(result instanceof View).toBe(true);
            });
    });
});