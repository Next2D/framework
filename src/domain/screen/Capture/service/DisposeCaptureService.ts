import { context } from "../../../../application/variable/Context";
import {
    shape,
    bitmap
} from "../../Capture";

/**
 * @description 画面キャプチャーのShapeをStageから削除
 *              Delete Screen Capture Shape from Stage
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const root = context.root;
    if (!root) {
        return ;
    }

    root.removeChild(shape);
    root.removeChild(bitmap);

    /**
     * マウス操作を有効化
     * Enable Mouse Operation
     */
    root.mouseChildren = true;
};