import { Model } from "../model/common/Model";

/**
 * @class
 * @memberOf next2d.fw
 * @extends {Model}
 */
export class ViewModel extends Model
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();
    }

    /**
     * @param  {View} view
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars,no-empty-function
    bind (view) {}

    /**
     * @param  {View} view
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars,no-empty-function
    unbind (view) {}
}