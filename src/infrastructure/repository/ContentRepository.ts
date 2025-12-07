import type { IRequest } from "../../interface/IRequest";
import { Loader } from "@next2d/display";
import { URLRequest } from "@next2d/net";
import { ResponseDTO } from "../dto/ResponseDTO";
import { normalizeHttpMethod } from "../../shared/util/NormalizeHttpMethod";
import { loaderInfoMap } from "../../application/variable/LoaderInfoMap";
import { execute as requestCacheCheckService } from "../service/RequestCacheCheckService";
import { execute as requestResponseProcessService } from "../service/RequestResponseProcessService";

/**
 * @description 指定先のコンテンツを非同期で取得
 *              Asynchronously obtain content of the specified destination
 *
 * @param  {IRequest} request_object
 * @return {Promise<ResponseDTO>}
 * @method
 * @public
 */
export const execute = async (request_object: IRequest): Promise<ResponseDTO> =>
{
    if (!request_object.path || !request_object.name) {
        throw new Error("`path` and `name` must be set for content requests.");
    }

    const cachedResponse = await requestCacheCheckService(request_object);
    if (cachedResponse) {
        return cachedResponse;
    }

    const urlRequest = new URLRequest(request_object.path);
    urlRequest.method = normalizeHttpMethod(request_object.method);

    if (request_object.headers) {
        for (const [name, value] of Object.entries(request_object.headers)) {
            urlRequest
                .requestHeaders
                .push({ name, value });
        }
    }

    if (request_object.body) {
        urlRequest.data = JSON.stringify(request_object.body);
    }

    const loader = new Loader();
    await loader.load(urlRequest);

    const content = loader.content;

    /**
     * Animation Toolで設定したシンボルをマップに登録
     * Register the symbols set by Animation Tool to the map
     */
    const loaderInfo = loader.loaderInfo;
    if (loaderInfo.data) {
        const symbols: Map<string, number> = loaderInfo.data.symbols;
        if (symbols.size) {
            for (const symbolName of symbols.keys()) {
                loaderInfoMap.set(symbolName, loaderInfo);
            }
        }
    }

    return requestResponseProcessService(request_object, content);
};
