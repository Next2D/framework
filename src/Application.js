import { Model } from "./model/common/Model";
import { Context } from "./Context";
import { Cache } from "./cache/Cache";
import { Variable } from "./model/common/Variable";
import { Query } from "./model/common/Query";

/**
 * @class
 * @memberOf next2d.fw
 * @extends  {Model}
 */
export class Application extends Model
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
            config.stage.width,
            config.stage.height,
            config.stage.fps,
            config.stage.options
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

        /**
         * @type {Query}
         * @static
         */
        next2d.fw.query = new Query();

        if (this.config.spa) {
            window.addEventListener("popstate", () =>
            {
                this._$popstate = true;
                this.gotoView();
            });
        }

        /**
         * @type {boolean}
         * @default false
         * @private
         */
        this._$popstate = false;

        // initial processing
        this.initialize();
    }

    /**
     * @return {void}
     * @abstract
     */
    // eslint-disable-next-line no-empty-function
    initialize () {}

    /**
     * @param  {string} [name=null]
     * @return {void}
     * @method
     * @public
     */
    gotoView (name = null)
    {
        if (this.config.loading) {
            this._$createSnapshot();
            this._$startLoading();
        }

        if (this.query.length) {
            this.query.clear();
        }

        let query = "";
        if (!name && location.search) {
            query = location.search;
            const parameters = query.slice(1).split("&");
            for (let idx = 0; idx < parameters.length; ++idx) {
                const pair = parameters[idx].split("=");
                this.query.set(pair[0], pair[1]);
            }
        }

        if (!name) {
            name = location.pathname.slice(1) || "top";
        }

        if (name.indexOf("?") > -1) {

            const names = name.split("?");

            name  = names[0];
            query = `?${names[1]}`;

            const parameters = names[1].split("&");
            for (let idx = 0; idx < parameters.length; ++idx) {
                const pair = parameters[idx].split("=");
                this.query.set(pair[0], pair[1]);
            }
        }

        if (name.slice(0, 1) === ".") {
            name = name.split("/").slice(1).join("/") || "top";
        }

        if (this.config.spa && !this._$popstate) {
            const url = name === "top"
                ? `${location.origin}${location.search}`
                : `${location.origin}/${name}${query}`;

            history.pushState("", "", url);
        }

        // update
        this._$popstate = false;

        Promise
            .all(this._$requests(name))
            .then((responses) =>
            {
                return this.context.addChild(name, responses);
            })
            .then((view) =>
            {
                if (this.config.gotoView) {
                    this._$callback(this.config.gotoView.callback, view);
                }
            });
    }

    /**
     * @return {void}
     * @private
     */
    _$createSnapshot ()
    {
        const root = this.context.root;

        const ratio = window.devicePixelRatio;

        const { Sprite, Shape, BitmapData } = next2d.display;
        const { Matrix } = next2d.geom;

        const bitmapData = new BitmapData(
            root.stage.stageWidth  * ratio,
            root.stage.stageHeight * ratio,
            true, 0
        );

        bitmapData.draw(root, new Matrix(ratio, 0, 0, ratio, 0, 0));

        // remove all
        while (root.numChildren) {
            root.removeChild(root.getChildAt(0));
        }

        const sprite  = root.addChild(new Sprite());
        sprite.scaleX = 1 / ratio;
        sprite.scaleY = 1 / ratio;

        const snapshot = sprite.addChild(new Shape());
        snapshot
            .graphics
            .beginBitmapFill(bitmapData)
            .drawRect(0, 0, bitmapData.width, bitmapData.height)
            .endFill();

        const width  = this.config.stage.width;
        const height = this.config.stage.height;

        const mask = root.addChild(new Shape());
        mask
            .graphics
            .beginFill(0, 0.8)
            .drawRect(0, 0, width, height)
            .endFill();

        const player = root.stage._$player;
        const matrix = player._$matrix;

        const tx = matrix[4];
        if (tx) {
            const scaleX = matrix[0];
            mask.scaleX = (width + tx * 2 / scaleX) / width;
            mask.x = -tx / scaleX;
        }

        const ty = matrix[5];
        if (ty) {
            const scaleY = matrix[3];
            mask.scaleY = (height + ty * 2 / scaleY) / height;
            mask.y = -ty / scaleY;
        }
    }

    /**
     * @return {void}
     * @private
     */
    _$startLoading ()
    {
        if (!this.config.loading) {
            return ;
        }

        const callback = this.config.loading.callback;
        if (!callback) {
            return ;
        }

        const CallbackClass = this.packages.has(callback)
            ? this.packages.get(callback)
            : next2d.fw.Loading;
        new CallbackClass().start();
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
            if (object.cache && object.name) {

                const name = this._$parseConfig(object.name);
                if (this.cache.has(name)) {

                    const cache = this.cache.get(name);

                    this._$callback(this._$parseConfig(object.callback), cache);

                    promises.push({
                        "name": name,
                        "response": cache
                    });

                    continue;
                }
            }

            switch (this._$parseConfig(object.type)) {

                case "custom":
                    promises.push(this._$loadCustom(object));
                    break;

                case "json":
                    promises.push(this._$loadJSON(object));
                    break;

                default:
                    promises.push(this._$loadContent(object));
                    break;

            }
        }

        return promises;
    }

    /**
     * @param  {object} object
     * @return {Promise}
     * @method
     * @private
     */
    _$loadCustom (object)
    {
        return new Promise((resolve) =>
        {
            const className = this._$parseConfig(object.class);
            if (!this.packages.has(className)) {
                return resolve(null);
            }

            const CallbackClass = this.packages.get(className);
            const promise = this._$parseConfig(object.access) === "static"
                ? Promise.resolve(CallbackClass[this._$parseConfig(object.method)]())
                : Promise.resolve(new CallbackClass()[this._$parseConfig(object.method)]());

            promise
                .then((value) =>
                {
                    this._$callback(this._$parseConfig(object.callback), value);

                    if (object.cache && object.name) {
                        next2d.fw.cache.set(this._$parseConfig(object.name), value);
                    }

                    resolve({
                        "name": this._$parseConfig(object.name),
                        "response": value
                    });
                })
                .catch((error) =>
                {
                    console.error(error);
                });
        });
    }

    /**
     * @param  {object} object
     * @return {Promise}
     * @method
     * @private
     */
    _$loadJSON (object)
    {
        const method = object.method
            ? this._$parseConfig(object.method).toUpperCase()
            : "GET";

        const body   = object.body && (method === "POST" || method === "PUT")
            ? object.body
            : null;

        return fetch(`${this._$parseConfig(object.path)}`, {
            "method": method,
            "headers": object.headers ? object.headers : {},
            "body": body
        })
            .then((response) =>
            {
                return response.json();
            })
            .then((value) =>
            {
                this._$callback(this._$parseConfig(object.callback), value);

                if (object.cache && object.name) {
                    next2d.fw.cache.set(this._$parseConfig(object.name), value);
                }

                return {
                    "name": this._$parseConfig(object.name),
                    "response": value
                };
            })
            .catch((error) =>
            {
                console.error(error);
            });
    }

    /**
     * @param  {object} object
     * @return {Promise}
     * @method
     * @private
     */
    _$loadContent (object)
    {
        return new Promise((resolve, reject) =>
        {
            const { URLRequest, URLRequestHeader, URLRequestMethod } = next2d.net;
            const { Loader } = next2d.display;
            const { Event, IOErrorEvent } = next2d.events;

            const request  = new URLRequest(`${this._$parseConfig(object.path)}`);
            request.method = object.method
                ? this._$parseConfig(object.method).toUpperCase()
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
                .addEventListener(Event.COMPLETE, (event) =>
                {
                    const content    = event.currentTarget.content;
                    const loaderInfo = content._$loaderInfo;

                    // DisplayObjectContainer
                    if (loaderInfo._$data) {
                        const symbols = loaderInfo._$data.symbols;
                        if (symbols.size) {
                            for (const name of symbols.keys()) {
                                next2d.fw.loaderInfo.set(name, loaderInfo);
                            }
                        }
                    }

                    this._$callback(object.callback, content);

                    if (object.cache && object.name) {
                        next2d.fw.cache.set(this._$parseConfig(object.name), content);
                    }

                    resolve({
                        "name": this._$parseConfig(object.name),
                        "response": content
                    });
                });

            loader
                .contentLoaderInfo
                .addEventListener(IOErrorEvent.IO_ERROR, reject);

            if (this._$parseConfig(object.type) === "image") {

                loader.loadImage(request);

            } else {

                loader.load(request);

            }
        });
    }

    /**
     * @param  {string|array} [callback=null]
     * @param  {*} [value=null]
     * @return {void}
     * @private
     */
    _$callback (callback = null, value = null)
    {
        if (!callback) {
            return ;
        }

        const callbacks = typeof callback === "string"
            ? [callback]
            : callback;

        for (let idx = 0; idx < callbacks.length; ++idx) {

            const name = this._$parseConfig(callbacks[idx]);
            if (!this.packages.has(name)) {
                continue;
            }

            const CallbackClass = this.packages.get(name);
            new CallbackClass(value).execute();
        }
    }

    /**
     * @param  {string} [value=null]
     * @return {string}
     * @private
     */
    _$parseConfig (value)
    {
        if (typeof value !== "string" || value.indexOf("{{") === -1) {
            return value;
        }

        const values = value.match(/\{\{(.*?)\}\}/g);
        if (!values) {
            return value;
        }

        let returnValue = value;
        for (let idx = 0; idx < values.length; ++idx) {

            const value = values[idx];

            const names = value
                .replace(/\{|\{|\}|\}/g, "")
                .replace(/ /g, "")
                .split(".");

            let config = this.config;
            for (let idx = 0; idx < names.length; ++idx) {
                const name = names[idx];
                if (name in config) {
                    config = config[name];
                }
            }

            if (!config) {
                continue;
            }

            returnValue = returnValue.replace(value, config);
        }

        return returnValue;
    }
}