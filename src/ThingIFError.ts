
export const Errors = {
    HttpError: "HttpRequestError"
}

export class ThingIFError {
    public name: string;
    public message: string;
    constructor() {
        Error.apply(this, arguments);
    }
}
ThingIFError.prototype = new Error();

export class HttpRequestError extends ThingIFError {
    public status: number;
    constructor (status: number, message: string) {
        super();
        this.name = Errors.HttpError;
        this.message = message;
        this.status = status;
    }
}