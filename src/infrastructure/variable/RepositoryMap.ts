import { execute as contentRepository } from "../repository/ContentRepository";
import { execute as customRepository } from "../repository/CustomRepository";
import { execute as jsonRepository } from "../repository/JsonRepository";

/**
 * @description リクエストタイプとリポジトリのマップ
 *              Map of request types and repositories
 *
 * @type {Map<string, Function>}
 * @protected
 */
export const repositoryMap: Map<string, Function> = new Map<string, Function>([
    ["json", jsonRepository],
    ["content", contentRepository],
    ["custom", customRepository]
]);
