/**
 * @class
 */
class Context
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
        this._$root = next2d.createRootMovieClip(
            width, height, fps, options
        );

        const { Event } = next2d.events;

        const stage = this._$root.stage;

        stage.addEventListener(Event.ADDED, function (event)
        {
            const view = event.target;

            const viewModelName = `${view.constructor.name}Model`;
            if (next2d.fw.packages.has(viewModelName)) {

                const ViewModelClass = next2d.fw.packages.get(viewModelName);
                new ViewModelClass().added(view);

            }

        }.bind(this));

        stage.addEventListener(Event.REMOVED, function (event)
        {
            const view = event.target;

            const viewModelName = `${view.constructor.name}Model`;
            if (next2d.fw.packages.has(viewModelName)) {

                const ViewModelClass = next2d.fw.packages.get(viewModelName);
                new ViewModelClass().removed(view);
            }

        }.bind(this));
    }

    /**
     * @param  {string} name
     * @return {ViewModel}
     * @public
     */
    addChild (name)
    {
        const viewName = name
            .charAt(0)
            .toUpperCase() + name.slice(1) + "View";

        const viewModelName = `${viewName}Model`;

        if (!next2d.fw.packages.has(viewName)
            || !next2d.fw.packages.has(viewModelName)
        ) {
            return ;
        }

        if (this._$root.numChildren) {
            while (this._$root.numChildren) {
                this._$root.removeChild(this._$root.getChildAt(0));
            }
        }

        const ViewClass = next2d.fw.packages.get(viewName);
        const view = new ViewClass();

        this._$root.addChild(view);

    }
}