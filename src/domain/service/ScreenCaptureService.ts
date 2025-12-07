import { $getConfig } from "../../application/variable/Config";
import { $getContext } from "../../application/variable/Context";
import { Matrix } from "@next2d/geom";
import {
    stage,
    BitmapData,
    Shape
} from "@next2d/display";

/**
 * @type {Shape}
 * @private
 */
const shape: Shape = new Shape();

/**
 * @type {number}
 * @private
 */
let cacheX: number = 0;

/**
 * @type {number}
 * @private
 */
let cacheY: number = 0;

/**
 * @description 画面キャプチャーを管理するドメインサービス
 *              Domain service for managing screen capture
 */
export const ScreenCaptureService = {

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

        const scale  = stage.rendererScale;
        const config = $getConfig();
        const width  = config.stage.width;
        const height = config.stage.height;

        const tx = (stage.rendererWidth  - stage.stageWidth  * scale) / 2;
        const ty = (stage.rendererHeight - stage.stageHeight * scale) / 2;

        /**
         * 現在の描画をcanvasに転写
         * Transfer the current drawing to canvas
         */
        const rectangle = root.getBounds();
        if (rectangle.width > 0 && rectangle.height > 0) {

            const canvas = await next2d.captureToCanvas(root, {
                "matrix": new Matrix(
                    scale, 0, 0, scale,
                    -rectangle.x * scale,
                    -rectangle.y * scale
                ),
                "bgColor": config.stage.options?.bgColor || null,
                "bgAlpha": config.stage.options?.bgColor !== "" ? 1 : 0
            });

            const bitmapData  = new BitmapData(canvas.width, canvas.height);
            bitmapData.canvas = canvas;

            const bitmap = new Shape();
            bitmap.setBitmapBuffer(
                canvas.width, canvas.height,
                bitmapData.buffer as Uint8Array
            );

            bitmap.scaleX = 1 / scale;
            bitmap.scaleY = 1 / scale;
            bitmap.x = -tx / scale;
            bitmap.y = -ty / scale;

            root.addChild(bitmap);
        }

        if (shape.width !== width || shape.width !== height) {
            shape
                .graphics
                .clear()
                .beginFill(0, 0.8)
                .drawRect(0, 0, width, height)
                .endFill();
        }

        if (tx && cacheX !== tx) {
            cacheX = tx;
            shape.width = stage.rendererWidth / scale;
            shape.x = -tx / scale;
        }

        if (ty && cacheY !== ty) {
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
         * rootの子要素を全て削除
         * Remove all child elements of root
         */
        while (root.numChildren > 0) {
            root.removeChildAt(0);
        }

        /**
         * マウス操作を有効化
         * Enable Mouse Operation
         */
        root.mouseChildren = true;
    }
};
