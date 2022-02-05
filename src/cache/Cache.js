/**
 * ルーティングで設定したリクエスト結果(レスポンス)をキャッシュします。
 * Caches the request result (response) set in routing.
 *
 * @class
 */
export class Cache
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this._$store = new Map();
    }

    /**
     * @description 指定したkeyのキャッシュ値を返却します。
     *              Returns the cached value of the specified key.
     *
     * @param {*} key
     * @method
     * @public
     */
    get (key)
    {
        return this.has(key) ? this._$store.get(key) : null;
    }

    /**
     * @description 指定したkeyにvalueをキャッシュします。
     *              Caches the value for the specified key.
     *
     * @param {*} key
     * @param {*} value
     * @method
     * @public
     */
    set (key, value)
    {
        this._$store.set(key, value);
    }

    /**
     * @description 指定したkeyのキャッシュが存在するか確認を行います。
     *              Check if the cache for the specified key exists.
     *
     * @param  {*} key
     * @return {boolean}
     * @method
     * @public
     */
    has (key)
    {
        return this._$store.has(key);
    }

    /**
     * @description 指定したkeyのキャッシュを削除します。
     *              Deletes the cache for the specified key.
     *
     * @param  {*} key
     * @return {void}
     * @method
     * @public
     */
    delete (key)
    {
        this._$store.delete(key);
    }

    /**
     * @description 全てのキャッシュ情報をクリアします。
     *              Clear all cache information.
     *
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        this._$store.clear();
    }

    /**
     * @description キャッシュしたkeyの数を返却します。
     *              Returns the number of cached keys.
     *
     * @return {number}
     * @method
     * @public
     */
    get length ()
    {
        return this._$store.size;
    }
}