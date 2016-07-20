import {TypedID} from './TypedID'
import * as KiiUtil from './internal/KiiUtilities'
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
        public commandState?:string,
        public firedByTriggerID?:string,
        public created?:Date,
        public modified?:Date,
        public title?:string,
        public description?:string,
        public metadata?:Object
    ){}
    static newCommand(targetID: TypedID, issuerID: TypedID, schemaName: string, schemaVersion: number, actions: Array<Object>): Command {
        return new Command(null, targetID, issuerID, schemaName, schemaVersion, actions);
    }
    toJson(): any{
        var jsonObject: any ={};
        if(!!this.commandID){
            jsonObject.commandID = this.commandID
        }
        if(!!this.targetID){
            jsonObject.target = this.targetID.toString();
        }
        if(!!this.issuerID){
            jsonObject.issuer = this.issuerID.toString();
        }
        if(!!this.schemaName){
            jsonObject.schema = this.schemaName;
        }
        if(!!this.schemaVersion){
            jsonObject.schemaVersion = this.schemaVersion;
        }
        if(!!this.actions){
            jsonObject.actions = this.actions;
        }
        if(!!this.actionResults){
            jsonObject.actionResults = this.actionResults;
        }
        if(!!this.title){
            jsonObject.title = this.title;
        }
        if(!!this.description){
            jsonObject.description = this.description;
        }
        if(!!this.metadata){
            jsonObject.metadata = this.metadata;
        }
        return jsonObject;
    }
    static fromJson(obj: any): Command{
        if(!obj.target || !obj.issuer || !obj.schema || !obj.schemaVersion || !obj.actions){
            return null;
        }
        let command = new Command(
            obj.commandID,
            TypedID.fromString(obj.target),
            TypedID.fromString(obj.issuer),
            obj.schema,
            obj.schemaVersion,
            obj.actions);
        if(!!obj.actionResults){
            command.actionResults = obj.actionResults;
        }
        if(!!obj.commandState){
            command.commandState= obj.commandState;
        }
        if(!!obj.firedByTriggerID){
            command.firedByTriggerID = obj.firedByTriggerID;
        }
        if(!!obj.createdAt){
            command.created = new Date(obj.createdAt);
        }
        if(!!obj.modifiedAt){
            command.modified = new Date(obj.createdAt);
        }
        if(!!obj.title){
            command.title = obj.title;
        }
        if(!!obj.description){
            command.description = obj.description;
        }
        if(!!obj.metadata){
            command.metadata = obj.metadata;
        }
        return command;
    }
}

export const CommandState = {
    SENDING: "SENDING",
    DELIVERED: "DELIVERED",
    INCOMPLETE: "INCOMPLETE",
    DONE: "DONE"
}