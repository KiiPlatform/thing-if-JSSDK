import {Command} from './Command';
import {ServerCode} from './ServerCode';
import {Predicate} from './Predicate'

/** Represent Trigger */
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

    constructor(
        predicate: Predicate,
        command: Command,
        serverCode: ServerCode
    ) {
        this.predicate = predicate;
        this.command = command;
        this.serverCode = serverCode;
    }
    get triggersWhat(): string {
        if (this.command) {
            return TriggersWhat.COMMAND;
        }
        return TriggersWhat.SERVER_CODE;
    }

    static fromJson(obj: any): Trigger {
        let predicate: Predicate = Predicate.fromJson(obj.predicate);
        let command: Command = obj.command ? Command.fromJson(obj.command) : null;
        let serverCode: ServerCode = obj.serverCode ? ServerCode.fromJson(obj.serverCode) : null;
        let trigger = new Trigger(predicate, command, serverCode);
        trigger.triggerID = obj.triggerID ? obj.triggerID : null;
        trigger.disabled = obj.disabled === undefined ?  null : obj.disabled;
        trigger.disabledReason = obj.disabledReason ? obj.disabledReason : null;
        trigger.title = obj.title ? obj.title : null;
        trigger.description = obj.description ? obj.description : null;
        trigger.metadata = obj.metadata ? obj.metadata : null;
        return trigger;
    }

}
export const TriggersWhen = {
    CONDITION_TRUE: "CONDITION_TRUE",
    CONDITION_FALSE_TO_TRUE: "CONDITION_FALSE_TO_TRUE",
    CONDITION_CHANGED: "CONDITION_CHANGED"
}
export const TriggersWhat = {
    COMMAND: "COMMAND",
    SERVER_CODE: "SERVER_CODE"
}
