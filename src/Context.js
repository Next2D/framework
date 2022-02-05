/**
 * メインコンテキスト、ViewとViewModelのunbind、bindをコントロールします。
 * Controls unbind and bind of the main context, View and ViewModel.
 * @class
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
         * @type {next2d.fw.View}
         * @default null
         * @private
         */
        this._$view = null;

        /**
         * @type {next2d.fw.ViewModel}
         * @default null
         * @private
         */
        this._$viewModel = null;

        /**
         * @type {string}
         * @default "top"
         * @private
         */
        this._$viewName = "Top";

        /**
         * @type {next2d.display.Sprite}
         * @private
         */
        this._$root = next2d.createRootMovieClip(
            width, height, fps, options
        );

        const { Event } = next2d.events;

        const stage = this._$root.stage;
        stage.addEventListener(Event.REMOVED, (event) =>
        {
            const view = event.target;

            if (view instanceof next2d.fw.View) {

                if (this._$viewModel) {
                    this._$viewModel.unbind(view);
                    this._$viewModel = null;
                }

                const name = this.viewName;

                const contentName = `${name}Content`;
                if (!next2d.fw.packages.has(contentName)) {
                    return ;
                }

                const routing = next2d.fw.config.routing[
                    name
                        .replace(/[A-Z]/g, (s) =>
                        {
                            return `/${s.charAt(0).toLowerCase()}`;
                        })
                        .slice(1)
                ];
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
        }, true);
    }

    /**
     * @description StageクラスにセットされたrootのSpriteを返却します。
     *              Returns the Sprite of the root set in the Stage class.
     *
     * @return {next2d.display.Sprite}
     * @readonly
     * @public
     */
    get root ()
    {
        return this._$root;
    }

    /**
     * @description 現在のシーンで利用中のViewクラスを返却します。
     *              Returns the View class that is being used in the current scene.
     *
     * @return {next2d.fw.View}
     * @default null
     * @readonly
     * @public
     */
    get view ()
    {
        return this._$view;
    }

    /**
     * @description 現在のシーンで利用中のViewModelクラスを返却します。
     *              Returns the ViewModel class that is being used in the current scene.
     *
     * @return {next2d.fw.ViewModel}
     * @default null
     * @readonly
     * @public
     */
    get viewModel ()
    {
        return this._$viewModel;
    }

    /**
     * @description 現在のシーンで利用中のViewクラス名を返却します。
     *              Returns the name of the View class currently being used in the current scene.
     *
     * @return {string}
     * @default "top"
     * @readonly
     * @public
     */
    get viewName ()
    {
        return this._$viewName;
    }

    /**
     * @description ViewクラスをrootのSpriteにアタッチします。
     *              Attach the View class to the root Sprite.
     *
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
        this._$viewName = viewName;
        viewName += "View";

        const viewModelName = `${viewName}Model`;

        if (!next2d.fw.packages.has(viewName)
            || !next2d.fw.packages.has(viewModelName)
        ) {
            return null;
        }

        if (next2d.fw.response.size) {
            next2d.fw.response.clear();
        }

        if (responses.length) {
            for (let idx = 0; idx < responses.length; ++idx) {

                const object = responses[idx];
                if (!object || !object.name) {
                    continue;
                }

                next2d.fw.response.set(object.name, object.response);
            }
        }

        const ViewClass = next2d.fw.packages.get(viewName);
        this._$view = new ViewClass();

        const ViewModelClass = next2d.fw.packages.get(viewModelName);
        this._$viewModel = new ViewModelClass();

        return Promise
            .resolve(this._$viewModel.bind(this._$view))
            .then(() =>
            {
                if (next2d.fw.config.loading) {
                    this._$endLoading();
                }

                while (this._$root.numChildren) {
                    this._$root.removeChild(this._$root.getChildAt(0));
                }

                return this._$root.addChild(this._$view);
            })
            .catch((error) =>
            {
                console.error(error);
            });
    }

    /**
     * @return {void}
     * @private
     */
    _$endLoading ()
    {
        const config = next2d.fw.config;
        if (!config.loading) {
            return ;
        }

        const callback = config.loading.callback;
        if (!callback) {
            return ;
        }

        const packages = next2d.fw.packages;

        const CallbackClass = packages.has(callback)
            ? packages.get(callback)
            : next2d.fw.Loading;
        new CallbackClass().end();
    }
}