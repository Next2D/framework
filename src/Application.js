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
         * @type {Context}
         * @private
         */
        next2d.fw.context = new Context(
            config.stage.width, config.stage.height,
            config.stage.fps, config.stage.options
        );
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
     * @param  {string} [name="top"]
     * @return {void}
     * @method
     * @public
     */
    gotoView (name = "top")
    {
        // reset
        next2d.fw.response = null;

        const request  = this.config.routing[name];
        const endPoint = this.config.endPoint;

        const requests = [];
        for (let idx = 0; idx < request.before.length; ++idx) {

            const object = request.before[idx];

            if (object.type === "json") {

                requests.push(
                    fetch(`${endPoint}${object.path}`, {
                        "method": object.method.toUpperCase()
                    })
                        .then((response) => { return response.json() })
                        .then((data) => { return [object.name, data] })
                );

            } else {

                requests.push(new Promise((resolve, reject) =>
                {
                    const { URLRequest } = next2d.net;
                    const { Loader } = next2d.display;
                    const { Event, IOErrorEvent } = next2d.events;

                    const urlRequest  = new URLRequest(`${endPoint}${object.path}`);
                    urlRequest.method = object.method;

                    const loader = new Loader();
                    loader
                        .contentLoaderInfo
                        .addEventListener(Event.COMPLETE, function (event)
                        {
                            resolve([
                                this.object.name,
                                event.currentTarget.content.getChildAt(0)
                            ]);
                        }.bind({ "object": object }));

                    loader
                        .contentLoaderInfo
                        .addEventListener(IOErrorEvent.IO_ERROR, () =>
                        {
                            reject();
                        });

                    loader.load(urlRequest);
                }));
            }
        }

        Promise
            .all(requests)
            .then((response) =>
            {
                next2d.fw.response = new Map(response);
                this.context.addChild(name);
            })
            .then(() =>
            {
                console.log("after");
            });

    }
}