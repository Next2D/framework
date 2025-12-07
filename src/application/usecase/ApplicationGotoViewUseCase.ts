import type { Application } from "../Application";
import { $getConfig } from "../variable/Config";
import { $getContext } from "../variable/Context";
import { response } from "../../infrastructure/variable/Response";
import { execute as queryStringParserService } from "../service/QueryStringParserService";
import { execute as requestUseCase } from "../../infrastructure/usecase/RequestUseCase";
import { execute as executeCallbackUseCase } from "./ExecuteCallbackUseCase";
import { execute as responseRemoveVariableUseCase } from "../../infrastructure/usecase/ResponseRemoveVariableUseCase";
import { ViewBinderService } from "../../domain/service/ViewBinderService";
import { LoadingService } from "../../domain/service/LoadingService";
import { ScreenCaptureService } from "../../domain/service/ScreenCaptureService";

/**
 * @description 指定されたパス、もしくはURLのクラスを起動
 *              Start the class of the specified path or URL
 *
 * @param  {Application} application
 * @param  {string} [name=""]
 * @return {Promise<void>}
 * @method
 * @protected
 */
export const execute = async (
    application: Application,
    name: string = ""
): Promise<void> => {

    const config = $getConfig();
    const hasLoading = !!config.loading;

    if (hasLoading) {
        /**
         * 現時点の描画をキャプチャーして表示
         * Capture and display the current drawing
         */
        await ScreenCaptureService.add();

        /**
         * ローディング表示を起動
         * Launch loading display
         */
        await LoadingService.start();
    }

    /**
     * 現在の画面のViewとViewModelをunbind
     * Unbind the View and ViewModel of the current screen
     */
    const context = $getContext();
    await ViewBinderService.unbind(context);

    /**
     * 前の画面で取得したレスポンスデータを初期化
     * Initialize the response data obtained on the previous screen
     */
    responseRemoveVariableUseCase(application.currentName);

    /**
     * 指定されたパス、もしくはURLからアクセス先を算出
     * Calculate the access point from the specified path or URL
     */
    const queryObject = queryStringParserService(name);

    /**
     * 現在の画面名を更新
     * Update current screen name
     */
    application.currentName = queryObject.name;

    /**
     * 遷移履歴をセット
     * Set transition history
     */
    if (config.spa && !application.popstate) {
        history.pushState("", "",
            `${location.origin}/${application.currentName}${queryObject.queryString}`
        );
    }

    // update
    application.popstate = false;

    /**
     * routing.jsonで設定したリクエスト処理を実行
     * Execute request processing set by routing.json
     */
    const responses = await requestUseCase(application.currentName);

    /**
     * レスポンス情報をマップに登録
     * Response information is registered on the map
     */
    for (let idx = 0; idx < responses.length; ++idx) {

        const object = responses[idx];
        if (object.name) {
            response.set(object.name, object.response);
        }
    }

    if (hasLoading) {
        /**
         * ローディング表示を終了
         * End loading display
         */
        await LoadingService.end();

        /**
         * 前の画面のキャプチャーを終了
         * End previous screen capture
         */
        ScreenCaptureService.dispose();
    }

    /**
     * ViewとViewModelを起動
     * Start View and ViewModel
     */
    const view = await ViewBinderService.bind(context, application.currentName);

    /**
     * コールバック設定があれば実行
     * Execute callback settings if any.
     */
    if (view && config.gotoView) {
        await executeCallbackUseCase(config.gotoView.callback, view);
    }
};
