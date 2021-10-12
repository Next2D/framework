import { Config } from "./Config";

/**
 * @class
 * @memberOf next2d.fw
 */
export class Context
{
    /**
     * @param {number} [width=240]
     * @param {number} [height=240]
     * @param {number} [fps=30]
     * @param {object} [options=null]
     *
     * @constructor
     * @public
     */
    constructor (width = 240, height = 240, fps = 30, options = null)
    {
        /**
         * @type {next2d.display.DisplayObject}
         * @private
         */
        this._$view = null;

        /**
         * @type {next2d.display.Sprite}
         * @private
         */
        this._$root = next2d.createRootMovieClip(
            width, height, fps, options
        );

        const { Event } = next2d.events;

        const stage = this._$root.stage;

        stage.addEventListener(Event.ADDED, (event) =>
        {
            const view = event.target;

            if (view instanceof next2d.fw.View) {

                const viewModelName = `${view.constructor.name}Model`;

                if (next2d.fw.packages.has(viewModelName)) {

                    const ViewModelClass = next2d.fw.packages.get(viewModelName);

                    const viewModel = new ViewModelClass();
                    viewModel.bind(view);

                    next2d.fw.viewModel = viewModel;
                }
            }

        });

        stage.addEventListener(Event.REMOVED, (event) =>
        {
            const view = event.target;

            if (view instanceof next2d.fw.View) {

                if (next2d.fw.viewModel) {
                    next2d.fw.viewModel.unbind(view);
                    next2d.fw.viewModel = null;
                }

                const viewName = view.constructor.name;

                const name = viewName.slice(0, -4).toLowerCase();

                const contentName = `${name.charAt(0).toUpperCase()}${name.slice(1)}Content`;
                if (!next2d.fw.packages.has(contentName)) {
                    return ;
                }

                const routing = next2d.fw.config.routing[name];
                if (!routing || !routing.requests) {
                    return ;
                }

                const loaderInfoMap = next2d.fw.loaderInfo;

                const requests = routing.requests;
                for (let idx = 0; idx < requests.length; ++idx) {

                    const object = requests[idx];
                    if (object.name === contentName) {

                        if (!object.cache && loaderInfoMap.has(contentName)) {

                            const loaderInfo = loaderInfoMap.get(contentName);
                            const symbols    = loaderInfo._$data.symbols;
                            if (symbols.size) {
                                for (const name of symbols.keys()) {
                                    loaderInfoMap.delete(
                                        name.split(".").pop()
                                    );
                                }
                            }

                        }

                        break;
                    }
                }
            }
        });
    }

    /**
     * @return {next2d.display.Sprite}
     * @readonly
     * @public
     */
    get root ()
    {
        return this._$root;
    }

    /**
     * @return {next2d.display.DisplayObject}
     * @readonly
     * @public
     */
    get view ()
    {
        return this._$view;
    }

    /**
     * @param  {string} name
     * @param  {array}  responses
     * @return {ViewModel|null}
     * @public
     */
    addChild (name, responses)
    {
        const names = name.split(/[-_/]/);

        let viewName = "";
        for (let idx = 0; names.length > idx; ++idx) {
            name = names[idx];
            viewName += name
                .charAt(0)
                .toUpperCase() + name.slice(1);
        }
        viewName += "View";

        const viewModelName = `${viewName}Model`;

        if (!next2d.fw.packages.has(viewName)
            || !next2d.fw.packages.has(viewModelName)
        ) {
            return null;
        }

        if (next2d.fw.config.loading) {
            const element = document
                .getElementById(`${Config.$PREFIX}_loading`);

            if (element) {
                element.style.display = "none";
            }
        }

        if (this._$root.numChildren) {
            while (this._$root.numChildren) {
                this._$root.removeChild(this._$root.getChildAt(0));
            }
        }

        if (next2d.fw.response.size) {
            next2d.fw.response.clear();
        }

        if (responses.length) {
            for (let idx = 0; idx < responses.length; ++idx) {

                const object = responses[idx];
                if (!object.name) {
                    continue;
                }

                next2d.fw.response.set(object.name, object.response);
            }
        }

        const ViewClass = next2d.fw.packages.get(viewName);
        this._$view = this._$root.addChild(new ViewClass());

        return this._$view;
    }

}