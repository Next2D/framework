import { Common } from "./model/common/Common";
import { Context } from "./Context";
import { Cache } from "./cache/Cache";
import { Variable } from "./model/common/Variable";

/**
 * @class
 * @extends {Common}
 */
export class Application extends Common
{
    /**
     * @param {object} config
     * @param {array} packages
     * @constructor
     * @public
     */
    constructor (config, packages)
    {
        super ();

        /**
         * @type {object}
         * @static
         */
        next2d.fw.config = config;

        /**
         * @type {Map}
         * @static
         */
        next2d.fw.packages = new Map(packages);

        /**
         * @type {Application}
         * @static
         */
        next2d.fw.application = this;

        /**
         * @type {Context}
         * @static
         */
        next2d.fw.context = new Context(
            this.config.stage.width,
            this.config.stage.height,
            this.config.stage.fps,
            this.config.stage.options
        );

        /**
         * @type {Cache}
         * @static
         */
        next2d.fw.cache = new Cache();

        /**
         * @type {Variable}
         * @static
         */
        next2d.fw.variable = new Variable();
    }

    /**
     * @param  {string} [name="top"]
     * @return {void}
     * @method
     * @public
     */
    gotoView (name = "top")
    {
        Promise
            .all(this._$requests(name))
            .then((responses) => { this.context.addChild(name, responses) });
    }

    /**
     * @param  {string} name
     * @return {array}
     * @method
     * @private
     */
    _$requests (name)
    {
        const routing = this.config.routing[name];
        if (!routing || !routing.requests || !routing.requests.length) {
            return [];
        }

        const promises = [];
        for (let idx = 0; idx < routing.requests.length; ++idx) {

            const object = routing.requests[idx];

            if (object.cache && this.cache.has(object.name)) {
                promises.push({
                    "name": object.name,
                    "response": this.cache.get(object.name)
                });
                continue;
            }

            promises.push(object.type === "json"
                ? this._$loadJSON(object, idx)
                : this._$loadContent(object, idx)
            );
        }

        return promises;
    }

    /**
     * @param  {object} object
     * @param  {number} index
     * @return {Promise}
     * @method
     * @private
     */
    _$loadJSON (object, index)
    {
        const method = object.method ? object.method.toUpperCase() : "GET";
        const body   = object.body && (method === "POST" || method === "PUT")
            ? object.body
            : null;

        return fetch(`${this.config.endPoint}${object.path}`, {
            "method": method,
            "headers": object.headers ? object.headers : {},
            "body": body
        })
            .then((response) => { return response.json() })
            .then((data) =>
            {
                if (object.callback && this.packages.has(object.callback)) {
                    const CallbackClass = this.packages.get(object.callback);
                    new CallbackClass(data, index).execute();
                }

                return {
                    "name": object.name,
                    "response": data
                };
            });
    }

    /**
     * @param  {object} object
     * @param  {number} index
     * @return {Promise}
     * @method
     * @private
     */
    _$loadContent (object, index)
    {
        return new Promise((resolve, reject) =>
        {
            const { URLRequest, URLRequestHeader, URLRequestMethod } = next2d.net;
            const { Loader } = next2d.display;
            const { Event, IOErrorEvent } = next2d.events;

            const request  = new URLRequest(`${this.config.endPoint}${object.path}`);
            request.method = object.method
                ? object.method.toUpperCase()
                : URLRequestMethod.GET;

            if (object.headers) {
                for (const [name, value] of Object.entries(object.headers)) {
                    request.requestHeaders.push(new URLRequestHeader(name, value));
                }
            }

            if (object.body) {
                request.data = JSON.stringify(object.body);
            }

            const loader = new Loader();
            loader
                .contentLoaderInfo
                .addEventListener(Event.COMPLETE, function (event)
                {
                    const content = event.currentTarget.content;

                    const loaderInfo = content._$loaderInfo;
                    const symbols    = loaderInfo._$data.symbols;
                    if (symbols.size) {
                        for (const name of symbols.keys()) {
                            next2d.fw.loaderInfo.set(
                                name.split(".").pop(), loaderInfo
                            );
                        }
                    }

                    if (this.object.callback && this.packages.has(object.callback)) {
                        const CallbackClass = this.packages.get(object.callback);
                        new CallbackClass(content, index).execute();
                    }

                    this.resolve({
                        "name": this.object.name,
                        "response": content
                    });

                }.bind({
                    "object": object,
                    "index": index,
                    "packages": this.packages,
                    "resolve": resolve
                }));

            loader
                .contentLoaderInfo
                .addEventListener(IOErrorEvent.IO_ERROR, function ()
                {
                    this.reject();
                }.bind({ "reject": reject }));

            loader.load(request);
        });
    }

}