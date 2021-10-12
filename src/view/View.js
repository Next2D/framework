import { MovieClip } from "../model/common/MovieClip";

/**
 * @class
 * @memberOf next2d.fw
 * @extends {MovieClip}
 */
export class View extends MovieClip
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