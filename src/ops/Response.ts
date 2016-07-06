export class Response {
    public status: number;
    public body: Object;
    public headers: Object;

    constructor(status: number, body: Object, headers: Object) {
        this.status = status;
        this.body = body;
        this.headers = headers;
    }
    isSucceeded(): boolean {
        if (this.status >= 200 && this.status < 300) {
            return true;
        }
        return false;
    }
}