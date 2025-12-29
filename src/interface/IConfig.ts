import type { IStage } from "./IStage";
import type { IRouting } from "./IRouting";
import type { IGotoView } from "./IGotoView";

interface IBaseConfig {
    [key: string]: any
}

/**
 * @description アプリケーション設定のインターフェース
 *              Application configuration interface
 *
 * @interface
 */
export interface IConfig extends IBaseConfig {
    /**
     * @description プラットフォーム識別子
     *              Platform identifier
     */
    platform: string;

    /**
     * @description ステージ設定
     *              Stage configuration
     */
    stage: IStage;

    /**
     * @description SPAモードの有効/無効
     *              Enable/disable SPA mode
     */
    spa: boolean;

    /**
     * @description デフォルトのトップページ
     *              Default top page
     */
    defaultTop?: string;

    /**
     * @description 画面遷移時のコールバック設定
     *              Callback configuration for view transitions
     */
    gotoView?: IGotoView;

    /**
     * @description ルーティング設定
     *              Routing configuration
     */
    routing?: Record<string, IRouting>;

    /**
     * @description ローディング設定
     *              Loading configuration
     */
    loading?: {
        callback: string;
    };
}