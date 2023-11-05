import { execute as toCamelCase } from "../domain/convert/ToCamelCase";
import { packages } from "./variable/Packages";
import type { View } from "../view/View";
import type { ViewModel } from "../view/ViewModel";
import type { Sprite } from "@next2d/display";

/**
 * @description メインコンテキスト、ViewとViewModelのunbind、bindをコントロールします。
 *              Controls unbind and bind of the main context, View and ViewModel.
 *
 * @class
 * @memberof context
 */
export class Context
{
    private _$view: View | null;
    private _$viewModel: ViewModel | null;
    private _$viewName: string;
    private readonly _$root: Sprite;

    /**
     * @param {Sprite} root
     *
     * @constructor
     * @public
     */
    constructor (root: Sprite) {

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
         * @type {Sprite}
         * @private
         */
        this._$root = root;
    }

    /**
     * @description StageクラスにセットされたrootのSpriteを返却します。
     *              Returns the Sprite of the root set in the Stage class.
     *
     * @return {Sprite}
     * @readonly
     * @public
     */
    get root (): Sprite
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
    get view (): View | null
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
    get viewModel (): ViewModel | null
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
    async boot (name: string): Promise<View>
    {
        this._$viewName = toCamelCase(name);

        const viewName: string = `${this._$viewName}View`;
        const viewModelName: string = `${viewName}Model`;

        if (!packages.size
            || !packages.has(viewName)
            || !packages.has(viewModelName)
        ) {
            throw new Error("not found view or viewMode.");
        }

        /**
         * 現在のViewとViewModelを変数にセット
         * Set the current View and ViewModel to variables
         */
        const PrevView: View | null = this._$view;
        const PrevViewModel: ViewModel | null = this._$viewModel;

        /**
         * 遷移先のViewとViewModelを準備
         * Prepare the destination View and ViewModel
         */
        const ViewModelClass: typeof ViewModel = packages.get(viewModelName);
        this._$viewModel = new ViewModelClass();

        const ViewClass: typeof View = packages.get(viewName);
        this._$view = new ViewClass();

        /**
         * ViewModelにViewをbindしてページを生成
         * Bind a View to a ViewModel to generate a page
         */
        await Promise.all([this._$viewModel.bind(this._$view)]);

        /**
         * playerにviewをセットして、前のページで利用していたDisplayObjectを全て削除
         * Set player to view and delete all DisplayObjects used in the previous page.
         */
        this._$root.addChild(this._$view);

        while (this._$root.numChildren > 1) {
            this._$root.removeChild(this._$root.getChildAt(0));
        }

        /**
         * マウス(タップ)イベントを有効化
         * Enable mouse (tap) events
         */
        this._$root.mouseChildren = true;

        /**
         * 前のページのunbind関数を実行
         * Execute unbind function on previous page
         */
        if (PrevViewModel && PrevView) {
            PrevViewModel.unbind(PrevView);
        }

        return this._$view;
    }
}