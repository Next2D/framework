import { config } from "../../application/variable/Config";
import { context } from "../../application/variable/Context";
import { $currentPlayer } from "@next2d/util";
import { Shape } from "@next2d/display";
import type { Sprite } from "@next2d/display";
import type { Player } from "@next2d/core";

/**
 * @type {Shape}
 * @default null
 * @private
 */
let shape: Shape | null = null;

/**
 * @description 現時点の描画キャプチャーを生成
 *              Generate current drawing capture
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    return new Promise((resolve) =>
    {
        const width: number  = config.stage.width;
        const height: number = config.stage.height;

        if (!shape) {
            shape = new Shape();
            shape
                .graphics
                .beginFill(0, 0.8)
                .drawRect(0, 0, width, height)
                .endFill();
        }

        const player: Player = $currentPlayer();

        const tx: number = player.x;
        if (tx) {
            const scaleX: number = player.scaleX;
            shape.scaleX = (width + tx * 2 / scaleX) / width;
            shape.x = -tx / scaleX;
        }

        const ty: number = player.y;
        if (ty) {
            const scaleY: number = player.scaleY;
            shape.scaleY = (height + ty * 2 / scaleY) / height;
            shape.y = -ty / scaleY;
        }

        const root: Sprite = context.root;
        if (root) {
            root.mouseChildren = false;
            root.addChild(shape);
        }

        setTimeout(() =>
        {
            resolve();
        }, 350);
    });
};