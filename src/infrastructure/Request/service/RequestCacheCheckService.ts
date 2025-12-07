import type { IRequest } from "../../../interface/IRequest";
import { cache } from "../../../application/variable/Cache";
import { ResponseDTO } from "../../Response/dto/ResponseDTO";
import { execute as callbackService } from "../../../domain/callback/service/CallbackService";

/**
 * @description キャッシュをチェックし、存在すればキャッシュデータを返却
 *              Check cache and return cached data if exists
 *
 * @param  {IRequest} request_object
 * @return {Promise<ResponseDTO | null>}
 * @method
 * @public
 */
export const execute = async (request_object: IRequest): Promise<ResponseDTO | null> =>
{
    if (!request_object.cache || !request_object.name) {
        return null;
    }

    const name = request_object.name;

    if (!cache.size || !cache.has(name)) {
        return null;
    }

    const value: unknown = cache.get(name);

    if (request_object.callback) {
        await callbackService(request_object.callback, value);
    }

    return new ResponseDTO(name, value);
};
