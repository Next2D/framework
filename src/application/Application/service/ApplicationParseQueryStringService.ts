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
    const parameters = queryString.slice(queryString.startsWith("?") ? 1 : 0).split("&");
    for (const parameter of parameters) {
        const [key, value] = parameter.split("=");
        query.set(key, value);
    }
};
