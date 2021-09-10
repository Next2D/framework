/**
 * @class
 * @extends {next2d.display.MovieClip}
 */
class Content extends next2d.display.MovieClip
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
     * @return {Application}
     * @readonly
     * @public
     */
    get app ()
    {
        return next2d.fw.application;
    }

    /**
     * @return {object}
     * @readonly
     * @public
     */
    get config ()
    {
        return next2d.fw.config;
    }

    /**
     * @return {Context}
     * @readonly
     * @public
     */
    get context ()
    {
        return next2d.fw.context;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get response ()
    {
        return next2d.fw.response;
    }

    /**
     * @return {Cache}
     * @readonly
     * @public
     */
    get cache ()
    {
        return next2d.fw.cache;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get packages ()
    {
        return next2d.fw.packages;
    }

    /**
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}
}