import {TypedID} from './TypedID'
import * as KiiUtil from './internal/KiiUtilities'
/** Represents Command */
export class Command {
    /**
     * @type {string}
     */
    public commandID: string;
    /**
     * ID of the target thing.
     * @type {TypedID}
     */
    public targetID: TypedID;
    /**
     * ID of the command issuer.
     * @type {TypedID}
     */
    public issuerID: TypedID;
    /**
     * Name of schema.
     * @type {string}
     */
    public schema: string;
    /**
     * Version number of schema.
     * @type {number}
     */
    public schemaVersion: number;
    /**
     * Array of actions of the command.
     * @type {Object[]}
     */
    public actions: Array<Object>;
    /**
     * Array of action results of the command.
     * @type {Object[]}
     */
    public actionResults: Array<Object>;
    /**
     * State of the command.
     * @type {string}
     */
    public commandState:string;
    /**
     * ID of the trigger if command invoked by trigger.
     * @type {string}
     */
    public firedByTriggerID:string;
    /**
     * Timestamp of the creation of the command.
     * @type {Date}
     */
    public created:Date;
    /**
     * Timestamp of the modification of the command.
     * @type {Date}
     */
    public modified:Date;
    /**
     * Title of the command.
     * @type {string}
     */
    public title:string;
    /**
     * Description of the command.
     * @type {string}
     */
    public description:string;
    /**
     * Key-value list to store within command definition.
     * @type {Object}
     */
    public metadata:Object;

    /**
     * Create a command.
     * @constructor
     * @param {TypedID} targetID ID of the target thing.
     * @param {TypedID} issuerID ID of the command issuer.
     * @param {string} schema Name of schema.
     * @param {number} schemaVersion Version number of schema.
     * @param {Object[]} actions Array of actions of the command.
     */
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

/** Represents Command State */
export const CommandState = {
    SENDING: "SENDING",
    DELIVERED: "DELIVERED",
    INCOMPLETE: "INCOMPLETE",
    DONE: "DONE"
}