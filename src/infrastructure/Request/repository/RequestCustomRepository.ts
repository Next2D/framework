import type { IRequest } from "../../../interface/IRequest";
import type { Constructor } from "../../../interface/IPackages";
import { ResponseDTO } from "../../Response/dto/ResponseDTO";
import { packages } from "../../../application/variable/Packages";
import { execute as requestCacheCheckService } from "../service/RequestCacheCheckService";
import { execute as requestResponseProcessService } from "../service/RequestResponseProcessService";

/**
 * @description Customリクエスト用のクラスインターフェース
 *              Class interface for Custom request
 */
interface ICustomClass {
    [key: string]: () => Promise<unknown> | unknown;
}

/**
 * @description 指定先の外部データを非同期で取得
 *              Asynchronous acquisition of external data at specified destination
 *
 * @param  {IRequest} request_object
 * @return {Promise<ResponseDTO>}
 * @method
 * @public
 */
export const execute = async (request_object: IRequest): Promise<ResponseDTO> =>
{
    if (!request_object.class
        || !request_object.access
        || !request_object.method
        || !request_object.name
    ) {
        throw new Error("`class`, `access`, `method` and `name` must be set for custom requests.");
    }

    const cachedResponse = await requestCacheCheckService(request_object);
    if (cachedResponse) {
        return cachedResponse;
    }

    const className = request_object.class;
    if (!packages.has(className)) {
        throw new Error("package not found.");
    }

    const CustomClass = packages.get(className) as Constructor<ICustomClass> & ICustomClass;
    const value = request_object.access === "static"
        ? await CustomClass[request_object.method]()
        : await new CustomClass()[request_object.method]();

    return requestResponseProcessService(request_object, value);
};