/**
 * @class
 * @extends {CommonMovieClip}
 */
class View extends CommonMovieClip
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
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}
}