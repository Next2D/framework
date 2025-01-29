import type { IStage } from "./IStage";
import type { IRouting } from "./IRouting";
import type { IGotoView } from "./IGotoView";

interface IBaseConfig {
    [key: string]: any
}

export interface IConfig extends IBaseConfig {
    platform: string;
    stage: IStage;
    routing?: {
        [key: string]: IRouting
    };
    defaultTop?: string;
    spa: boolean;
    loading?: {
        callback: string;
    };
    gotoView?: IGotoView;
}