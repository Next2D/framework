/**
 * @class
 * @memberof domain.screen
 */
export class Capture
{
    /**
     * @description 現時点の描画キャプチャーを生成
     *              Generate current drawing capture
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    execute (): Promise<void>
    {
        return new Promise((resolve) =>
        {
            // @ts-ignore
            const context: any = next2d.fw.context;

            // @ts-ignore
            const root: any = context.root;

            // @ts-ignore
            const { Sprite, Shape, BitmapData } = next2d.display;

            // @ts-ignore
            const { Matrix } = next2d.geom;

            const ratio: number = window.devicePixelRatio;
            const bitmapData: any = new BitmapData(
                root.stage.canvasWidth  * ratio,
                root.stage.canvasHeight * ratio,
                true, 0
            );

            // @ts-ignore
            const config: any = next2d.fw.config;

            const width: number  = config.stage.width;
            const height: number = config.stage.height;

            const mask: any = new Shape();
            mask
                .graphics
                .beginFill(0, 0.8)
                .drawRect(0, 0, width, height)
                .endFill();

            const player: any = root.stage._$player;
            const matrix: any = player._$matrix;

            const tx: number = matrix[4];
            if (tx) {
                const scaleX: number = matrix[0];
                mask.scaleX = (width + tx * 2 / scaleX) / width;
                mask.x = -tx / scaleX;
            }

            const ty: number = matrix[5];
            if (ty) {
                const scaleY: number = matrix[3];
                mask.scaleY = (height + ty * 2 / scaleY) / height;
                mask.y = -ty / scaleY;
            }

            root.addChild(mask);

            const drawMatrix: any = new Matrix(
                matrix[0], matrix[1],
                matrix[2], matrix[3],
                matrix[4], matrix[5]
            );

            bitmapData.draw(root, drawMatrix, null, null, (canvas: HTMLCanvasElement): void =>
            {
                bitmapData.canvas = canvas;

                const sprite: any = new Sprite();
                sprite.x = -matrix[4] / matrix[0];
                sprite.y = -matrix[5] / matrix[3];
                sprite.scaleX = 1 / matrix[0];
                sprite.scaleY = 1 / matrix[3];

                sprite
                    .addChild(new Shape())
                    .graphics
                    .beginBitmapFill(bitmapData)
                    .drawRect(0, 0, bitmapData.width, bitmapData.height)
                    .endFill();

                // remove all
                while (root.numChildren > 0) {
                    root.removeChild(root.getChildAt(0));
                }

                root.addChild(sprite);

                if (root._$created) {
                    root._$created = false;
                    root._$createWorkerInstance();
                }

                return resolve();
            });
        });
    }
}