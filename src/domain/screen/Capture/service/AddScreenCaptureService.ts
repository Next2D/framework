import { $getConfig } from "../../../../application/variable/Config";
import { context } from "../../../../application/variable/Context";
import { Matrix } from "@next2d/geom";
import {
    stage,
    BitmapData
} from "@next2d/display";
import {
    shape,
    bitmap
} from "../../Capture";

/**
 * @type {number}
 * @private
 */
const $devicePixelRatio: number = window.devicePixelRatio;

/**
 * @type {number}
 * @private
 */
let $cacheX: number = 0;

/**
 * @type {number}
 * @private
 */
let $cacheY: number = 0;

/**
 * @description 画面キャプチャーのShapeをStageに追加
 *              Add Screen Capture Shape to Stage
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = async (): Promise<void> =>
{
    const root = context.root;
    if (!root) {
        return ;
    }

    const canvas = await next2d.captureToCanvas(root, {
        "matrix": new Matrix($devicePixelRatio, 0, 0, $devicePixelRatio, 0, 0)
    });

    const rectangle  = root.getBounds();
    const bitmapData = new BitmapData(canvas.width, canvas.height);

    bitmapData.canvas = canvas;
    bitmap.x = rectangle.x;
    bitmap.y = rectangle.y;
    bitmap
        .graphics
        .clear()
        .beginBitmapFill(bitmapData, null, false, false)
        .drawRect(0, 0, canvas.width, canvas.height);

    root.addChild(bitmap);

    const config = $getConfig();
    const width  = config.stage.width;
    const height = config.stage.height;

    if (shape.width !== width || shape.width !== height) {
        shape
            .graphics
            .clear()
            .beginFill(0, 0.8)
            .drawRect(0, 0, width, height)
            .endFill();
    }

    const scale = stage.rendererScale;

    const tx = (stage.rendererWidth  - stage.stageWidth * scale) / 2;
    if (tx && $cacheX !== tx) {
        $cacheX = tx;
        shape.scaleX = (width + tx * 2 / scale) / width;
        shape.x = -tx / scale;
    }

    const ty = (stage.rendererHeight - stage.stageHeight * scale) / 2;
    if (ty && $cacheY !== ty) {
        $cacheY = ty;
        shape.scaleY = (height + ty * 2 / scale) / height;
        shape.y = -ty / scale;
    }

    root.addChild(shape);

    /**
     * マウス操作を強制停止
     * Mouse operation is forced to stop
     */
    root.mouseChildren = false;
};