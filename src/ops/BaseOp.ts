import {APIAuthor} from '../APIAuthor'
import {getSDKVersion} from '../ThingIFSDK'
export default class BaseOp {
    private headers: Object;
    constructor(
        public au: APIAuthor
    ){
        let headers: any = {
            "X-Kii-SDK": getSDKVersion()
        }
        if (!!this.au.token) {
            headers["Authorization"] = `Bearer ${this.au.token}`;
        }
    }

    addHeaders(headers: Object): Object{
        for(let key in headers) {
			if (headers.hasOwnProperty(key)){
				(<any>this.headers)[key] = (<any>headers)[key];
			}
		}
        return this.headers;
    }
    getHeaders(): Object {

        return this.headers;
    }
}