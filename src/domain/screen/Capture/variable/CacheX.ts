/**
 * @type {number}
 * @protected
 */
export let cacheX: number = 0;

/**
 * @description キャッシュXを設定
 *              Set cache X
 *
 * @param  {number} value
 * @return {void}
 * @method
 * @protected
 */
export const setCacheX = (value: number): void =>
{
    cacheX = value;
};
