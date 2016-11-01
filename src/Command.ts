import {TypedID} from './TypedID'
import * as KiiUtil from './internal/KiiUtilities'
/**
 * Represents Command
 * @prop {string} commandID ID of command.
 * @prop {TypedID} targetID ID of the target thing.
 * @prop {TypedID} issuerID ID of the command issuer.
 * @prop {string} schema Name of schema.
 * @prop {number} schemaVersion Version number of schema.
 * @prop {Object[]} actions Array of actions of the command.
 * @prop {Object[]} actionResults Array of action results of the command.
 * @prop {string} commandState State of the command.
 * @prop {string} firedByTriggerID ID of the trigger if command invoked by trigger.
 * @prop {Date} created Timestamp of the creation of the command.
 * @prop {Date} modified Timestamp of the modification of the command.
 * @prop {string} title Title of the command.
 * @prop {string} description Description of the command.
 * @prop {Object} metadata Key-value list to store within command definition.
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

    /**
     * Create a command.
     * @constructor
     * @param {TypedID} targetID ID of the target thing.
     * @param {TypedID} issuerID ID of the command issuer.
     * @param {Object[]} actions Array of actions of the command.
     */
    constructor(
        targetID: TypedID,
        issuerID: TypedID,
        actions: Array<Object>
    ) {
        this.targetID = targetID;
        this.issuerID = issuerID;
        this.actions = actions;
    }

    /**
     * This method is for internal use only.
     * @return {Object} JSON object that represented this instance.
     */
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
    /**
     * This method is for internal use only.
     * @param obj JSON object that represented a command.
     * @return {Command} Command instance
     */
    static fromJson(obj: any): Command {
        if(!obj.target || !obj.issuer || !obj.schema || !obj.schemaVersion || !obj.actions){
            return null;
        }
        let command = new Command(
            TypedID.fromString(obj.target),
            TypedID.fromString(obj.issuer),
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
            command.modified = new Date(obj.modifiedAt);
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