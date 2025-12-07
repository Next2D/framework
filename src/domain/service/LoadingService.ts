import type { ILoading } from "../../interface/ILoading";
import type { Constructor } from "../../interface/IPackages";
import { DefaultLoader } from "../entity/DefaultLoader";
import { $getConfig } from "../../application/variable/Config";
import { packages } from "../../application/variable/Packages";
import {
    $getInstance,
    $setInstance
} from "../variable/Loading";

/**
 * @description ローディング処理を管理するドメインサービス
 *              Domain service for managing loading operations
 */
export const LoadingService = {

    /**
     * @description ローダーのインスタンスを取得または作成
     *              Get or create loader instance
     *
     * @return {ILoading | null}
     */
    "getInstance": (): ILoading | null =>
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
            const LoaderClass = packages.has(name)
                ? packages.get(name) as Constructor<ILoading>
                : DefaultLoader;

            instance = new LoaderClass();
            $setInstance(instance);
        }

        return instance;
    },

    /**
     * @description ローダーのアニメーションを開始
     *              Start loader animation
     *
     * @return {Promise<void>}
     */
    "start": async (): Promise<void> =>
    {
        const instance = LoadingService.getInstance();
        if (!instance) {
            return;
        }

        await instance.start();
    },

    /**
     * @description ローダーのアニメーションを終了
     *              End loader animation
     *
     * @return {Promise<void>}
     */
    "end": async (): Promise<void> =>
    {
        const instance = LoadingService.getInstance();
        if (!instance) {
            return;
        }

        await instance.end();
    }
};
