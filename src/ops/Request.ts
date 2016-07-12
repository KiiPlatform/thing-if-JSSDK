/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/modules/popsicle/index.d.ts" />
import {Promise} from 'es6-promise';
import * as popsicle from 'popsicle';
import {RequestOptions} from '~popsicle/dist/request';
import {Response} from './Response'

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
export default function (options: Object, onCompletion?: (err: Error, res: Response)=>void): Promise<Response>{
    return new Promise<Object>((resolve, reject) => {
        popsicle.request(<RequestOptions>options)
        .then(function (res) {
            if (res.statusType() == 2) {
                var response: Response = new Response(res.status, res.body, res.headers);
                resolve(response);
                if (!!onCompletion){
                    onCompletion(null, response);
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
    })
}
export class ErrorBase {
    public name: string;
    public message: string;
    constructor() {
        Error.apply(this, arguments);
    }
}
ErrorBase.prototype = new Error();
export class HttpRequestError extends ErrorBase {
    public status: number;
    constructor (status: number, message: string) {
        super();
        this.message = message;
        this.status = status;
    }
}
