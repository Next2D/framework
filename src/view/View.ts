import { Sprite } from "@next2d/display";

/**
 * @description Viewの親クラス、抽象クラスとして存在しています。
 *              It exists as a parent class of View and as an abstract class.
 *
 * @class
 * @extends {Sprite}
 */
export class View extends Sprite
{
    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        super();
    }

    /**
     * @description constructorが起動した後にコールされます。
     *              Called after the constructor is invoked.
     *
     * @return {Promise<void>}
     * @method
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    async initialize (): Promise<void> {}

    /**
     * @description Viewが表示された際にコールされます。
     *              Called when the View is displayed.
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    // eslint-disable-next-line no-empty-function
    async onEnter (): Promise<void> {}

    /**
     * @description Viewが非表示になった際にコールされます。
     *              Called when the View is hidden.
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    // eslint-disable-next-line no-empty-function
    async onExit (): Promise<void> {}
}
