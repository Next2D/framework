import type { DefaultLoader } from "../../DefaultLoader";
import { Shape } from "@next2d/display";
import {
    Tween,
    Easing
} from "@next2d/ui";

/**
 * @description ローディング演出の初期登録
 *              Initial registration of loading direction
 *
 * @param  {DefaultLoader} default_loader
 * @return {void}
 * @method
 * @protected
 */
export const execute = (default_loader: DefaultLoader): void =>
{
    for (let idx = 0; idx < 3; ++idx) {

        const shape = default_loader.sprite.addChild(new Shape());

        const reduceJob = Tween.add(
            shape,
            {
                "scaleX": 0.1,
                "scaleY": 0.1,
                "alpha": 0
            },
            {
                "scaleX": 1,
                "scaleY": 1,
                "alpha": 1
            },
            0.12,
            0.5,
            Easing.inOutCubic
        );
        shape.setLocalVariable("reduceJob", reduceJob);

        const expandJob = Tween.add(
            shape,
            {
                "scaleX": 0.1,
                "scaleY": 0.1,
                "alpha": 0
            },
            {
                "scaleX": 1,
                "scaleY": 1,
                "alpha": 1
            },
            0.12,
            0.5,
            Easing.inOutCubic
        );
        shape.setLocalVariable("expandJob", expandJob);

        reduceJob.nextJob = expandJob;
        expandJob.nextJob = reduceJob;
    }
};