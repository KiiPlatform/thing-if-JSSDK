/**
 * Represents the server code execution result
 * @prop {boolean} succeeded Whether the invocation succeeded.
 * @prop {Object} returnedValue Returned value of Server Code execution.
 * @prop {number} executedAt Timestamp of the execution.
 * @prop {string} endpoint The endpoint used in the server code.
 * @prop {ServerError} error Error object of the invocation if any.
 */
export class ServerCodeResult{
    public succeeded: boolean;
    public returnedValue: Object;
    public executedAt: number;
    public endpoint: string;
    public error: ServerError;

    /**
     * Create a ServerCodeResult.
     * @constructor
     * @param {boolean} succeeded Whether the invocation succeeded.
     * @param {Object} returnedValue Returned value of Server Code execution.
     * @param {number} executedAt Timestamp of the execution.
     * @param {string} endpoint The endpoint used in the server code.
     * @param {ServerError} [error] Error object of the invocation if any.
     */
    constructor(
        succeeded: boolean,
        returnedValue: Object,
        executedAt: number,
        endpoint: string,
        error?: ServerError
    ) {
        this.succeeded = succeeded;
        this.returnedValue = returnedValue;
        this.executedAt = executedAt;
        this.endpoint = endpoint;
        this.error = error;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a ServerCodeResult.
     * @return {ServerCodeResult} ServerCodeResult instance
     */
    static fromJson(obj:any): ServerCodeResult {
        let succeeded = obj.succeeded;
        let returnedValue = obj.returnedValue ? obj.returnedValue : null;
        let executedAt = obj.executedAt ? obj.executedAt : null;
        let endpoint = obj.endpoint ? obj.endpoint : null;
        let error = obj.error ? ServerError.fromJson(obj.error) : null;
        return new ServerCodeResult(succeeded, returnedValue, executedAt, endpoint, error);
    }
}
/**
 * Represents the error that is occurred on server code.
 */
export class ServerError {
    /**
     * Code of error.
     * @prop {string}
     */
    public errorCode: string;
    /**
     * Message of error.
     * @prop {string}
     */
    public errorMessage: string;
    /**
     * Detail message of error.
     * @prop {string}
     */
    public detailMessage: string;

    /**
     * Create a ServerError.
     * @constructor
     * @param {string} errorCode Code of error.
     * @param {string} errorMessage Message of error.
     * @param {string} detailMessage Detail message of error.
     */
    constructor(
        errorCode: string,
        errorMessage: string,
        detailMessage: string
    ) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.detailMessage = detailMessage;
    }
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a ServerError.
     * @return {ServerError} ServerError instance
     */
    static fromJson(obj:any): ServerError {
        let errorMessage = obj.errorMessage;
        let errorCode = obj.details ? obj.details.errorCode : null;
        let detailMessage = obj.details ? obj.details.message: null;
        return new ServerError(errorCode, errorMessage, detailMessage);
    }
}
