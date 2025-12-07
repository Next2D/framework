import type { IRequest } from "../../interface/IRequest";
import { cache } from "../../application/variable/Cache";
import { ResponseDTO } from "../dto/ResponseDTO";
import { execute as executeCallbackUseCase } from "../../application/usecase/ExecuteCallbackUseCase";

/**
 * @description レスポンスをキャッシュに保存し、コールバックを実行してDTOを返却
 *              Save response to cache, execute callback and return DTO
 *
 * @param  {IRequest} request_object
 * @param  {unknown} value
 * @return {Promise<ResponseDTO>}
 * @method
 * @public
 */
export const execute = async <T = unknown>(request_object: IRequest, value: T): Promise<ResponseDTO<T>> =>
{
    const name = request_object.name as string;

    if (request_object.cache) {
        cache.set(name, value);
    }

    if (request_object.callback) {
        await executeCallbackUseCase(request_object.callback, value);
    }

    return new ResponseDTO(name, value);
};
