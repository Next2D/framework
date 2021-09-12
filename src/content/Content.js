/**
 * @class
 * @extends {CommonMovieClip}
 */
class Content extends CommonMovieClip
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        /**
         * @type {null}
         * @default null
         * @private
         */
        this._$namespace = null;

        const className = this.constructor.name;
        if (next2d.fw.loaderInfo.has(className)) {
            this._$namespace  = `next2d.fw.packages.${className}`;
            this._$loaderInfo = next2d.fw.loaderInfo.get(className);
            this._$sync();
        }

        this.initialize();
    }

    /**
     * @description 指定されたオブジェクトの空間名を返します。
     *              Returns the space name of the specified object.
     *
     * @return  {string}
     * @default null
     * @const
     * @static
     */
    get namespace ()
    {
        return this._$namespace;
    }

    /**
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}
}