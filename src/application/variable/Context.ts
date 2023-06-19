import { Context } from "../Context";
import type { ConfigImpl } from "../../interface/ConfigImpl";
import {Sprite} from "@next2d/player/dist/player/next2d/display/Sprite";

/**
 * @type {Context}
 * @public
 */
export let context: Context;

/**
 * @param  {object} config
 * @return {void}
 * @method
 * @private
 */
export const $createContext = (config: ConfigImpl): Promise<void> =>
{
    return window
        .next2d
        .createRootMovieClip(
            config.stage.width,
            config.stage.height,
            config.stage.fps,
            config.stage.options
        )
        .then((root: Sprite): Promise<void> =>
        {
            context = new Context(root);

            return Promise.resolve();
        });
};