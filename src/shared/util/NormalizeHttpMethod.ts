import type { IHttpMethod } from "../../interface/IRequest";

/**
 * @description HTTPメソッドを正規化
 *              Normalize HTTP method
 *
 * @param  {string} [method]
 * @return {IHttpMethod}
 * @method
 * @public
 */
export const normalizeHttpMethod = (method?: string): IHttpMethod =>
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
