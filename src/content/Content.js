import { MovieClip } from "../model/common/MovieClip";

/**
 *
 *
 * @class
 * @memberOf next2d.fw
 * @extends {MovieClip}
 */
export class Content extends MovieClip
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();

        const loaderInfo = next2d.fw.loaderInfo;
        if (loaderInfo.has(this.namespace)) {
            this._$loaderInfo = loaderInfo.get(this.namespace);
            this._$sync();
        }

        // initial processing
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
        return null;
    }

    /**
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}
}