/**
 * @class
 * @extends {next2d.display.MovieClip}
 */
export class MovieClip extends next2d.display.MovieClip
{
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
     * @return {Cache}
     * @readonly
     * @public
     */
    get cache ()
    {
        return next2d.fw.cache;
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
    get packages ()
    {
        return next2d.fw.packages;
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
     * @return {Map}
     * @readonly
     * @public
     */
    get query ()
    {
        return next2d.fw.query;
    }
}