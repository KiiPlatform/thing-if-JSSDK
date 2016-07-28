import {APIAuthor} from '../APIAuthor'
import {getSDKVersion} from '../ThingIFSDKInfo'
export default class BaseOp {
    private headers: Object;
    constructor(
        public au: APIAuthor
    ){
        let headers: any = {
            "X-Kii-SDK": `sn=jsi;sv=${getSDKVersion()}`
        }
        if (!!this.au.token) {
            headers["Authorization"] = `Bearer ${this.au.token}`;
        }
        this.headers = headers;
    }

    addHeaders(headers: Object): any{
        for(let key in headers) {
            if (headers.hasOwnProperty(key)){
                (<any>this.headers)[key] = (<any>headers)[key];
            }
        }
        return this.headers;
    }
    addHeader(key: string, value: string) {
        (<any>this.headers)[key] = value;
        return this.headers;
    }
    getHeaders(): Object {
        return this.headers;
    }
}