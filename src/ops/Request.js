"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/modules/popsicle/index.d.ts" />
var es6_promise_1 = require('es6-promise');
var popsicle = require('popsicle');
var Response_1 = require('./Response');
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
function default_1(options, onCompletion) {
    return new es6_promise_1.Promise(function (resolve, reject) {
        popsicle.request(options)
            .then(function (res) {
            if (res.statusType() == 2) {
                var response = new Response_1.Response(res.status, res.body, res.headers);
                resolve(response);
                if (!!onCompletion) {
                    onCompletion(null, response);
                }
            }
            else {
                var err = new HttpRequestError(res.status, res.body);
                reject(err);
                if (!!onCompletion) {
                    onCompletion(err, null);
                }
            }
        }).catch(function (err) {
            reject(err);
            if (!!onCompletion) {
                onCompletion(err, null);
            }
        });
    });
}
exports.__esModule = true;
exports["default"] = default_1;
var ErrorBase = (function () {
    function ErrorBase() {
        Error.apply(this, arguments);
    }
    return ErrorBase;
}());
exports.ErrorBase = ErrorBase;
ErrorBase.prototype = new Error();
var HttpRequestError = (function (_super) {
    __extends(HttpRequestError, _super);
    function HttpRequestError(status, message) {
        _super.call(this);
        this.message = message;
        this.status = status;
    }
    return HttpRequestError;
}(ErrorBase));
exports.HttpRequestError = HttpRequestError;
