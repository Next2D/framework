import type { ResponseDTO } from "../../Response/dto/ResponseDTO";
import { execute as configParserRequestsPropertyService } from "../../../application/Config/service/ConfigParserRequestsPropertyService";
import { repositoryMap } from "../variable/RepositoryMap";

/**
 * @description Routing設定で指定したタイプへリクエストを実行
 *              Execute requests to the type specified in Routing settings
 *
 * @param  {string} name
 * @return {Promise<ResponseDTO[]>}
 * @method
 * @public
 */
export const execute = async (name: string): Promise<ResponseDTO[]> =>
{
    const responses: ResponseDTO[] = [];
    const requests = configParserRequestsPropertyService(name);

    for (const requestObject of requests) {
        const repository = repositoryMap.get(requestObject.type);
        if (!repository) {
            continue;
        }

        const response = await repository(requestObject);
        if (response) {
            responses.push(response);
        }
    }

    return responses;
};