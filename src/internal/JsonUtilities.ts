import { Action, AliasAction } from '../AliasAction';
import { isObject, isArray } from './KiiUtilities';
import { ActionResult, AliasActionResult } from '../AliasActionResult';
export function actionToJson(action: Action): Object {
    if (!!action && !!action.name) {
        let json = {};
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
        let json = {};
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
            let resultJson = <Object>json[actionName];
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