import type { Job } from "@next2d/ui";
import { Sprite, Shape } from "@next2d/display";
import { $getConfig } from "../../application/variable/Config";
import { $getContext } from "../../application/variable/Context";
import { Tween, Easing } from "@next2d/ui";

/**
 * @description アニメーションの定数
 *              Animation constants
 */
const ANIMATION_DURATION = 0.4;
const ANIMATION_DELAY_INTERVAL = 0.15;

/**
 * @description 拡大アニメーションのジョブを作成
 *              Create expand animation job
 *
 * @param  {Shape} shape
 * @param  {number} delay
 * @return {Job}
 */
const createExpandJob = (shape: Shape, delay: number): Job =>
{
    return Tween.add(
        shape,
        { "scaleX": 0.1, "scaleY": 0.1, "alpha": 0 },
        { "scaleX": 1, "scaleY": 1, "alpha": 1 },
        delay,
        ANIMATION_DURATION,
        Easing.inOutCubic
    );
};

/**
 * @description 縮小アニメーションのジョブを作成
 *              Create reduce animation job
 *
 * @param  {Shape} shape
 * @param  {number} delay
 * @return {Job}
 */
const createReduceJob = (shape: Shape, delay: number): Job =>
{
    return Tween.add(
        shape,
        { "scaleX": 1, "scaleY": 1, "alpha": 1 },
        { "scaleX": 0.1, "scaleY": 0.1, "alpha": 0 },
        delay,
        ANIMATION_DURATION,
        Easing.inOutCubic
    );
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

            /**
             * 既存のジョブを停止してクリア
             * Stop and clear existing jobs
             */
            if (shape.hasLocalVariable("expandJob")) {
                (shape.getLocalVariable("expandJob") as Job).stop();
            }
            if (shape.hasLocalVariable("reduceJob")) {
                (shape.getLocalVariable("reduceJob") as Job).stop();
            }

            /**
             * アニメーションジョブを作成
             * 初回のみ遅延を設定し、ループ時はdelayなしで統一サイクル
             * Create animation jobs
             * Set delay only for the first time, no delay for loop with unified cycle
             *
             * 初回: expandJob(delay) -> reduceJob(0) -> loopExpandJob(0) -> loopReduceJob(0) -> ...
             */
            const initialDelay = ANIMATION_DELAY_INTERVAL * idx;

            // 初回の拡大アニメーション（遅延あり）
            const expandJob = createExpandJob(shape, initialDelay);

            // 縮小アニメーション（遅延なし）
            const reduceJob = createReduceJob(shape, 0);

            // ループ用の拡大アニメーション（遅延なし）
            const loopExpandJob = createExpandJob(shape, 0);

            // ジョブチェーンを構築（ループ）
            expandJob.nextJob = reduceJob;
            reduceJob.nextJob = loopExpandJob;
            loopExpandJob.nextJob = reduceJob;

            // ローカル変数に保存（end時に停止するため）
            shape.setLocalVariable("expandJob", expandJob);
            shape.setLocalVariable("reduceJob", reduceJob);
            shape.setLocalVariable("loopExpandJob", loopExpandJob);

            expandJob.start();

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

            /**
             * 全てのジョブを停止
             * Stop all jobs
             */
            const jobNames = ["expandJob", "reduceJob", "loopExpandJob"];
            for (let jIdx = 0; jIdx < jobNames.length; ++jIdx) {
                const jobName = jobNames[jIdx];
                if (shape.hasLocalVariable(jobName)) {
                    (shape.getLocalVariable(jobName) as Job).stop();
                }
            }
        }

        root.removeChild(sprite);
    }
}
