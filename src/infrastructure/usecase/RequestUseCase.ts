import { RequestType } from "@/infrastructure/constant/RequestType";
import { ContentService } from "@/infrastructure/service/ContentService";
import { CustomService } from "@/infrastructure/service/CustomService";
import { JsonService } from "@/infrastructure/service/JsonService";
import { Callback } from "@/domain/callback/Callback";
import { RequestParser } from "@/domain/parser/RequestParser";
import { ConfigParser } from "@/domain/parser/ConfigParser";
import { ResponseDTO } from "@/infrastructure/dto/ResponseDTO";

interface Object {
    type: string;
    name: string;
    path: string;
    cache: boolean;
    class: string;
    access: string;
    method: string;
    callback: string;
}

/**
 * ページの切り替え時の外部リクエストクラス
 * External request class when switching pages
 *
 * @class
 */
export class RequestUseCase
{
    private readonly _$callback: Callback;
    private readonly _$contentService: ContentService;
    private readonly _$customService: CustomService;
    private readonly _$jsonService: JsonService;
    private readonly _$requestParser: RequestParser;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        /**
         * @type {Callback}
         * @private
         */
        this._$callback = new Callback();

        /**
         * @type {ContentService}
         * @private
         */
        this._$contentService = new ContentService();

        /**
         * @type {CustomService}
         * @private
         */
        this._$customService = new CustomService();

        /**
         * @type {JsonService}
         * @private
         */
        this._$jsonService = new JsonService();

        /**
         * @type {RequestParser}
         * @private
         */
        this._$requestParser = new RequestParser();
    }

    /**
     * @description Routing設定で指定したタイプへリクエストを実行
     *              Execute requests to the type specified in Routing settings
     *
     * @param  {string} name
     * @return {Promise<ResponseDTO|void>[]}
     * @method
     * @public
     */
    execute (name: string): Promise<ResponseDTO|void>[]
    {
        // @ts-ignore
        const parser: ConfigParser = next2d.fw.parser;

        const promises: Promise<ResponseDTO|void>[] = [];
        const requests: Object[] = this._$requestParser.execute(name);
        for (let idx:number = 0; idx < requests.length; ++idx) {

            const object: Object = requests[idx];
            switch (parser.execute(object.type)) {

                case RequestType.CUSTOM:
                    promises.push(
                        this._$customService.execute(object)
                    );
                    break;

                case RequestType.JSON:
                    promises.push(
                        this._$jsonService.execute(object)
                    );
                    break;

                default:
                    promises.push(this._$contentService.execute(object));
                    break;

            }
        }

        return promises;
    }
}