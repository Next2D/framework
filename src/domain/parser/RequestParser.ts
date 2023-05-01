import { RequestType } from "@/infrastructure/constant/RequestType";

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
 * @class
 */
export class RequestParser
{
    /**
     * @description
     *
     * @param  {string} name
     * @return {array}
     * @method
     * @public
     */
    execute (name: string): Object[]
    {
        // @ts-ignore
        const config: any = next2d.fw.config;

        const routing: any = config.routing[name];
        if (!routing || !routing.requests) {
            return [];
        }

        const requests: Object[] = [];
        for (let idx = 0; idx < routing.requests.length; idx++) {

            const object: Object = routing.requests[idx];

            if (object.type !== RequestType.CLUSTER) {
                requests.push(object);
                continue;
            }

            const results: Object[] = new RequestParser().execute(object.path);
            for (let idx = 0; idx < results.length; ++idx) {
                requests.push(results[idx]);
            }
        }

        return requests;
    }
}