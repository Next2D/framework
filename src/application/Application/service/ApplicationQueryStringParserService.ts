import type { IQueryObject } from "../../../interface/IQueryObject";
import { $getConfig } from "../../variable/Config";
import { query } from "../../variable/Query";
import { execute as applicationParseQueryStringService } from "./ApplicationParseQueryStringService";

/**
 * @description 指定されたQueryStringか、URLのQueryStringをquery mapに登録
 *              Register the specified QueryString or URL QueryString in the query map
 *
 * @param  {string} [name=""]
 * @return {IQueryObject}
 * @method
 * @protected
 */
export const execute = (name: string = ""): IQueryObject =>
{
    /**
     * 前のシーンのクエリデータを初期化
     * Initialize query data from previous scene
     */
    if (query.size) {
        query.clear();
    }

    /**
     * QueryStringがあれば分解
     * Disassemble QueryString if available
     */
    let queryString = "";
    if (!name && location.search) {
        queryString = location.search;
        applicationParseQueryStringService(queryString);
    }

    const config = $getConfig();
    const defaultTop = config?.defaultTop || "top";
    if (!name) {
        const names = location.pathname.split("/");
        names.shift();
        name = `${names.join("/")}`;
        if (name && config && config.routing) {
            const routing = config.routing[name];
            if (!routing) {
                name = defaultTop;
            }

            if (routing && routing.private) {
                name = routing.redirect || defaultTop;
            }
        }

        if (!name) {
            name = defaultTop;
        }
    }

    /**
     * 任意で設定したQueryStringを分解
     * Decompose an arbitrarily set QueryString
     */
    if (name.includes("?")) {
        const [baseName, qs] = name.split("?");
        name = baseName;
        queryString = `?${qs}`;
        applicationParseQueryStringService(qs);
    }

    if (name.startsWith(".")) {
        name = name.split("/").slice(1).join("/") || defaultTop;
    }

    if (name.includes("@")) {
        name = name.replace("@", "");
    }

    return {
        "name": name,
        "queryString": queryString
    };
};