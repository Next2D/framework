import type { IRequest } from "../../interface/IRequest";
import { cache } from "../../application/variable/Cache";
import { ResponseDTO } from "../dto/ResponseDTO";

/**
 * @description レスポンスをキャッシュに保存してDTOを返却
 *              Save response to cache and return DTO
 *
 * @param  {IRequest} requestObject
 * @param  {T} value
 * @return {ResponseDTO<T>}
 * @method
 * @public
 */
export const execute = <T = unknown>(requestObject: IRequest, value: T): ResponseDTO<T> =>
{
    const name = requestObject.name as string;

    if (requestObject.cache) {
        cache.set(name, value);
    }

    return new ResponseDTO(name, value, requestObject.callback);
};
