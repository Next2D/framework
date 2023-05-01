import { ConfigParser } from "@/domain/parser/ConfigParser";

interface Object {
    type: string;
    name: string;
    path: string;
    cache: boolean;
    class: string;
    access: string;
    method: string;
    callback: string;
    body?: object;
    headers?: HeadersInit;
}

/**
 * JSON取得時のリクエストとレスポンスの管理クラス
 * Request and Response management class for JSON acquisition
 *
 * @class
 */
export class JsonRepository
{
    /**
     * @description 指定先のJSONを非同期で取得
     *              Asynchronously obtain JSON of the specified destination
     *
     * @param  {object} object
     * @return {Promise}
     * @method
     * @public
     */
    execute (object: Object): Promise<any>
    {
        // @ts-ignore
        const { URLRequestMethod } = next2d.net;

        // @ts-ignore
        const parser: ConfigParser = next2d.fw.parser;

        const options: RequestInit = {};

        const method: string = options.method = object.method
            ? parser.execute(object.method).toUpperCase()
            : URLRequestMethod.GET;

        const body: any = object.body && (method === URLRequestMethod.POST || method === URLRequestMethod.PUT)
            ? JSON.stringify(object.body)
            : null;

        if (body) {
            options.body = body;
        }

        if (object.headers) {
            options.headers = object.headers;
        }

        return fetch(`${parser.execute(object.path)}`, options)
            .then((response: Response) =>
            {
                return response.json();
            })
            .catch((error: Error) =>
            {
                console.error(error);
            });
    }
}