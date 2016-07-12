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