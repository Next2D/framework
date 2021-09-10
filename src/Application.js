/**
 * @class
 */
class Application
{
    /**
     * @param {object} [config=null]
     * @constructor
     * @public
     */
    constructor (config = null)
    {
        if (config) {
            next2d.fw.config = config;
        }

        /**
         * @type {Application}
         * @private
         */
        next2d.fw.application = this;

        /**
         * @type {Context}
         * @private
         */
        next2d.fw.context = new Context(
            this.config.stage.width,
            this.config.stage.height,
            this.config.stage.fps,
            this.config.stage.options
        );

        /**
         * @type {Cache}
         * @private
         */
        next2d.fw.cache = new Cache();
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
     * @return {Map}
     * @readonly
     * @public
     */
    get response ()
    {
        return next2d.fw.response;
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
     * @return {Cache}
     * @readonly
     * @public
     */
    get cache ()
    {
        return next2d.fw.cache;
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
                promises.push([object.name, this.cache.get(object.name)]);
                continue;
            }

            promises.push(object.type === "json"
                ? this._$loadJSON(object)
                : this._$loadContent(object)
            );
        }

        return promises;
    }

    /**
     * @param  {object} object
     * @return {Promise}
     * @method
     * @private
     */
    _$loadJSON (object)
    {
        return fetch(`${this.config.endPoint}${object.path}`, {
            "method": object.method
                ? object.method.toUpperCase()
                : "GET"
        })
            .then((response) => { return response.json() })
            .then((data) => { return [object.name, data] });
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
            const { URLRequest, URLRequestMethod } = next2d.net;
            const { Loader } = next2d.display;
            const { Event, IOErrorEvent } = next2d.events;

            const request  = new URLRequest(`${this.config.endPoint}${object.path}`);
            request.method = object.method
                ? object.method.toUpperCase()
                : URLRequestMethod.GET;

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

                    this.resolve([this.object.name, content]);

                }.bind({ "object": object, "resolve": resolve }));

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