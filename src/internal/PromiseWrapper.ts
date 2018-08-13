
import {Promise as P} from 'es6-promise';

export function promise(
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

export function voidPromise(
    orgPromise: P<void>,
    onCompletion?: (err: Error)=>void): P<void> {
    if (!!onCompletion) {
        return new P<void>((resolve, reject)=>{
            orgPromise.then(
                (res)=>{
                    onCompletion(null);
                    resolve();
                },
                (err)=>{
                    onCompletion(err);
                    reject(err);
                }
            )
        });
    }else{
        return orgPromise;
    }
}
