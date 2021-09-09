/**
 * @class
 */
class ViewModel
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
     * @param  {View} view
     * @return {void}
     * @abstract
     */
    bind (view) {}

    /**
     * @param  {View} view
     * @return {void}
     * @abstract
     */
    unbind (view) {}
}