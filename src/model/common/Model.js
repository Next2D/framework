/**
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
     * @return {Application}
     * @readonly
     * @public
     */
    get app ()
    {
        return next2d.fw.application;
    }

    /**
     * @return {Cache}
     * @readonly
     * @public
     */
    get cache ()
    {
        return next2d.fw.cache;
    }

    /**
     * @return {object}
     * @readonly
     * @public
     */
    get config ()
    {
        return next2d.fw.config;
    }

    /**
     * @return {Context}
     * @readonly
     * @public
     */
    get context ()
    {
        return next2d.fw.context;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get packages ()
    {
        return next2d.fw.packages;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get response ()
    {
        return next2d.fw.response;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get variable ()
    {
        return next2d.fw.variable;
    }

    /**
     * @return {Map}
     * @readonly
     * @public
     */
    get query ()
    {
        return next2d.fw.query;
    }
}