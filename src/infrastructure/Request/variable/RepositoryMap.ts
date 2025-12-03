import { execute as requestContentRepository } from "../repository/RequestContentRepository";
import { execute as requestCustomRepository } from "../repository/RequestCustomRepository";
import { execute as requestJsonRepository } from "../repository/RequestJsonRepository";

/**
 * @description リクエストタイプとリポジトリのマップ
 *              Map of request types and repositories
 *
 * @type {Map<string, Function>}
 * @protected
 */
export const repositoryMap: Map<string, Function> = new Map<string, Function>([
    ["json", requestJsonRepository],
    ["content", requestContentRepository],
    ["custom", requestCustomRepository]
]);
