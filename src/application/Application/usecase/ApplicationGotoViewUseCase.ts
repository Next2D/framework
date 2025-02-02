import type { Application } from "../../Application";
import { $getConfig } from "../../variable/Config";
import { execute as addScreenCaptureService } from "../../../domain/screen/Capture/service/AddScreenCaptureService";
import { execute as disposeCaptureService } from "../../../domain/screen/Capture/service/DisposeCaptureService";
import { execute as loadingStartService } from "../../../domain/loading/Loading/service/LoadingStartService";
import { execute as loadingEndService } from "../../../domain/loading/Loading/service/LoadingEndService";

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
export const execute = async (application: Application, name: string = ""): Promise<void> =>
{
    const config = $getConfig();
    if (config.loading) {

        const promises: Promise<void>[] = [];

        /**
         * 現時点の描画をキャプチャーして表示
         * Capture and display the current drawing
         */
        promises.push(addScreenCaptureService());

        /**
         * ローディング表示を起動
         * Launch loading display
         */
        promises.push(loadingStartService());

        await Promise.all(promises);
    }

    // /**
    //  * 前の画面で取得したレスポンスデータを初期化
    //  * Initialize the response data obtained on the previous screen
    //  */
    // removeResponse(application.currentName);

    // /**
    //  * 指定されたパス、もしくはURLからアクセス先を算出
    //  * Calculate the access point from the specified path or URL
    //  */
    // const queryObject: IQueryObject = queryParser(name);

    // /**
    //  * 現在の画面名を更新
    //  * Update current screen name
    //  */
    // application.currentName = queryObject.name;

    // /**
    //  * 遷移履歴をセット
    //  * Set transition history
    //  */
    // if (config.spa && !application.popstate) {
    //     history.pushState("", "",
    //         `${location.origin}/${application.currentName}${queryObject.queryString}`
    //     );
    // }

    // update
    application.popstate = false;

    // /**
    //  * routing.jsonで設定したリクエスト処理を実行
    //  * Execute request processing set by routing.json
    //  */
    // const responses: ResponseDTO[] = await Promise.all(requestUseCase(application.currentName));

    // /**
    //  * レスポンス情報をマップに登録
    //  * Response information is registered on the map
    //  */
    // for (let idx: number = 0; idx < responses.length; ++idx) {

    //     const object: ResponseDTO = responses[idx];
    //     if (!object.name) {
    //         continue;
    //     }

    //     response.set(object.name, object.response);
    // }

    // /**
    //  * ViewとViewModelを起動
    //  * Start View and ViewModel
    //  */
    // const view: View = await context.boot(application.currentName);

    // /**
    //  * コールバック設定があれば実行
    //  * Execute callback settings if any.
    //  */
    // if (view && config.gotoView) {
    //     const promises: Promise<any>[] = [];
    //     promises.push(callback(
    //         config.gotoView.callback, view
    //     ));

    //     await Promise.all(promises);
    // }

    /**
     * ローディング表示を終了
     * End loading display
     */
    await loadingEndService();

    /**
     * 前の画面のキャプチャーを終了
     * End previous screen capture
     */
    disposeCaptureService();
};