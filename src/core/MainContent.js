/**
 * @class
 * @extends {next2d.display.MovieClip}
 */
class MainContent extends next2d.display.MovieClip
{
    /**
     * @constructor
     * @public
     */
    constructor()
    {
        super();

        this._$handler = this._$initialize.bind(this);

        const {Event} = next2d.events;
        this.addEventListener(Event.ADDED_TO_STAGE, this._$handler);
    }

    /**
     * @param  {next2d.events.Event} event
     *
     * @return {void}
     * @private
     */
    _$initialize (event)
    {
        const {Event} = next2d.event;
        this.removeEventListener(Event.ADDED_TO_STAGE, this._$handler);

        this._$handler = null;

        this.beforeInitialize();
        this.addChild(event.currentTarget.content);
        this.afterInitialize();
    }

    /**
     * @return {void}
     * @abstract
     */
    beforeInitialize () {}

    /**
     * @return {void}
     * @abstract
     */
    afterInitialize () {}
}