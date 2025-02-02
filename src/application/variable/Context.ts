import type { IConfig } from "../../interface/IConfig";
import { Context } from "../Context";

/**
 * @type {Context}
 * @public
 */
export let context: Context;

/**
 * @param  {IConfig} config
 * @return {Promise<void>}
 * @method
 * @private
 */
export const $createContext = async (config: IConfig): Promise<void> =>
{
    const root = await next2d.createRootMovieClip(
        config.stage.width,
        config.stage.height,
        config.stage.fps,
        config.stage.options
    );

    context = new Context(root);
};