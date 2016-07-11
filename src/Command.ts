/** Represent Command */
export class Command {
    constructor(
        public commandID: string,
        public targetID: string,
        public issuerID: string,
        public schemaName: string,
        public schemaVersion: number,
        public actions: Object,
        public actionResults: Object,
        public commandState?:CommandState,
        public firedByTriggerID?:string,
        public created?:Date,
        public modified?:Date,
        public title?:string,
        public description?:string,
        public metadata?:Object
    ){}
}

export enum CommandState {
    Sending,
    Delivered,
    Incomplete,
    Done
}