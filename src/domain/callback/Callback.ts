import { ConfigParser } from "@/domain/parser/ConfigParser";

/**
 * @class
 */
export class Callback
{
    /**
     * @param  {string|array} [callback=[]]
     * @param  {*} [value=null]
     * @return {Promise}
     * @method
     * @public
     */
    execute (callback: string | string[] = [], value: any = null): Promise<Awaited<any>[]|void>
    {
        if (!callback) {
            return Promise.resolve();
        }

        const callbacks: string[] = typeof callback === "string"
            ? [callback]
            : callback;

        const promises: Promise<any>[] = [];

        // @ts-ignore
        const packages: Map<string. any> = next2d.fw.packages;

        // @ts-ignore
        const parser: ConfigParser = next2d.fw.parser;
        for (let idx: number = 0; idx < callbacks.length; ++idx) {

            const name: string = parser.execute(callbacks[idx]);
            if (!packages.has(name)) {
                continue;
            }

            const CallbackClass: any = packages.get(name);
            promises.push(new CallbackClass().execute(value));
        }

        return Promise.all(promises);
    }
}