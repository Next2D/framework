import { Sprite } from "@next2d/display";
import type { ViewModel } from "./ViewModel";

/**
 * @description Viewの親クラス、抽象クラスとして存在しています。
 *              It exists as a parent class of View and as an abstract class.
 *
 * @class
 * @extends {Sprite}
 * @abstract
 */
export abstract class View<VM extends ViewModel = ViewModel> extends Sprite
{
    /**
     * @description ViewModelへの参照
     *              Reference to ViewModel
     *
     * @type {VM}
     * @protected
     */
    protected readonly vm: VM;

    /**
     * @constructor
     * @public
     */
    constructor (vm: VM)
    {
        super();
        this.vm = vm;
    }

    /**
     * @description constructorが起動した後にコールされます。
     *              Called after the constructor is invoked.
     *
     * @return {Promise<void>}
     * @method
     * @abstract
     */
    abstract initialize (): Promise<void>;

    /**
     * @description Viewが表示された際にコールされます。
     *              Called when the View is displayed.
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    abstract onEnter (): Promise<void>;

    /**
     * @description Viewが非表示になった際にコールされます。
     *              Called when the View is hidden.
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    abstract onExit (): Promise<void>;
}
