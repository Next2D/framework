/**
 * @description 外部データをObjectに変換(DTO)、可変性のない使い捨てのクラス
 *              Converts external data to Objects (DTO), non-variable, disposable class
 *
 * @class
 */
export class ResponseDTO<T = unknown>
{
    /**
     * @description キャッシュのキー名
     *              Key name of cache
     *
     * @return {string}
     * @default ""
     * @readonly
     * @public
     */
    public readonly name: string;

    /**
     * @description レスポンスデータ
     *              response data
     *
     * @return {T}
     * @default null
     * @readonly
     * @public
     */
    public readonly response: T;

    /**
     * @param {string} [name=""]
     * @param {T} [response]
     * @constructor
     * @public
     */
    constructor (name: string = "", response: T = null as T)
    {
        this.name = name;
        this.response = response;
    }
}
