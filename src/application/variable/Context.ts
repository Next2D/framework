import type { Context } from "../Context";

/**
 * @type {Context | null}
 * @private
 */
let $context: Context | null = null;

/**
 * @description コンテキストを取得します
 *              Get the context
 *
 * @return {Context}
 * @throws {Error} コンテキストが初期化されていない場合
 * @method
 * @protected
 */
export const $getContext = (): Context =>
{
    if (!$context) {
        throw new Error("Context is not initialized. Call run() first.");
    }
    return $context;
};

/**
 * @description コンテキストを設定します
 *              Set the context
 *
 * @param {Context} context
 * @method
 * @protected
 */
export const $setContext = (context: Context): void =>
{
    $context = context;
};