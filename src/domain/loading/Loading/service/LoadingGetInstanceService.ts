import type { ILoading } from "../../../../interface/ILoading";
import { DefaultLoader } from "../../DefaultLoader";
import { $getConfig } from "../../../../application/variable/Config";
import { packages } from "../../../../application/variable/Packages";
import {
    $getInstance,
    $setInstance
} from "../../Loading";

/**
 * @description ローダーのインスタンスを取得または作成
 *              Get or create loader instance
 *
 * @return {ILoading | null}
 * @method
 * @protected
 */
export const execute = (): ILoading | null =>
{
    const config = $getConfig();
    if (!config || !config.loading) {
        return null;
    }

    const name: string | undefined = config.loading.callback;
    if (!name) {
        return null;
    }

    let instance = $getInstance();
    if (!instance) {
        const LoaderClass: any = packages.has(name)
            ? packages.get(name)
            : DefaultLoader;

        instance = new LoaderClass();
        $setInstance(instance);
    }

    return instance;
};
