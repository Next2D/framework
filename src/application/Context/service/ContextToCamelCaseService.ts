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
    const names = name.split(/-|\/|_/);
    let result = "";
    for (let idx = 0; idx < names.length; ++idx) {
        const word = names[idx];
        result += word.charAt(0).toUpperCase() + word.slice(1);
    }
    return result;
};