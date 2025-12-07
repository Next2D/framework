import type { IRequest } from "../../interface/IRequest";
import type { ResponseDTO } from "../dto/ResponseDTO";
import { execute as contentRepository } from "../repository/ContentRepository";
import { execute as customRepository } from "../repository/CustomRepository";
import { execute as jsonRepository } from "../repository/JsonRepository";

/**
 * @description リポジトリ実行関数の型
 *              Type for repository executor function
 */
type RepositoryExecutor = (request: IRequest) => Promise<ResponseDTO>;

/**
 * @description リクエストタイプとリポジトリのマップ
 *              Map of request types and repositories
 *
 * @type {Map<string, RepositoryExecutor>}
 * @protected
 */
export const repositoryMap: Map<string, RepositoryExecutor> = new Map([
    ["json", jsonRepository],
    ["content", contentRepository],
    ["custom", customRepository]
]);
