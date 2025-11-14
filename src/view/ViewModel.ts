/**
 * @description ViewModelの親クラス、抽象クラスとして存在しています。
 *              It exists as a parent class of ViewModel and as an abstract class.
 *
 * @class
 */
export class ViewModel
{
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
}