import type { Context } from "../../application/Context";
import type { View } from "../../view/View";
import type { ViewModel } from "../../view/ViewModel";
import type { Constructor } from "../../interface/IPackages";
import { packages } from "../../application/variable/Packages";
import { toCamelCase } from "../../shared/util/ToCamelCase";

/**
 * @description ViewとViewModelのバインドを行うドメインサービス
 *              Domain service for binding View and ViewModel
 */
export const ViewBinderService =
{
    /**
     * @description ViewとViewModelをバインドします
     *              Binds View and ViewModel
     *
     * @param  {Context} context
     * @param  {string} name
     * @return {Promise<View>}
     */
    "bind": async (context: Context, name: string): Promise<View> =>
    {
        const viewName      = `${toCamelCase(name)}View`;
        const viewModelName = `${viewName}Model`;

        if (!packages.size
            || !packages.has(viewName)
            || !packages.has(viewModelName)
        ) {
            throw new Error("not found view or viewModel.");
        }

        /**
         * 遷移先のViewとViewModelを起動、初期化処理を実行
         * Start the destination View and ViewModel, and execute the initialization process
         */
        const ViewModelClass = packages.get(viewModelName) as Constructor<ViewModel>;
        context.viewModel = new ViewModelClass();
        await context.viewModel.initialize();

        const ViewClass = packages.get(viewName) as Constructor<View>;
        context.view = new ViewClass(context.viewModel);
        await context.view.initialize();

        /**
         * stageの一番背面にviewをセット
         * Set the view at the very back of the stage
         */
        const root = context.root;
        root.addChildAt(context.view, 0);

        return context.view;
    },

    /**
     * @description ViewとViewModelのバインドを解除します
     *              Unbinds View and ViewModel
     *
     * @param  {Context} context
     * @return {Promise<void>}
     */
    "unbind": async (context: Context): Promise<void> =>
    {
        if (!context.view || !context.viewModel) {
            return;
        }

        /**
         * ViewのonExitをコール
         * Call View's onExit
         */
        await context.view.onExit();

        /**
         * ViewをStageから削除
         * Remove View from Stage
         */
        const root = context.root;
        if (!root) {
            return;
        }
        root.removeChild(context.view);
    }
};
