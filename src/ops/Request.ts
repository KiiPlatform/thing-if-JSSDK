/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/modules/popsicle/index.d.ts" />
import {Promise} from 'es6-promise';
import * as popsicle from 'popsicle';
import {RequestOptions} from '~popsicle/dist/request';


/**
 * Perform an asynchronous HTTP request.
 *
 * @param {Object} options
 *    <ul>
 *      <li>method:The HTTP method to use for the request (e.g. "POST", "GET", "PUT").</li>
 *      <li>url:A string containing the URL to which the request is sent.</li>
 *      <li>body:Data to be sent to the server.</li>
 *      <li>headers:An object of http header key/value pairs to send along with requests.</li>
 *    </ul>
 * @param {onCompletion} [onCompletion] callback function when completed
 * @return {Promise} promise object 
 */
export default function (options: Object, onCompletion?: (err: Error, res: Object)=>void): Promise<Object>{
    return new Promise<Object>((resolve, reject) => {
        popsicle.request(<RequestOptions>options)
        .then(function (res) {
            if (isSucceeded(res.status)) {
                resolve(res);
                if (!!onCompletion){
                    onCompletion(null, res);
                }
            } else {
                var err: Error = new HttpRequestError(res.status, res.body);
                reject(err);
                if (!!onCompletion){
                    onCompletion(err, null);
                }
            }
        }).catch(function (err) {
            reject(err);
            if (!!onCompletion){
                onCompletion(err, null);
            }
        });
        //2. parse response
    })
}
function isSucceeded(status: number): boolean {
    if (status >= 200 && status < 300) {
        return true;
    }
    return false;
}
declare class BaseError implements Error {
    public name: string;
    public message: string;
    constructor(message?: string);
}
class HttpRequestError extends BaseError {
    constructor (status: number, message: string) {
        super();    
    }
}