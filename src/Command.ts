import {TypedID} from './TypedID'
/** Represent Command */
export class Command {
    constructor(
        public commandID: string,
        public targetID: TypedID,
        public issuerID: TypedID,
        public schemaName: string,
        public schemaVersion: number,
        public actions: Array<Object>,
        public actionResults?: Array<Object>,
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