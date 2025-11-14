import type { Context } from "../../Context";

/**
 * @description ViewとViewModelのバインドを解除します。
 *              Unbinds View and ViewModel.
 *
 * @param  {Context} context
 * @return {Promise<void>}
 * @method
 * @protected
 */
export const execute = async (context: Context): Promise<void> =>
{
    if (!context.view || !context.viewModel) {
        return ;
    }

    const root = context.root;
    if (!root) {
        return ;
    }

    root.removeChild(context.view);

    /**
     * ViewのonExitをコール
     * Call View's onExit
     */
    await context.view.onExit();
};