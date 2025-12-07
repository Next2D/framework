import type { IRequest } from "../../interface/IRequest";
import { cache } from "../../application/variable/Cache";
import { ResponseDTO } from "../dto/ResponseDTO";

/**
 * @description キャッシュをチェックし、存在すればキャッシュデータを返却
 *              Check cache and return cached data if exists
 *
 * @param  {IRequest} requestObject
 * @return {ResponseDTO | null}
 * @method
 * @public
 */
export const execute = (requestObject: IRequest): ResponseDTO | null =>
{
    if (!requestObject.cache || !requestObject.name) {
        return null;
    }

    const name = requestObject.name;

    if (!cache.has(name)) {
        return null;
    }

    const value: unknown = cache.get(name);

    return new ResponseDTO(name, value, requestObject.callback);
};
