import {TypedID} from './TypedID'
import * as KiiUtil from './internal/KiiUtilities'
/** Represent Command
 * @prop {string} commandID ID of command.
 * @prop {TypedID} targetID TypedID of command target.
 * @prop {TypedID} issuerID TypedID of issuer.
 * @prop {string} schema Name of the Schema of which this Command is defined.
 * @prop {number} schemaVersion Version of the Schema of which this Command is defined.
 * @prop {Array} actions Actions to be executed.
 * @prop {Array} actionResults Results of the action.
 * @prop {string} commandState State of the Command.
 * @prop {string} firedByTriggerID ID of the trigger which fired this command.
 * @prop {Date} created Creation time of the Command.
 * @prop {Date} modified Modification time of the Command.
 * @prop {string} title Title of the Command.
 * @prop {string} description Description of the Command.
 * @prop {Object} metadata Metadata of the Command.
*/
export class Command {
    public commandID: string;
    public targetID: TypedID;
    public issuerID: TypedID;
    public schema: string;
    public schemaVersion: number;
    public actions: Array<Object>;
    public actionResults: Array<Object>;
    public commandState:string;
    public firedByTriggerID:string;
    public created:Date;
    public modified:Date;
    public title:string;
    public description:string;
    public metadata:Object;

    constructor(
        targetID: TypedID,
        issuerID: TypedID,
        schema: string,
        schemaVersion: number,
        actions: Array<Object>
    ) {
        this.targetID = targetID;
        this.issuerID = issuerID;
        this.schema = schema;
        this.schemaVersion = schemaVersion;
        this.actions = actions;
    }

    toJson(): any {
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
        if(!!this.schema){
            jsonObject.schema = this.schema;
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
    static fromJson(obj: any): Command {
        if(!obj.target || !obj.issuer || !obj.schema || !obj.schemaVersion || !obj.actions){
            return null;
        }
        let command = new Command(
            TypedID.fromString(obj.target),
            TypedID.fromString(obj.issuer),
            obj.schema,
            obj.schemaVersion,
            obj.actions);
        command.commandID = obj.commandID;
        command.actionResults = obj.actionResults;
        command.commandState= obj.commandState;
        command.firedByTriggerID = obj.firedByTriggerID;
        command.title = obj.title;
        command.description = obj.description;
        command.metadata = obj.metadata;

        if(!!obj.createdAt){
            command.created = new Date(obj.createdAt);
        }
        if(!!obj.modifiedAt){
            command.modified = new Date(obj.createdAt);
        }
        return command;
    }
}

/** Represents state of command.
<ul>
  <li>CommandState.SENDING: commands is sedning.</li>
  <li>CommandState.DELIVERED: commands is delivered.</li>
  <li>CommandState.INCOMPLETE: commands is incompleted.</li>
  <li>CommandState.DONE: commands is handled.</li>
</ul>
*/
export const CommandState = {
    SENDING: "SENDING",
    DELIVERED: "DELIVERED",
    INCOMPLETE: "INCOMPLETE",
    DONE: "DONE"
}
