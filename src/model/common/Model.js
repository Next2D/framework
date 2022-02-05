/**
 * 各種、getterを実装したクラス
 * Various, classes that implement getter
 *
 * @class
 */
export class Model
{
    /**
     * @param {object} [object=null]
     * @constructor
     * @public
     */
    constructor (object = null)
    {
        if (object) {
            const keys = Object.keys(object);
            for (let idx = 0; idx < keys.length; ++idx) {
                const name = keys[idx];
                this[name] = object[name];
            }
        }
    }

    /**
     * @param  {object} schema
     * @return {string}
     * @public
     */
    toJSON (schema)
    {
        const object = {};

        const keys = Object.keys(schema);
        for (let idx = 0; idx < keys.length; ++idx) {
            const name = keys[idx];
            object[name] = this[name];
        }

        return JSON.stringify(object);
    }

    /**
     * @description 現在起動中のApplicationクラスを返却します。
     *              Returns the Application class that is currently running.
     *
     * @return {Application}
     * @readonly
     * @public
     */
    get app ()
    {
        return next2d.fw.application;
    }

    /**
     * @description 現在起動中のCacheクラスを返却します。
     *              Returns the Cache class that is currently running.
     *
     * @return {Cache}
     * @readonly
     * @public
     */
    get cache ()
    {
        return next2d.fw.cache;
    }

    /**
     * @description jsonの情報をまとめたobjectを返却します。
     *              Returns an object that summarizes the json information.
     *
     * @return {object}
     * @readonly
     * @public
     */
    get config ()
    {
        return next2d.fw.config;
    }

    /**
     * @description メインコンテキストのクラスを返却します。
     *              Returns the class of the main context.
     *
     * @return {Context}
     * @readonly
     * @public
     */
    get context ()
    {
        return next2d.fw.context;
    }

    /**
     * @description 作成したクラスのマッピングオブジェクトを返却します。
     *              Returns the mapping object of the created class.
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get packages ()
    {
        return next2d.fw.packages;
    }

    /**
     * @description routing.jsonで設定したリクエストから戻ってきた情報を格納したオブジェクトを返却します。
     *              Returns an object that contains the information returned from the request set in routing.json.
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get response ()
    {
        return next2d.fw.response;
    }

    /**
     * @description QueryStringのキーと値を格納したオブジェクトを返却します。
     *              Returns an object that contains the keys and values of QueryString.
     *
     * @return {Map}
     * @readonly
     * @public
     */
    get query ()
    {
        return next2d.fw.query;
    }
}