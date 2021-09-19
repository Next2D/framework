import { CommonMovieClip } from "../model/common/CommonMovieClip";

/**
 * @class
 * @extends {CommonMovieClip}
 */
export class View extends CommonMovieClip
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