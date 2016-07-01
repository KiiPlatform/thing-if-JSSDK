/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';

export default function (options: Object, onCompletion?: (err: Error, res: Object)=>void): Promise<Object>{
    return new Promise<Object>((resolve, reject) => {
        //TODO: implment me
        resolve({});
        if (!!onCompletion){
            onCompletion(null, {});
        }
        //1. check status code
        //2. parse response
    })
}