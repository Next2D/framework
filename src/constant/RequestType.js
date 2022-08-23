/**
 * リクエストタイプの定数
 * Request Type Constants
 *
 * @class
 */
export class RequestType
{
    /**
     * @description リクエストの集合体
     *              Aggregation of requests.
     *
     * @return  {string}
     * @default "cluster"
     * @const
     * @static
     */
    static get CLUSTER ()
    {
        return "cluster";
    }

    /**
     * @description NoCode Toolで書き出したJSONコンテンツ
     *              JSON content exported by NoCode Tool.
     *
     * @return  {string}
     * @default "content"
     * @const
     * @static
     */
    static get CONTENT ()
    {
        return "content";
    }

    /**
     * @description カスタムリクエストタイプ
     *              custom request type.
     *
     * @return  {string}
     * @default "custom"
     * @const
     * @static
     */
    static get CUSTOM ()
    {
        return "custom";
    }

    /**
     * @description 画像データを指定
     *              Specify image data.
     *
     * @return  {string}
     * @default "image"
     * @const
     * @static
     */
    static get IMAGE ()
    {
        return "image";
    }

    /**
     * @description JSONのフォーマットを指定
     *              Specify JSON format.
     *
     * @return  {string}
     * @default "json"
     * @const
     * @static
     */
    static get JSON ()
    {
        return "json";
    }
}
