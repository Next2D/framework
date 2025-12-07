/**
 * @description popstateイベントのキュー
 *              Queue for popstate events
 *
 * @type {Promise<void>}
 * @protected
 */
export let popstateQueue: Promise<void> = Promise.resolve();

/**
 * @description popstateキューを設定
 *              Set popstate queue
 *
 * @param  {Promise<void>} queue
 * @return {void}
 * @method
 * @protected
 */
export const setPopstateQueue = (queue: Promise<void>): void =>
{
    popstateQueue = queue;
};
