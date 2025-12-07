import { IURLRequestMethod } from "../../../interface/IURLRequestMethod";

/**
 * @description HTTPメソッドを正規化
 *              Normalize HTTP method
 *
 * @param  {string} [method]
 * @return {string}
 * @method
 * @protected
 */
export const execute = (method?: string): IURLRequestMethod =>
{
    if (!method) {
        return "GET";
    }

    const normalized = method.toUpperCase();
    switch (normalized) {
        case "DELETE":
        case "GET":
        case "HEAD":
        case "OPTIONS":
        case "POST":
        case "PUT":
            return normalized;

        default:
            return "GET";
    }
};
