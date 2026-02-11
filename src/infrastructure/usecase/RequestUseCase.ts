import type { IRequest } from "../../interface/IRequest";
import type { ResponseDTO } from "../dto/ResponseDTO";
import { execute as routingRequestsParserService } from "../../application/service/RoutingRequestsParserService";
import { repositoryMap } from "../variable/RepositoryMap";

/**
 * @description ルーティング設定のリクエスト配列を取得
 *              Get request array from routing settings
 *
 * @param  {string} name
 * @return {IRequest[]}
 * @method
 * @public
 */
export const getRequests = (name: string): IRequest[] =>
{
    return routingRequestsParserService(name);
};

/**
 * @description Routing設定で指定したタイプへリクエストを並列実行
 *              Execute requests in parallel to the type specified in Routing settings
 *
 * @param  {string} name
 * @return {Promise<ResponseDTO[]>}
 * @method
 * @public
 */
export const execute = async (name: string): Promise<ResponseDTO[]> =>
{
    const requests = routingRequestsParserService(name);

    const promises: Promise<ResponseDTO>[] = [];
    for (let idx = 0; idx < requests.length; ++idx) {
        const requestObject = requests[idx];
        const repository = repositoryMap.get(requestObject.type);
        if (repository) {
            promises.push(repository(requestObject));
        }
    }

    return Promise.all(promises);
};
