/**
 * @class
 */
class ViewModel
{
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
     * @param  {View} view
     * @return {void}
     * @abstract
     */
    added (view) {}

    /**
     * @param  {View} view
     * @return {void}
     * @abstract
     */
    removed (view) {}
}