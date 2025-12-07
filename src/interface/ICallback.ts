/**
 * @description Callbackクラスが実装すべきインターフェース
 *              Interface that Callback classes should implement
 *
 * @interface
 */
export interface ICallback<T = unknown, R = void> {
    /**
     * @description コールバック処理を実行
     *              Execute callback process
     *
     * @param  {T} value
     * @return {Promise<R> | R}
     * @method
     */
    execute(value: T): Promise<R> | R;
}
