import type { IRequestType } from "./IRequestType";

/**
 * @description HTTPメソッドの型
 *              HTTP method type
 */
export type IHttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "OPTIONS";

/**
 * @description カスタムリクエストのアクセス方法
 *              Access method for custom request
 */
export type IAccessType = "static" | "instance";

/**
 * @description リクエスト設定のインターフェース
 *              Request configuration interface
 */
export interface IRequest {
    /**
     * @description リクエストタイプ
     *              Request type
     */
    type: IRequestType;

    /**
     * @description リクエストパス
     *              Request path
     */
    path?: string;

    /**
     * @description レスポンスのキャッシュキー名
     *              Cache key name for response
     */
    name?: string;

    /**
     * @description キャッシュの有効/無効
     *              Enable/disable cache
     */
    cache?: boolean;

    /**
     * @description レスポンス取得後のコールバッククラス名
     *              Callback class name after response
     */
    callback?: string | string[];

    /**
     * @description カスタムリクエスト用クラス名
     *              Class name for custom request
     */
    class?: string;

    /**
     * @description カスタムリクエストのアクセス方法 (static/instance)
     *              Access method for custom request
     */
    access?: IAccessType;

    /**
     * @description カスタムリクエストで呼び出すメソッド名
     *              Method name to call for custom request
     */
    method?: IHttpMethod | string;

    /**
     * @description リクエストヘッダー
     *              Request headers
     */
    headers?: HeadersInit;

    /**
     * @description リクエストボディ
     *              Request body
     */
    body?: BodyInit | Record<string, unknown>;
}