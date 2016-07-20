/** Represent the server code execution result */
export class ServerCodeResult{
    constructor(
        public succeeded: boolean,
        public returnedValue: Object,
        public executedAt: number,
        public endpoint: string,
        public error: ServerError
    ) {}
}
export class ServerError {
    constructor(
        public errorCode: string,
        public errorMessage: string,
        public detailMessage: string
    ) {}
}
