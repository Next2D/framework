/**
 * @description ViewModelの親クラス、抽象クラスとして存在しています。
 *              It exists as a parent class of ViewModel and as an abstract class.
 *
 * @class
 * @abstract
 */
export abstract class ViewModel
{
    /**
     * @description constructorが起動した後にコールされます。
     *              Called after the constructor is invoked.
     *
     * @return {Promise<void>}
     * @method
     * @abstract
     */
    abstract initialize (): Promise<void>;
}