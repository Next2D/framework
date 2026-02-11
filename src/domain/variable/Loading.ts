import type { ILoading } from "../../interface/ILoading";

/**
 * @type {ILoading | null}
 * @default null
 * @private
 */
let $instance: ILoading | null = null;

/**
 * @description ローダーのインスタンスを取得
 *              Get loader instance
 *
 * @return {ILoading | null}
 * @method
 * @protected
 */
export const $getInstance = (): ILoading | null =>
{
    return $instance;
};

/**
 * @description ローダーのインスタンスを設定
 *              Set loader instance
 *
 * @param {ILoading | null} instance
 * @return {void}
 * @method
 * @protected
 */
export const $setInstance = (instance: ILoading | null): void =>
{
    $instance = instance;
};
