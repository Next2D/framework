import { Model } from "@/model/common/Model";

/**
 * スクリーンのサイズ変化に合わせて表示をコントロール
 * Controls display as screen size changes.
 *
 * @class
 * @extends {Model}
 */
export class ScreenSheet extends Model
{
    /**
     * @description ページに適用するJSONのパスをセットする
     *
     * @param  {string} path
     * @return {void}
     * @public
     */
    static use (path)
    {
        console.log(path);
    }
}
