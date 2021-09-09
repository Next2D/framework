/**
 * @class
 * @extends {next2d.display.MovieClip}
 */
class View extends next2d.display.MovieClip
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();
        this.initialize();
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
     * @return {void}
     * @abstract
     */
    initialize () {}
}