import { query } from "../../variable/Query";

/**
 * @description QueryStringをパースしてqueryマップに登録
 *              Parse QueryString and register to query map
 *
 * @param  {string} queryString
 * @return {void}
 * @method
 * @protected
 */
export const execute = (queryString: string): void =>
{
    const startIndex = queryString.charAt(0) === "?" ? 1 : 0;
    const parameters = queryString.slice(startIndex).split("&");
    for (let idx = 0; idx < parameters.length; ++idx) {
        const pair = parameters[idx].split("=");
        query.set(pair[0], pair[1]);
    }
};
