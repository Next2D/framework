import type { IRequest } from "../../../interface/IRequest";
import { execute as requestCacheCheckService } from "../service/RequestCacheCheckService";
import { execute as requestResponseProcessService } from "../service/RequestResponseProcessService";

/**
 * @description 指定先のJSONを非同期で取得
 *              Asynchronously obtain JSON of the specified destination
 *
 * @param  {IRequest} request_object
 * @return {Promise<any>}
 * @method
 * @public
 */
export const execute = async (request_object: IRequest): Promise<any> =>
{
    if (!request_object.path || !request_object.name) {
        throw new Error("`path` and `name` must be set for json requests.");
    }

    const cachedResponse = await requestCacheCheckService(request_object);
    if (cachedResponse) {
        return cachedResponse;
    }

    const options: RequestInit = {};

    const method = options.method = request_object.method
        ? request_object.method.toUpperCase()
        : "GET";

    const body = request_object.body
        && method === "POST" || method === "PUT"
        ? JSON.stringify(request_object.body)
        : null;

    if (body) {
        options.body = body;
    }

    if (request_object.headers) {
        options.headers = request_object.headers;
    }

    const response = await fetch(request_object.path, options);
    const value = await response.json();

    return requestResponseProcessService(request_object, value);
};