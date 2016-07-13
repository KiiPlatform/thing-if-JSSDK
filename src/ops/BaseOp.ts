import {APIAuthor} from '../APIAuthor'
import {getSDKVersion} from '../ThingIFSDK'
export default class BaseOp {
    private headers: any;
    constructor(
        public au: APIAuthor
    ){
        this.headers = {
            "X-Kii-SDK": getSDKVersion()
        }
        if (!!this.au.token) {
            this.headers["Authorization"] = `Bearer ${this.au.token}`;
        }
    }

    addHeaders(headers: Object): any{
        for(let key in headers) {
            if (headers.hasOwnProperty(key)){
                this.headers[key] = (<any>headers)[key];
            }
        }
        return this.headers;
    }
    addHeader(key: string, value: string) {
        this.headers[key] = value;
        return this.headers;
    }
    getHeaders(): any {
        return this.headers;
    }
}