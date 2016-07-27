/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/modules/popsicle/index.d.ts" />
import {Promise} from 'es6-promise';
import * as popsicle from 'popsicle';
import {RequestOptions} from '~popsicle/dist/request';
import PopsicleError from '~popsicle/dist/error';

import {Response} from './Response'
import {HttpRequestError, ThingIFError, Errors} from '../ThingIFError'

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
    return new Promise<Response>((resolve, reject) => {
        popsicle.request(<RequestOptions>options)
        .then(function (res) {
            if (res.statusType() == 2) {
                var response: Response = new Response(res.status, res.body, res.headers);
                resolve(response);
            } else {
                var err: Error = new HttpRequestError(res.status, res.body.message, res.body);
                reject(err);
            }
        }).catch(function (err) {
            if(err instanceof PopsicleError){
                if(err.code == "EUNAVAILABLE"){
                    reject(new ThingIFError(Errors.NetworkError, "network connect error"));
                    return;
                }
            }
            reject(err);
        });
    })
}
