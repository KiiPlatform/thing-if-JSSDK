import {Command} from './Command';
import {ServerCode} from './ServerCode';
import {Predicate} from './Predicate'

/**
 * Represent Trigger
 * @prop {string} triggerID ID of trigger.
 * @prop {Predicate} predicate Predicate of the condition met for the trigger to execute.
 * @prop {Command} command Definition of the command to execute.
 * @prop {ServerCode} serverCode Details of the server code to execute.
 * @prop {boolean} disabled Whether the trigger is disabled or not.
 * @prop {string} disabledReason Reasons for disabled trigger
 * @prop {string} title Title of the trigger
 * @prop {string} description Description of the trigger
 * @prop {Object} metadata Metadata of the trigger
 */
export class Trigger {

    public triggerID: string;
    public predicate: Predicate;
    public command: Command;
    public serverCode: ServerCode;
    public disabled: boolean;
    public disabledReason: string;
    public title: string;
    public description: string;
    public metadata: any;

    /**
     * Create a Trigger.
     * @constructor
     * @param {Predicate} Predicate of the condition met for the trigger to execute.
     * @param {Command} Definition of the command to execute.
     * @param {ServerCode} Details of the server code to execute.
     */
    constructor(
        predicate: Predicate,
        command: Command,
        serverCode: ServerCode
    ) {
        this.predicate = predicate;
        this.command = command;
        this.serverCode = serverCode;
    }
    /**
     * Gets the string represented TriggersWhat
     * @return {string} TriggersWhat
     */
    get triggersWhat(): string {
        if (this.command) {
            return TriggersWhat.COMMAND;
        }
        return TriggersWhat.SERVER_CODE;
    }
}
/** Represents the type of condition to fire a trigger.
<ul>
    <li>TriggersWhen.CONDITION_TRUE: Always fires when the Condition is evaluated as true.</li>
    <li>TriggersWhen.CONDITION_FALSE_TO_TRUE: Fires when previous State is evaluated as false and current State is evaluated as true.</li>
    <li>TriggersWhen.CONDITION_CHANGED: Fires when the previous State and current State is evaluated as different value. i.e. false to true, true to false. </li>
</ul>
*/
export const TriggersWhen = {
    CONDITION_TRUE: "CONDITION_TRUE",
    CONDITION_FALSE_TO_TRUE: "CONDITION_FALSE_TO_TRUE",
    CONDITION_CHANGED: "CONDITION_CHANGED"
}
/** Represents Action type of the trigger.
<ul>
    <li>TriggersWhat.COMMAND: Execute a command when trigger is fired.</li>
    <li>TriggersWhat.SERVER_CODE: Call a server code when trigger is fired.</li>
</ul>
*/
export const TriggersWhat = {
    COMMAND: "COMMAND",
    SERVER_CODE: "SERVER_CODE"
}
