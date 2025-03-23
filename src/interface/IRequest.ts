import type { IRequestType } from "./IRequestType";

export interface IRequest {
    type: IRequestType;
    path?: string;
    name?: string;
    cache?: boolean;
    callback?: string | string[any];
    class?: string;
    access?: string;
    method?: string;
    headers?: HeadersInit;
    body?: any;
}