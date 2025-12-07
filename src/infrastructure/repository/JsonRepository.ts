import type { IRequest } from "../../interface/IRequest";
import { ResponseDTO } from "../dto/ResponseDTO";
import { normalizeHttpMethod } from "../../shared/util/NormalizeHttpMethod";
import { execute as requestCacheCheckService } from "../service/RequestCacheCheckService";
import { execute as requestResponseProcessService } from "../service/RequestResponseProcessService";

/**
 * @description 指定先のJSONを非同期で取得
 *              Asynchronously obtain JSON of the specified destination
 *
 * @param  {IRequest} requestObject
 * @return {Promise<ResponseDTO>}
 * @throws {Error} path/nameが未設定の場合、HTTPエラーの場合
 * @method
 * @public
 */
export const execute = async (requestObject: IRequest): Promise<ResponseDTO> =>
{
    if (!requestObject.path || !requestObject.name) {
        throw new Error("`path` and `name` must be set for json requests.");
    }

    const cachedResponse = requestCacheCheckService(requestObject);
    if (cachedResponse) {
        return cachedResponse;
    }

    const method = normalizeHttpMethod(requestObject.method);
    const options: RequestInit = { method };

    if (requestObject.body && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(requestObject.body);
    }

    if (requestObject.headers) {
        options.headers = requestObject.headers;
    }

    const response = await fetch(requestObject.path, options);

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText} for ${requestObject.path}`);
    }

    const value = await response.json();

    return requestResponseProcessService(requestObject, value);
};
