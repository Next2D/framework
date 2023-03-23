import { Model } from "../model/common/Model";

/**
 * ViewModelの親クラス、抽象クラスとして存在しています。
 * It exists as a parent class of ViewModel and as an abstract class.
 *
 * @class
 * @extends {Model}
 */
export class ViewModel extends Model
{
    /**
     * @description rootのSpriteにアタッチされたタイミングでコールされます。
     *              Called at the timing when the root Sprite is attached.
     *
     * @param  {View} view
     * @return {Promise|void}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars,no-empty-function
    bind (view) {}

    /**
     * @description 新しいViewクラスがアタッチされる前にコールされます。
     *              Called before a new View class is attached.
     *
     * @param  {View} view
     * @return {void}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-unused-vars,no-empty-function
    unbind (view) {}

    /**
     * @description bind関数で非同期で処理を開始する共通関数です。
     *              Common function to start processing asynchronously with bind functions.
     *
     * @return {Promise}
     * @method
     * @public
     */
    factory ()
    {
        return new Promise((resolve) =>
        {
            requestAnimationFrame(resolve);
        });
    }
}
