/**
 * @class
 */
class Framework
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        this._$handler = this.contentLoaded.bind(this);
        window.addEventListener("DOMContentLoaded", this._$handler);
    }

    /**
     * @return {void}
     * @public
     */
    contentLoaded ()
    {
        window.removeEventListener("DOMContentLoaded", this._$handler);
        this._$handler = null;
        this.wait();
    }

    /**
     * @return {void}
     */
    wait ()
    {
        if ("next2d" in window) {
            return this.initialize();
        }
        setTimeout(this.wait.bind(this), 300);
    }

    /**
     * @return {void}
     * @public
     */
    initialize ()
    {
        const root = next2d.createRootMovieClip(
            Config.STAGE_WIDTH,
            Config.STAGE_HEIGHT,
            Config.STAGE_FPS,
            Config.STAGE_OPTIONS
        );

        const {Loader} = next2d.display;
        const {URLRequest} = next2d.net;


    }
}

window.n2d = {
    "fw": new Framework()
}