/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/modules/popsicle/index.d.ts" />
import {Promise} from 'es6-promise';
import * as popsicle from 'popsicle';
import {RequestOptions} from '~popsicle/dist/request';


export default function (options: Object, onCompletion?: (err: Error, res: Object)=>void): Promise<Object>{
    return new Promise<Object>((resolve, reject) => {
        //TODO: implment me
        
        popsicle.request(<RequestOptions>options)
        .then(function (res) {
            resolve(res);
            if (!!onCompletion){
                onCompletion(null, res);
            }
        }).catch(function (err) {
            reject({});
            if (!!onCompletion){
                onCompletion(err, null);
            }
        });

        //1. check status code
        //2. parse response
    })
}