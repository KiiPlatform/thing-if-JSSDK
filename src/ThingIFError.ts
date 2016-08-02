import * as KiiUtil from './internal/KiiUtilities'
import * as makeErrorCause from 'make-error-cause'

/** Represents types of error
<ul>
    <li>Errors.ArgumentError: error caused by invalid arguments.</li>
    <li>Errors.HttpError: error caused when doing http request to kii server.</li>
    <li>Errors.IlllegalStateError: error caseud of illlegal states. </li>
    <li>Errors.NetworkError: error caseud of network connection. </li>
</ul>
*/
export const Errors = {
    ArgumentError: "ArgumentError",
    HttpError: "HttpRequestError",
    IlllegalStateError: "IlllegalStateError",
    NetworkError: "NetworkError"
}

/** Represent error caught by thing-if sdk.
 * @prop {string} name Name of ThingIFError. It is defined in {@link Errors}.
 *  If it is not one of defined error, then it is unknown error.
 * @prop {string} message Message of ThingIFError.
*/
export class ThingIFError extends makeErrorCause.BaseError {
    public name: string;
    public message: string;
    constructor(name: string, message:string, original?: Error) {
        super(message, original);
        this.name = name;
    }
}

/** Represent body of error response from server.
 * @prop {string} errorCode errorCode of response.
 * @prop {string} message error message of response.
 * @prop {string} rawData response body as string.
*/
export class ErrorResponseBody {
    public errorCode: string;
    public message: string;
    public rawData: string;
    constructor(errorCode: string, message: string, rawData: string){
        this.errorCode = errorCode,
        this.message = message;
        this.rawData = rawData;
    }
}

/** Represents http error.
 * @prop {number} status Status code of error reponse.
 * @prop {ErrorResponseBody} body ErrorResponseBody instance
*/
export class HttpRequestError extends ThingIFError {
    public status: number;
    public body: ErrorResponseBody;
    constructor (status: number, message: string, body?: string|Object) {
        super(Errors.HttpError, message);
        this.status = status;
        if (KiiUtil.isObject(body)){
            this.body = new ErrorResponseBody(
                (<any>body).errorCode,
                (<any>body).message,
                JSON.stringify(body));
        }else if(KiiUtil.isString(body)){
            this.body = new ErrorResponseBody(null, null, <string>body)
        }
    }
}