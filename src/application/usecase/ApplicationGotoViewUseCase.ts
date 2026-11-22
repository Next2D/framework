import type { Application } from "../Application";
import { $getConfig } from "../variable/Config";
import { $getContext } from "../variable/Context";
import { response } from "../../infrastructure/variable/Response";
import { execute as queryStringParserService } from "../service/QueryStringParserService";
import {
    execute as requestUseCase,
    getRequests
} from "../../infrastructure/usecase/RequestUseCase";
import { execute as executeCallbackUseCase } from "./ExecuteCallbackUseCase";
import {
    execute as loadingEndOnExitFrameUseCase,
    cancel as cancelLoadingEndOnExitFrameUseCase
} from "./LoadingEndOnExitFrameUseCase";
import { execute as responseRemoveVariableUseCase } from "../../infrastructure/usecase/ResponseRemoveVariableUseCase";
import { ViewBinderService } from "../../domain/service/ViewBinderService";
import { LoadingService } from "../../domain/service/LoadingService";
import { ScreenOverlayService } from "../../domain/service/ScreenOverlayService";

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

    /**
     * 前の遷移で待機中のローディング終了処理を解除
     * Cancel the pending loading end process of the previous transition
     */
    cancelLoadingEndOnExitFrameUseCase();

    if (hasLoading) {
        /**
         * 現時点の描画をキャプチャーして表示
         * Capture and display the current drawing
         */
        await ScreenOverlayService.add();

        /**
         * ローディング表示を起動
         * Launch loading display
         */
        await LoadingService.start();
    }

    /**
     * 前の画面で取得したレスポンスデータを初期化
     * Initialize the response data obtained on the previous screen
     */
    const previousRequests = getRequests(application.currentName);
    responseRemoveVariableUseCase(previousRequests);

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
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    /**
     * レスポンス情報をマップに登録し、コールバックを実行
     * Register response information on the map and execute callbacks
     */
    for (let idx = 0; idx < responses.length; ++idx) {

        const object = responses[idx];
        if (object.name) {
            response.set(object.name, object.response);
        }

        /**
         * リクエストごとのコールバック処理を実行
         * Execute callback for each request
         */
        if (object.callback) {
            await executeCallbackUseCase(object.callback, object.response);
        }
    }

    /**
     * 現在の画面のViewとViewModelをunbind
     * Unbind the View and ViewModel of the current screen
     */
    const context = $getContext();
    await ViewBinderService.unbind(context);

    /**
     * ViewとViewModelを起動
     * Start View and ViewModel
     */
    const view = await ViewBinderService.bind(context, application.currentName);

    /**
     * bind後の最初のEXIT_FRAMEでローディング表示と画面キャプチャーを終了
     * End loading display and screen capture on the first EXIT_FRAME after bind
     */
    const loadingEnded: Promise<void> = hasLoading
        ? loadingEndOnExitFrameUseCase()
        : Promise.resolve();

    /**
     * コールバック設定があれば実行
     * Execute callback settings if any.
     */
    if (view && config.gotoView) {
        await executeCallbackUseCase(config.gotoView.callback, view);
    }

    /**
     * ローディングの終了を待機
     * Wait for the loading to end
     */
    await loadingEnded;

    /**
     * 画面表示時の処理を実行
     * Execute processing when the screen is displayed
     */
    await view.onEnter();
};
