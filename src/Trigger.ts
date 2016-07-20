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
    get triggersWhat(): TriggersWhat {
        if (this.command) {
            return TriggersWhat.COMMAND;
        }
        return TriggersWhat.SERVER_CODE;
    }

    static fromJson(obj: any): Trigger {
        return null;
    }

}
export enum TriggersWhen {
    CONDITION_TRUE,
    CONDITION_FALSE_TO_TRUE,
    CONDITION_CHANGED
}
export enum TriggersWhat {
    COMMAND,
    SERVER_CODE
}