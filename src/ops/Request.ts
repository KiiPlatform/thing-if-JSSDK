/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/modules/popsicle/index.d.ts" />
import {Promise} from 'es6-promise';
import * as popsicle from 'popsicle';
import {RequestOptions} from '~popsicle/dist/request';

import {Response} from './Response'
import {HttpRequestError, ThingIFError, Errors} from '../ThingIFError'
import * as KiiUtil from '../internal/KiiUtilities'
import { Logger } from '../Logger';

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
export default function (options: Object): Promise<Response>{
    let logger = Logger.getInstance();
    logger.logHttpRequest("debug", options);
    return new Promise<Response>((resolve, reject) => {
        popsicle.request(<RequestOptions>options)
        .use(popsicle.plugins.parse(['json'], false))
        .then(function (res) {
            logger.log("debug", "response: " + JSON.stringify(res));
            if (res.statusType() == 2) {
                var response: Response = new Response(res.status, res.body, res.headers);
                resolve(response);
            } else {
                var err: Error
                if(KiiUtil.isObject(res.body)){
                   err = new HttpRequestError(res.status, res.body.message, res.body);
                }else{
                    err = new HttpRequestError(res.status, "", res.body);
                }
                reject(err);
            }
        }).catch(function (err) {
            if(err instanceof popsicle.PopsicleError){
                reject(new ThingIFError(Errors.NetworkError, err.message, err));
                return;
            }
            reject(err);
        });
    })
}
