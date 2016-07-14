/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise';

export default function kiiPromise(
    orgPromise: P<any>,
    onCompletion?: (err: Error, res: any)=>void): P<any> {
    if (!!onCompletion) {
        return new P<any>((resolve, reject)=>{
            orgPromise.then(
                (res)=>{
                    onCompletion(null, res);
                    resolve(res);
                },
                (err)=>{
                    onCompletion(err, null);
                    reject(err);
                }
            )
        });
    }else{
        return orgPromise;
    }
}
