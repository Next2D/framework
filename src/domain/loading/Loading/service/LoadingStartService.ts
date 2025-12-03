import { execute as loadingGetInstanceService } from "./LoadingGetInstanceService";

/**
 * @description ローダーのアニメーションを実行
 *              Execute loader animation
 *
 * @return {Promise<void>}
 * @method
 * @protected
 */
export const execute = async (): Promise<void> =>
{
    const instance = loadingGetInstanceService();
    if (!instance) {
        return ;
    }

    await instance.start();
};