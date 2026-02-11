import { $getContext } from "../../application/variable/Context";
import { stage, Shape } from "@next2d/display";

/**
 * @type {Shape}
 * @private
 */
const shape: Shape = new Shape();
shape.isBitmap = true;
shape.$bitmapBuffer = new Uint8Array([0, 0, 0, 128]);
shape.graphics.xMin = 0;
shape.graphics.yMin = 0;
shape.graphics.xMax = 1;
shape.graphics.yMax = 1;

/**
 * @type {number}
 * @private
 */
let cacheX: number = -1;

/**
 * @type {number}
 * @private
 */
let cacheY: number = -1;

/**
 * @description スクリーンの最前面に半透明の黒を重ねる
 *              Overlay a semi-transparent black at the forefront of the screen
 */
export const ScreenOverlayService =
{
    /**
     * @description 画面キャプチャーのShapeをStageに追加
     *              Add Screen Capture Shape to Stage
     *
     * @return {Promise<void>}
     */
    "add": async (): Promise<void> =>
    {
        const root = $getContext().root;
        if (!root) {
            return;
        }

        /**
         * マウス操作を強制停止
         * Mouse operation is forced to stop
         */
        root.mouseChildren = false;
        root.mouseEnabled  = false;

        const scale  = stage.rendererScale;
        const tx = (stage.rendererWidth  - stage.stageWidth  * scale) / 2;
        const ty = (stage.rendererHeight - stage.stageHeight * scale) / 2;

        if (cacheX !== tx) {
            cacheX = tx;
            shape.width = stage.rendererWidth / scale;
            shape.x = -tx / scale;
        }

        if (cacheY !== ty) {
            cacheY = ty;
            shape.height = stage.rendererHeight / scale;
            shape.y = -ty / scale;
        }

        root.addChild(shape);
    },

    /**
     * @description 画面キャプチャーのShapeをStageから削除
     *              Delete Screen Capture Shape from Stage
     *
     * @return {void}
     */
    "dispose": (): void =>
    {
        const root = $getContext().root;
        if (!root) {
            return;
        }

        /**
         * rootの子要素を全て削除（末尾から削除することでO(n)に最適化）
         * Remove all child elements of root (optimized to O(n) by removing from end)
         */
        root.removeChild(shape);

        /**
         * マウス操作を有効化
         * Enable Mouse Operation
         */
        root.mouseChildren = true;
        root.mouseEnabled  = true;
    }
};
