/**
 * @description セパレータ用の正規表現（モジュールレベルで定義して再コンパイルを回避）
 *              Regex for separators (defined at module level to avoid recompilation)
 *
 * @type {RegExp}
 * @private
 */
const SEPARATOR_REGEX = /-|\/|_/;

/**
 * @description キャメルケースに変換
 *              Convert to CamelCase
 *
 * @param  {string} name
 * @return {string}
 * @method
 * @public
 */
export const toCamelCase = (name: string): string =>
{
    const names = name.split(SEPARATOR_REGEX);
    let result = "";
    for (let idx = 0; idx < names.length; ++idx) {
        const word = names[idx];
        result += word.charAt(0).toUpperCase() + word.slice(1);
    }
    return result;
};
