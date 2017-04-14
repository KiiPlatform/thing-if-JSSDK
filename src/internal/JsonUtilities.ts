import { Action, AliasAction } from '../AliasAction';
import { isObject, isArray } from './KiiUtilities';
import { ActionResult, AliasActionResult } from '../AliasActionResult';
import { Command } from '../Command';
import { TypedID } from '../TypedID';

export function actionToJson(action: Action): Object {
    if (!!action && !!action.name) {
        let json: any = {};
        json[action.name] = action.value;
        return json;
    }
    return null;
}

export function jsonToAction(json: any): Action {
    if (isObject(json) && Object.keys(json).length == 1) {
        let actionName = Object.keys(json)[0];
        let value = json[actionName];
        return new Action(actionName, value);
    }
    return null;
}

export function aliasActionToJson(aliasAction: AliasAction): Object {
    if (!!aliasAction && !!aliasAction.alias) {
        let json: any = {};
        let actionJsonArray = [];
        for (let action of aliasAction.actions) {
            actionJsonArray.push(actionToJson(action));
        }
        json[aliasAction.alias] = actionJsonArray;
        return json;
    }
    return null;
}

export function jsonToAliasAction(json: any): AliasAction {
    if (isObject(json) && Object.keys(json).length == 1) {
        let alias = Object.keys(json)[0];
        let jsonActions = json[alias];
        if (isArray(jsonActions)) {
            let actions = [];
            for (let jsonAction of jsonActions) {
                let action = jsonToAction(jsonAction);
                if (!!action) {
                    actions.push(action);
                }
            }
            return new AliasAction(alias, actions);
        }
    }
    return null;
}

export function jsonToActionResult(json: any): ActionResult {
    if (isObject(json) && Object.keys(json).length == 1) {
        let actionName = Object.keys(json)[0];
        if (isObject(json[actionName])) {
            let resultJson = json[actionName];
            let succeeded: boolean;
            let data: Object;
            let errorMessage: string;
            if (resultJson.hasOwnProperty("succeeded")) {
                succeeded = resultJson["succeeded"];
                if (resultJson.hasOwnProperty("data")) {
                    data = resultJson["data"];
                }
                if (resultJson.hasOwnProperty("errorMessage")) {
                    errorMessage = resultJson["errorMessage"];
                }
                return new ActionResult(actionName, succeeded, data, errorMessage);
            }
        }
    }
    return null;
}

export function jsonToAliasActionResult(json: any): AliasActionResult {
    if (isObject(json) && Object.keys(json).length == 1) {
        let alias = Object.keys(json)[0];
        if (isArray(json[alias])) {
            let results = [];
            for (let resultJson of json[alias]) {
                results.push(jsonToActionResult(resultJson));
            }
            return new AliasActionResult(alias, results);
        }
    }
    return null;
}

export function aliasActonArrayToJsons(aas: Array<AliasAction>): Object[] {
    if (!!aas && isArray(aas)) {
        let json = [];
        for (let aa of aas) {
            let aaJson = aliasActionToJson(aa);
            if (!!aaJson) {
                json.push(aaJson);
            }
        }
        return json;
    }
    return null;
}

export function jsonArrayToAliasActoins(jsons: any): AliasAction[] {
    if (isArray(jsons)) {
        let aas = [];
        for (let json of jsons) {
            let aa = jsonToAliasAction(json);
            if (!!aa) {
                aas.push(aa);
            }
        }
        return aas;
    }
    return null;
}

export function jsonArrayToAliasActionResults(jsons: any): AliasActionResult[] {
    if (isArray(jsons)) {
        let aars = [];
        for (let json of jsons) {
            let aar = jsonToAliasActionResult(json);
            if (!!aar) {
                aars.push(aar);
            }
        }
        return aars;
    }
    return null;
}

export function jsonToCommand(obj: any): Command {
    if (!obj.target || !obj.issuer || !obj.actions) {
        return null;
    }
    let aliasActons = jsonArrayToAliasActoins(obj.actions);
    let command = new Command(
        TypedID.fromString(obj.target),
        TypedID.fromString(obj.issuer),
        aliasActons);
    command.commandID = obj.commandID;
    if (!!obj.actionResults) {
        command.aliasActionResults = jsonArrayToAliasActionResults(obj.actionResults);
    }
    command.commandState = obj.commandState;
    command.firedByTriggerID = obj.firedByTriggerID;
    command.title = obj.title;
    command.description = obj.description;
    command.metadata = obj.metadata;

    if (!!obj.createdAt) {
        command.created = new Date(obj.createdAt);
    }
    if (!!obj.modifiedAt) {
        command.modified = new Date(obj.modifiedAt);
    }
    return command;
}