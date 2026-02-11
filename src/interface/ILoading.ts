/**
 * @description ローディング処理のインターフェース
 *              Interface for loading operations
 *
 * @interface
 */
export interface ILoading {
    /**
     * @description ローディング開始処理
     *              Start loading process
     */
    start: () => Promise<void> | void;

    /**
     * @description ローディング終了処理
     *              End loading process
     */
    end: () => Promise<void> | void;
}