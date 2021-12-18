import { Model } from "../model/common/Model";

/**
 * @class
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
     * rootのSpriteにアタッチされたタイミングでコールされます。
     * Called at the timing when the root Sprite is attached.
     * @param  {View} view
     * @return {Promise|void}
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars,no-empty-function
    bind (view) {}

    /**
     * 新しいViewクラスがアタッチされる前にコールされます。
     * Called before a new View class is attached.
     * @param  {View} view
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars,no-empty-function
    unbind (view) {}
}