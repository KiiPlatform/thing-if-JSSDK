/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/modules/popsicle/index.d.ts" />
import {Promise} from 'es6-promise';
import {request as Popsicle} from 'popsicle'

export default function (options: Object, onCompletion?: (err: Error, res: Object)=>void): Promise<Object>{

//TODO: verify options
return new Promise<Object>((resolve: (res:Object)=>void, reject: (err:Error)=>void) => {
    Popsicle({
        method: (<any>options)["method"],
        headers:(<any>options)["headers"],
        url: (<any>options)["url"],
        body: (<any>options)["body"],
    }).exec((err, res)=>{
        if (!!err) {
            reject(err);
            return;
        }
        if(res.status < 200 || res.status >= 300) {
            let err = new Error();
            if (!!res.body['errorCode']){
                err.name = res.body['errorCode'];
            }
            if (!!res.body['message']){
                err.message = res.body['message'];
            }
            reject(err);
            return
        }
        resolve(res.body);
    });
    });
}