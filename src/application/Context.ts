import { ToCamelCase } from "@/domain/convert/ToCamelCase";
import { View } from "@/view/View";
import { ViewModel } from "@/view/ViewModel";

/**
 * メインコンテキスト、ViewとViewModelのunbind、bindをコントロールします。
 * Controls unbind and bind of the main context, View and ViewModel.
 * @class
 */
export class Context
{
    private _$view: View|null;
    private _$viewModel: ViewModel|null;
    private _$viewName: string;
    private readonly _$root: any;
    private readonly _$toCamelCase: ToCamelCase;

    /**
     * @param {number} [width=240]
     * @param {number} [height=240]
     * @param {number} [fps=30]
     * @param {object} [options=null]
     *
     * @constructor
     * @public
     */
    constructor (width: number = 240, height: number = 240, fps: number = 30, options: any = null)
    {
        /**
         * @type {View}
         * @default null
         * @private
         */
        this._$view = null;

        /**
         * @type {ViewModel}
         * @default null
         * @private
         */
        this._$viewModel = null;

        /**
         * @type {string}
         * @default "Top"
         * @private
         */
        this._$viewName = "Top";

        /**
         * @type {next2d.display.Sprite}
         * @private
         */
        // @ts-ignore
        this._$root = next2d.createRootMovieClip(
            width, height, fps, options
        );

        /**
         * @type {ToCamelCase}
         * @private
         */
        this._$toCamelCase = new ToCamelCase();
    }

    /**
     * @description StageクラスにセットされたrootのSpriteを返却します。
     *              Returns the Sprite of the root set in the Stage class.
     *
     * @return {next2d.display.Sprite}
     * @readonly
     * @public
     */
    get root (): any
    {
        return this._$root;
    }

    /**
     * @description 現在のシーンで利用中のViewクラスを返却します。
     *              Returns the View class that is being used in the current scene.
     *
     * @return {View}
     * @default null
     * @readonly
     * @public
     */
    get view (): View|null
    {
        return this._$view;
    }

    /**
     * @description 現在のシーンで利用中のViewModelクラスを返却します。
     *              Returns the ViewModel class that is being used in the current scene.
     *
     * @return {ViewModel}
     * @default null
     * @readonly
     * @public
     */
    get viewModel (): ViewModel|null
    {
        return this._$viewModel;
    }

    /**
     * @description 現在のシーンで利用中のViewクラス名を返却します。
     *              Returns the name of the View class currently being used in the current scene.
     *
     * @return {string}
     * @default "Top"
     * @readonly
     * @public
     */
    get viewName (): string
    {
        return this._$viewName;
    }

    /**
     * @description ViewクラスをrootのSpriteにアタッチします。
     *              Attach the View class to the root Sprite.
     *
     * @param  {string} name
     * @return {Promise<View|void>}
     * @method
     * @public
     */
    addChild (name: string): Promise<View|void>
    {
        // @ts-ignore
        const { Event } = next2d.events;

        this._$viewName = this._$toCamelCase.execute(name);

        const viewName: string      = `${this._$viewName}View`;
        const viewModelName: string = `${viewName}Model`;

        // @ts-ignore
        const packages: Map<string, any> = next2d.fw.packages;
        if (!packages.has(viewName)
            || !packages.has(viewModelName)
        ) {
            return Promise.resolve();
        }

        const ViewModelClass: any = packages.get(viewModelName);
        this._$viewModel = new ViewModelClass();

        const ViewClass: any = packages.get(viewName);
        this._$view = new ViewClass();

        // @ts-ignore
        this._$view.addEventListener(Event.REMOVED, (event: any) =>
        {
            if (this._$viewModel) {
                this._$viewModel.unbind(event.target);
            }
        });

        return Promise
            // @ts-ignore
            .all([this._$viewModel.bind(this._$view)])
            .then(() =>
            {
                const root: any = this._$root;
                while (root.numChildren > 0) {
                    root.removeChild(root.getChildAt(0));
                }

                // @ts-ignore
                return root.addChild(this._$view);
            });
    }
}