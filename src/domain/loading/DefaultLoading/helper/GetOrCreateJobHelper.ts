import type { Shape } from "@next2d/display";
import type { Job } from "@next2d/ui";
import {
    Tween,
    Easing
} from "@next2d/ui";

/**
 * @description Tweenジョブを取得または作成
 *              Get or create Tween job
 *
 * @param  {Shape} shape
 * @param  {string} jobName
 * @return {Job}
 * @method
 * @protected
 */
export const execute = (shape: Shape, jobName: string): Job =>
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
