/**
 * @type {number}
 * @protected
 */
export let cacheY: number = 0;

/**
 * @description キャッシュYを設定
 *              Set cache Y
 *
 * @param  {number} value
 * @return {void}
 * @method
 * @protected
 */
export const setCacheY = (value: number): void =>
{
    cacheY = value;
};
