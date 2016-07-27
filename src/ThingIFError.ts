/** Represents types of error
<ul>
    <li>Errors.ArgumentError: error caused by invalid arguments.</li>
    <li>Errors.HttpError: error caused when doing http request to kii server.</li>
    <li>Errors.IlllegalStateError: error caseud of illlegal states. </li>
</ul>
*/
export const Errors = {
    ArgumentError: "ArgumentError",
    HttpError: "HttpRequestError",
    IlllegalStateError: "IlllegalStateError"
}

export class ThingIFError extends Error {
    public name: string;
    public message: string;
    constructor(name: string, message:string) {
        super(message);
        this.name = name;
        this.message = message;
    }
}

export class HttpRequestError extends ThingIFError {
    public status: number;
    public body: Object;
    constructor (status: number, message: string, body?: Object) {
        super(Errors.HttpError, message);
        this.status = status;
        this.body = body;
    }
}