import type { Job } from "@next2d/ui";
import { Sprite, Shape } from "@next2d/display";
import { $getConfig } from "../../application/variable/Config";
import { $getContext } from "../../application/variable/Context";
import { Tween, Easing } from "@next2d/ui";

/**
 * @description Tweenジョブを取得または作成
 *              Get or create Tween job
 *
 * @param  {Shape} shape
 * @param  {string} jobName
 * @return {Job}
 */
const getOrCreateJob = (shape: Shape, jobName: string): Job =>
{
    if (shape.hasLocalVariable(jobName)) {
        const job = shape.getLocalVariable(jobName) as Job;
        job.stop();
        return job;
    }

    const job = Tween.add(
        shape,
        { "scaleX": 0.1, "scaleY": 0.1, "alpha": 0 },
        { "scaleX": 1, "scaleY": 1, "alpha": 1 },
        0.12,
        0.5,
        Easing.inOutCubic
    );
    shape.setLocalVariable(jobName, job);
    return job;
};

/**
 * @description デフォルトのローディング演出
 *              Default loading direction
 *
 * @class
 */
export class DefaultLoader
{
    /**
     * @description ローディング演出に使用するSprite
     *              Sprite used for loading direction
     *
     * @type {Sprite}
     * @public
     */
    public readonly sprite: Sprite;

    /**
     * @constructor
     */
    constructor ()
    {
        this.sprite = new Sprite();
        this.initialize();
    }

    /**
     * @description ローディング演出の初期化
     *              Initialization of loading direction
     *
     * @return {void}
     * @method
     * @public
     */
    initialize (): void
    {
        for (let idx = 0; idx < 3; ++idx) {
            this.sprite.addChild(new Shape());
        }
    }

    /**
     * @description Canvasが設置されたDOMにローディング演出を登録、既にDOMがあれば演出を表示
     *              Register loading direction in the DOM where Canvas is installed,
     *              and display the direction if the DOM already exists.
     *
     * @return {void}
     * @method
     * @public
     */
    start (): void
    {
        const root = $getContext().root;
        if (!root) {
            return;
        }

        const config = $getConfig();
        const sprite = this.sprite;

        const minSize  = Math.ceil(Math.min(config.stage.width, config.stage.height) / 100);
        const halfSize = minSize / 2;

        for (let idx = 0; idx < 3; ++idx) {

            const shape = sprite.getChildAt<Shape>(idx);
            if (!shape) {
                continue;
            }

            /**
             * 初期値を設定
             * Set initial values
             */
            shape.scaleX = 0.1;
            shape.scaleY = 0.1;
            shape.alpha  = 0;

            const reduceJob = getOrCreateJob(shape, "reduceJob");
            const expandJob = getOrCreateJob(shape, "expandJob");

            reduceJob.nextJob = expandJob;
            expandJob.nextJob = reduceJob;

            if (idx) {
                setTimeout((): void =>
                {
                    expandJob.start();
                }, 120 * idx);
            } else {
                expandJob.start();
            }

            if (shape.width === minSize) {
                continue;
            }

            shape
                .graphics
                .clear()
                .beginFill("#ffffff")
                .drawCircle(0, 0, halfSize);

            shape.x = minSize * 2 * idx;
        }

        sprite.x = (config.stage.width  - sprite.width)  / 2;
        sprite.y = (config.stage.height - sprite.height) / 2;
        root.addChild(sprite);
    }

    /**
     * @description ローディング演出を非表示にする
     *              Hide loading direction
     *
     * @return {void}
     * @method
     * @public
     */
    end (): void
    {
        const root = $getContext().root;
        if (!root) {
            return;
        }

        const sprite = this.sprite;
        for (let idx = 0; idx < 3; ++idx) {

            const shape = sprite.getChildAt<Shape>(idx);
            if (!shape) {
                continue;
            }

            if (shape.hasLocalVariable("expandJob")) {
                const expandJob = shape.getLocalVariable("expandJob") as Job;
                expandJob.stop();
            }

            if (shape.hasLocalVariable("reduceJob")) {
                const reduceJob = shape.getLocalVariable("reduceJob") as Job;
                reduceJob.stop();
            }
        }

        root.removeChild(sprite);
    }
}
