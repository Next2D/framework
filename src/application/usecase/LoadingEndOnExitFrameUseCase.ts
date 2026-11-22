import { stage } from "@next2d/display";
import { Event } from "@next2d/events";
import { LoadingService } from "../../domain/service/LoadingService";
import { ScreenOverlayService } from "../../domain/service/ScreenOverlayService";

/**
 * @type {Function | null}
 * @private
 */
let $listener: (() => Promise<void>) | null = null;

/**
 * @description 待機中のEXIT_FRAMEリスナーを解除する
 *              Remove the pending EXIT_FRAME listener
 *
 * @return {void}
 * @method
 * @public
 */
export const cancel = (): void =>
{
    if (!$listener) {
        return ;
    }

    stage.removeEventListener(Event.EXIT_FRAME, $listener);
    $listener = null;
};

/**
 * @description 次のEXIT_FRAMEでローディング表示と画面キャプチャーを終了する
 *              リスナーを登録した時点で返却し、終了処理の完了はPromiseで通知する
 *              End the loading display and screen capture on the next EXIT_FRAME.
 *              Returns after registering the listener and notifies completion via Promise.
 *
 * @return {Promise<void>}
 * @method
 * @public
 */
export const execute = (): Promise<void> =>
{
    /**
     * 前の遷移のリスナーが残っていれば解除
     * Remove the listener left by the previous transition
     */
    cancel();

    return new Promise<void>((resolve, reject): void =>
    {
        const listener = async (): Promise<void> =>
        {
            /**
             * 一度だけ実行するため、即座に解除
             * Remove immediately so that it runs only once
             */
            stage.removeEventListener(Event.EXIT_FRAME, listener);
            if ($listener === listener) {
                $listener = null;
            }

            try {
                /**
                 * ローディング表示を終了
                 * End loading display
                 */
                await LoadingService.end();

                /**
                 * 前の画面のキャプチャーを終了
                 * End previous screen capture
                 */
                ScreenOverlayService.dispose();

                resolve();
            } catch (error) {
                reject(error);
            }
        };

        $listener = listener;
        stage.addEventListener(Event.EXIT_FRAME, listener);
    });
};
