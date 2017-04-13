import {TypedID} from './TypedID'
import * as KiiUtil from './internal/KiiUtilities'
import { AliasAction } from './AliasAction';
import { AliasActionResult } from './AliasActionResult';
/**
 * Represents Command
 * @prop {string} commandID ID of command.
 * @prop {TypedID} targetID ID of the target thing.
 * @prop {TypedID} issuerID ID of the command issuer.
 * @prop {AliasAction[]} aliasActions Array of actions of the command.
 * @prop {AliasActionResult[]} aliasActionResults Array of action results of the command.
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
    public aliasActions: Array<AliasAction>;
    public aliasActionResults: Array<AliasActionResult>;
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
     * @param {AliasAction[]} aliasActions Array of actions of the command.
     */
    constructor(
        targetID: TypedID,
        issuerID: TypedID,
        aliasActions: Array<AliasAction>
    ) {
        this.targetID = targetID;
        this.issuerID = issuerID;
        this.aliasActions = aliasActions;
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
        if(!!this.aliasActions){
            jsonObject.actions = this.aliasActions;
        }
        if(!!this.aliasActionResults){
            jsonObject.actionResults = this.aliasActionResults;
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
        if(!obj.target || !obj.issuer || !obj.actions){
            return null;
        }
        let command = new Command(
            TypedID.fromString(obj.target),
            TypedID.fromString(obj.issuer),
            obj.actions);
        command.commandID = obj.commandID;
        command.aliasActionResults = obj.actionResults;
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

    /**
     * Retrieve aliasAction with specified alias.
     * @param {string} alias alias name. 
     * @return {Array<AliasAction>} Found array of AliasAction object. If there is not
     * AliasActon object with the specified alias, empty array returned.
     */
    getAliasActions(alias: string): Array<AliasAction> {
        let foundAliasActions: Array<AliasAction> = [];
        for(let aliasAction of this.aliasActions) {
            if(aliasAction.alias === alias) {
                foundAliasActions.push(aliasAction);
            }
        }
        return foundAliasActions;
    }

    /**
     * Retrieve aliasAction result with specified alias.
     * @param {string} alias alias name. 
     * @return {Array<AliasActionResult>} Found array of AliasActionResult object. If there is not
     * AliasActionResult object with the specified alias, empty array returned. 
     */
    getAliasActionResults(alias: string): Array<AliasActionResult> {
        let foundAliasResults: Array<AliasActionResult> = [];
        for(let aliasResult of this.aliasActionResults) {
            if(aliasResult.alias === alias) {
                foundAliasResults.push(aliasResult);
            }
        }
        return foundAliasResults;
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