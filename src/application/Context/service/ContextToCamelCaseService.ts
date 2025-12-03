/**
 * @description キャメルケースに変換
 *              Convert to CamelCase
 *
 * @param  {string} name
 * @return {string}
 * @method
 * @public
 */
export const execute = (name: string): string =>
{
    return name
        .split(/-|\/|_/)
        .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};