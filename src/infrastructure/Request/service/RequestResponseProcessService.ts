import type { IRequest } from "../../../interface/IRequest";
import { cache } from "../../../application/variable/Cache";
import { ResponseDTO } from "../../Response/dto/ResponseDTO";
import { execute as callbackService } from "../../../domain/callback/service/CallbackService";

/**
 * @description レスポンスをキャッシュに保存し、コールバックを実行してDTOを返却
 *              Save response to cache, execute callback and return DTO
 *
 * @param  {IRequest} request_object
 * @param  {any} value
 * @return {Promise<ResponseDTO>}
 * @method
 * @public
 */
export const execute = async (request_object: IRequest, value: any): Promise<ResponseDTO> =>
{
    const name = request_object.name as string;

    if (request_object.cache) {
        cache.set(name, value);
    }

    if (request_object.callback) {
        await callbackService(request_object.callback, value);
    }

    return new ResponseDTO(name, value);
};
