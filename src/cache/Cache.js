/**
 * @class
 */
class Cache
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        this._$store = new Map();
    }

    /**
     * @param {*} key
     * @method
     * @public
     */
    get (key)
    {
        return this.has(key) ? this._$store.get(key) : null;
    }

    /**
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
     * @param {*} key
     * @return {boolean}
     * @method
     * @public
     */
    has (key)
    {
        return this._$store.has(key);
    }

    /**
     * @param {*} key
     * @return {void}
     * @method
     * @public
     */
    delete (key)
    {
        this._$store.delete(key);
    }

    /**
     * @return {void}
     * @method
     * @public
     */
    clear ()
    {
        this._$store.clear();
    }
}