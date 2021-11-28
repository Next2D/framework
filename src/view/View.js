import { MovieClip } from "../model/common/MovieClip";

/**
 * @class
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
     * constructorが起動した後にコールされます。
     * Called after the constructor is invoked.
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}
}