/**
 * @description QueryStringをパースしてMapに変換
 *              Parse QueryString and convert to Map
 *
 * @param  {string} queryString
 * @return {Map<string, string>}
 * @method
 * @public
 */
export const parseQueryString = (queryString: string): Map<string, string> =>
{
    const result = new Map<string, string>();
    const startIndex = queryString.charAt(0) === "?" ? 1 : 0;
    const parameters = queryString.slice(startIndex).split("&");

    for (let idx = 0; idx < parameters.length; ++idx) {
        const pair = parameters[idx].split("=");
        if (pair[0]) {
            result.set(pair[0], pair[1] ?? "");
        }
    }

    return result;
};
