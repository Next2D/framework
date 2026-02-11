import type { ICallback } from "../../interface/ICallback";
import type { Constructor } from "../../interface/IPackages";
import { packages } from "../variable/Packages";

/**
 * @description configで指定されたクラスのexecute関数を実行するユースケース
 *              UseCase to execute the function of the class specified in config.
 *
 * @param  {string | string[]} [callback=""]
 * @param  {unknown} [value=null]
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = async (
    callback: string | string[] = "",
    value: unknown = null
): Promise<void> => {

    if (!callback) {
        return;
    }

    const callbacks: string[] = typeof callback === "string"
        ? [callback]
        : callback;

    for (let idx = 0; idx < callbacks.length; ++idx) {

        const name = callbacks[idx];
        if (!packages.has(name)) {
            continue;
        }

        const CallbackClass = packages.get(name) as Constructor<ICallback>;
        await new CallbackClass().execute(value);
    }
};
