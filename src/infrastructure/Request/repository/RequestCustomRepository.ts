import type { IRequest } from "../../../interface/IRequest";
import { packages } from "../../../application/variable/Packages";
import { execute as requestCacheCheckService } from "../service/RequestCacheCheckService";
import { execute as requestResponseProcessService } from "../service/RequestResponseProcessService";

/**
 * @description 指定先の外部データを非同期で取得
 *              Asynchronous acquisition of external data at specified destination
 *
 * @param  {IRequest} request_object
 * @return {Promise<any>}
 * @method
 * @public
 */
export const execute = async (request_object: IRequest): Promise<any> =>
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

    const CallbackClass: any = packages.get(className);
    const value = request_object.access === "static"
        ? await CallbackClass[request_object.method]()
        : await new CallbackClass()[request_object.method]();

    return requestResponseProcessService(request_object, value);
};