import type { ResponseDTO } from "../infrastructure/Response/dto/ResponseDTO";
import type { View } from "../view/View";
import type { IConfig } from "../interface/IConfig";
import type { IQueryObject } from "../interface/IQueryObject";
import type { IPackages } from "../interface/IPackages";
import { execute as queryParser } from "./Application/service/QueryParser";
import { execute as requestUseCase } from "../infrastructure/Request/usecase/RequestUseCase";
import { execute as callback } from "../domain/callback/Callback";
import { execute as removeResponse } from "../infrastructure/Response/usecase/RemoveResponse";
import { response } from "../infrastructure/Response/variable/Response";
import { execute as applicationInitializeService } from "./Application/service/ApplicationInitializeService";
import { execute as applicationGotoViewUseCase } from "./Application/usecase/ApplicationGotoViewUseCase";
import { $getConfig } from "./variable/Config";
import {
    execute as captureExecute,
    dispose as captureDispose
} from "../domain/screen/Capture";
import {
    context,
    $createContext
} from "./variable/Context";
import {
    start as loadingStart,
    end as loadingEnd
} from "../domain/loading/Loading";

/**
 * @description シーン遷移のコントロールを行うクラス。
 *              Class for controlling scene transitions.
 *
 * @class
 * @memberof application
 */
export class Application
{
    /**
     * @description SPAの遷移かどうかを判定します
     *             Determines whether it is a transition of SPA
     *
     * @type {boolean}
     * @default false
     * @public
     */
    public popstate: boolean;

    /**
     * @description 現在の画面名
     *             Current screen name
     *
     * @type {string}
     * @default "top"
     * @public
     */
    public currentName: string;

    /**
     * @constructor
     * @public
     */
    constructor ()
    {
        this.popstate    = false;
        this.currentName = "top";
    }

    /**
     * @description 初期起動関数
     *              initial invoking function
     *
     * @return {Application}
     * @method
     * @public
     */
    initialize (config: IConfig, packages: IPackages): Application
    {
        return applicationInitializeService(this, config, packages);
    }

    /**
     * @description Next2Dのアプリを起動します
     *              Launch the Next2D application
     *
     * @return {Promise<void>}
     * @method
     * @public
     */
    async run (): Promise<void>
    {
        $createContext($getConfig());
    }

    /**
     * @description 指定のViewを起動して、描画を開始します。引数を指定しない場合はURLをパースしてViewを起動します。
     *              Launches the specified View and starts drawing. If no argument is specified,
     *              the URL will be parsed and the View will be launched.
     *
     * @param  {string} [name=""]
     * @return {Promise<void>}
     * @method
     * @public
     */
    async gotoView (name: string = ""): Promise<void>
    {
        applicationGotoViewUseCase(this, name);
    }
}