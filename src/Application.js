import { Common } from "./model/common/Common";
import { Context } from "./Context";
import { Cache } from "./cache/Cache";
import { Variable } from "./model/common/Variable";
import { Query } from "./model/common/Query";
import { Config } from "./Config";

/**
 * @class
 * @memberOf next2d.fw
 * @extends  {Common}
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

        /**
         * @type {Query}
         * @static
         */
        next2d.fw.query = new Query();

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
        const root = this.context.root;
        if (this.config.loading && root.numChildren) {
            this._$createSnapshot();
            this._$startLoading();
        }

        if (this.query.length) {
            this.query.clear();
        }

        if (!name) {
            name = location.pathname.slice(1) || "top";
        }

        if (location.search) {
            const parameters = location.search.slice(1).split("&");
            for (let idx = 0; idx < parameters.length; ++idx) {
                const pair = parameters[idx].split("=");
                this.query.set(pair[0], pair[1]);
            }
        }

        Promise
            .all(this._$requests(name))
            .then((responses) => { this.context.addChild(name, responses) });

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
        const root   = this.context.root;
        const player = root.stage._$player;

        const elementId = `${Config.$PREFIX}_loading`;

        const element = document.getElementById(elementId);
        if (!element) {

            const parent = document.getElementById(player.contentElementId);

            const loader = document.createElement("div");

            loader.id = elementId;

            loader.innerHTML = `<div></div><div></div><div></div><style>
@keyframes __next2d__framework_loading {
  0% {
    transform: scale(1);
    opacity: 1; 
  }
  45% {
    transform: scale(0.1);
    opacity: 0.7; 
  }
  80% {
    transform: scale(1);
    opacity: 1; 
  } 
}
    
#__next2d__framework_loading > div:nth-child(1) {
  animation: __next2d__framework_loading 0.75s -0.24s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#__next2d__framework_loading > div:nth-child(2) {
  animation: __next2d__framework_loading 0.75s -0.12s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#__next2d__framework_loading > div:nth-child(3) {
  animation: __next2d__framework_loading 0.75s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08); 
}

#__next2d__framework_loading {
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -24px 0 0 -24px;
  width: 57px;
  height: 19px;
  z-index: 9999;
  opacity: 0.5;
  pointer-events: none;
}

#__next2d__framework_loading > div {
  background-color: #fff;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 2px;
  animation-fill-mode: both;
  display: inline-block; 
}
</style>`;

            parent.insertBefore(loader, parent.children[0]);

        } else {

            element.style.display = "";

        }

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

            if (object.cache && object.name && this.cache.has(object.name)) {
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

                if (object.cache && object.name) {
                    next2d.fw.cache.set(object.name, data);
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

                    if (this.object.cache && this.object.name) {
                        next2d.fw.cache.set(this.object.name, content);
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