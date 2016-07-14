
export const Errors = {
    ArgumentError: "ArgumentError",
    HttpError: "HttpRequestError"
}

export class ThingIFError {
    public name: string;
    public message: string;
    constructor(name: string, message:string) {
        // Error.apply(this, arguments);
        this.name = name;
        this.message = message;
    }
}
ThingIFError.prototype = new Error();

export class HttpRequestError extends ThingIFError {
    public status: number;
    public body: Object;
    constructor (status: number, message: string, body?: Object) {
        super(Errors.HttpError, message);
        this.status = status;
        this.body = body;
    }
}