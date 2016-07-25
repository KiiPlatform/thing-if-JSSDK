/** Represent the server code execution result */
export class ServerCodeResult{
    public succeeded: boolean;
    public returnedValue: Object;
    public executedAt: number;
    public endpoint: string;
    public error: ServerError;

    constructor(
        succeeded: boolean,
        returnedValue: Object,
        executedAt: number,
        endpoint: string,
        error: ServerError
    ) {
        this.succeeded = succeeded;
        this.returnedValue = returnedValue;
        this.executedAt = executedAt;
        this.endpoint = endpoint;
        this.error = error;
    }
    static fromJson(obj:any): ServerCodeResult {
        let succeeded = obj.succeeded;
        let returnedValue = obj.returnedValue ? obj.returnedValue : null;
        let executedAt = obj.executedAt ? obj.executedAt : null;
        let endpoint = obj.endpoint ? obj.endpoint : null;
        let error = obj.error ? ServerError.fromJson(obj.error) : null;
        return new ServerCodeResult(succeeded, returnedValue, executedAt, endpoint, error);
    }
}
export class ServerError {
    public errorCode: string;
    public errorMessage: string;
    public detailMessage: string;

    constructor(
        errorCode: string,
        errorMessage: string,
        detailMessage: string
    ) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.detailMessage = detailMessage;
    }
    static fromJson(obj:any): ServerError {
        let errorMessage = obj.errorMessage;
        let errorCode = obj.details ? obj.details.errorCode : null;
        let detailMessage = obj.details ? obj.details.message: null;
        return new ServerError(errorCode, errorMessage, detailMessage);
    }
}
