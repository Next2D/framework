import type { Context } from "../../Context";
import type { View } from "../../../view/View";
import type { ViewModel } from "../../../view/ViewModel";
import type { Constructor } from "../../../interface/IPackages";
import { packages } from "../../variable/Packages";
import { execute as contextToCamelCaseService } from "../service/ContextToCamelCaseService";

/**
 * @description ViewとViewModelのbindを行います。
 *              Binds View and ViewModel.
 *
 * @param  {Context} context
 * @param  {string} name
 * @return {Promise<View>}
 * @method
 * @protected
 */
export const execute = async (context: Context, name: string): Promise<View> =>
{
    const viewName      = `${contextToCamelCaseService(name)}View`;
    const viewModelName = `${viewName}Model`;

    if (!packages.size
        || !packages.has(viewName)
        || !packages.has(viewModelName)
    ) {
        throw new Error("not found view or viewMode.");
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
     * rootの子要素を全て削除
     * Remove all child elements of root
     */
    const root = context.root;
    while (root.numChildren) {
        root.removeChildAt(0);
    }

    /**
     * stageの一番背面にviewをセット
     * Set the view at the very back of the stage
     */
    root.addChildAt(context.view, 0);

    /**
     * 画面表示時の処理を実行
     * Execute processing when the screen is displayed
     */
    await context.view.onEnter();

    return context.view;
};