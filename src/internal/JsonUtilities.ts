import { Action, AliasAction } from '../AliasAction';
import { isObject, isArray, isFunc } from './KiiUtilities';
import { ActionResult, AliasActionResult } from '../AliasActionResult';
import { Command } from '../Command';
import { TypedID } from '../TypedID';
import {
    TriggerClause,
    EqualsClauseInTrigger,
    NotEqualsClauseInTrigger,
    RangeClauseInTrigger,
    AndClauseInTrigger,
    OrClauseInTrigger
} from '../TriggerClause';
import { TriggerCommandObject, QueryGroupedHistoryStatesRequest } from '../RequestObjects';
import { Trigger, TriggersWhen } from '../Trigger';
import { Predicate, EventSource, StatePredicate, SchedulePredicate, ScheduleOncePredicate } from '../Predicate';
import { ServerCode } from '../ServerCode';
import { Condition } from '../Condition';
import { QueryClause, EqualsClauseInQuery, NotEqualsClauseInQuery, AndClauseInQuery, OrClauseInQuery, RangeClauseInQuery, AllClause } from '../QueryClause';
import { HistoryState, GroupedHistoryStates } from '../HistoryState';
import { TimeRange } from '../TimeRange';
import { Aggregation } from '../Aggregation';
import { AggregatedResults } from '../AggregatedResult';

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

export function jsonToTriggerClause(obj: any): TriggerClause {
    if (obj.type == "eq") {
        return new EqualsClauseInTrigger(
            obj.alias,
            obj.field,
            obj.value);
    } else if (obj.type == "not") {
        return new NotEqualsClauseInTrigger(
            obj.clause.alias,
            obj.clause.field,
            obj.clause.value);
    } else if (obj.type == "range") {
        let field = obj.field;
        let upperLimit = obj.upperLimit ? obj.upperLimit : null;
        let upperIncluded =
            (obj.upperIncluded != null && obj.upperIncluded != undefined) ?
                obj.upperIncluded : null;
        let lowerLimit = obj.lowerLimit ? obj.lowerLimit : null;
        let lowerIncluded =
            (obj.lowerIncluded != null && obj.lowerIncluded != undefined) ?
                obj.lowerIncluded : null;
        let alias = obj.alias;
        return new RangeClauseInTrigger(alias, field, upperLimit, upperIncluded, lowerLimit, lowerIncluded);
    } else if (obj.type == "and") {
        let subClauses: TriggerClause[] = [];
        for (let subJson of obj.clauses) {
            let subClause = jsonToTriggerClause(subJson);
            if (!!subClause) {
                subClauses.push(subClause);
            }
        }
        let andClause = new AndClauseInTrigger();
        andClause.clauses = subClauses;
        return andClause;
    } else if (obj.type == "or") {
        let subClauses: TriggerClause[] = [];
        for (let subJson of obj.clauses) {
            let subClause = jsonToTriggerClause(subJson);
            if (!!subClause) {
                subClauses.push(subClause);
            }
        }
        let orClause = new OrClauseInTrigger();
        orClause.clauses = subClauses;
        return orClause;
    }
    return null;
}
export function triggerClauseToJson(clause: TriggerClause): Object {
    if (clause instanceof EqualsClauseInTrigger) {
        return {
            type: "eq",
            alias: clause.alias,
            field: clause.field,
            value: clause.value
        };
    } else if (clause instanceof NotEqualsClauseInTrigger) {
        let equalsJson = triggerClauseToJson(
            new EqualsClauseInTrigger(
                clause.alias,
                clause.field,
                clause.value));
        return {
            type: "not",
            clause: equalsJson
        };
    } else if (clause instanceof RangeClauseInTrigger) {
        let json: any = {
            type: "range",
            alias: clause.alias,
            field: clause.field
        };

        if (!!clause.upperLimit) {
            json["upperLimit"] = clause.upperLimit;
        }
        if (clause.upperIncluded != null && clause.upperIncluded != undefined) {
            json["upperIncluded"] = clause.upperIncluded;
        }
        if (!!clause.lowerLimit) {
            json["lowerLimit"] = clause.lowerLimit;
        }
        if (clause.lowerIncluded != null && clause.lowerIncluded != undefined) {
            json["lowerIncluded"] = clause.lowerIncluded;
        }
        return json;
    } else if (clause instanceof AndClauseInTrigger) {
        let jsonArray = [];
        for (let subClause of clause.clauses) {
            let subJson = triggerClauseToJson(subClause);
            if (!!subJson) {
                jsonArray.push(subJson);
            }
        }
        return {
            type: "and",
            clauses: jsonArray
        };
    } else if (clause instanceof OrClauseInTrigger) {
        let jsonArray = [];
        for (let subClause of clause.clauses) {
            let subJson = triggerClauseToJson(subClause);
            if (!!subJson) {
                jsonArray.push(subJson);
            }
        }
        return {
            type: "or",
            clauses: jsonArray
        };
    }
    return null;
}
export function triggeredCommandToJson(cmd: TriggerCommandObject): Object {
    if (!!cmd.targetID && isArray(cmd.aliasActions) && !!cmd.issuerID) {
        var jsonObject: any = {};
        jsonObject.target = cmd.targetID.toString();
        jsonObject.issuer = cmd.issuerID.toString();
        jsonObject.actions = aliasActonArrayToJsons(cmd.aliasActions);

        if (!!cmd.title) {
            jsonObject.title = cmd.title;
        }
        if (!!cmd.description) {
            jsonObject.description = cmd.description;
        }
        if (!!cmd.metadata) {
            jsonObject.metadata = cmd.metadata;
        }
        return jsonObject;
    }
    return null;
}

export function jsonToTrigger(obj: any): Trigger {
    if (!!obj.triggerID
        && !!obj.predicate
        && (obj.disabled != undefined && obj.disabled != null)) {
        let predicate: Predicate = jsonToPredicate(obj.predicate);
        let trigger = new Trigger(obj.triggerID, predicate, obj.disabled);
        if (!!obj.command) {
            trigger.command = jsonToCommand(obj.command);
        }
        if (!!obj.serverCode) {
            trigger.serverCode = jsonToServerCode(obj.serverCode)
        }
        trigger.disabledReason = obj.disabledReason;
        trigger.title = obj.title;
        trigger.description = obj.description;
        trigger.metadata = obj.metadata;
        return trigger;
    }
    return null;
}

export function jsonToPredicate(obj: any): Predicate {
    if (obj.eventSource == EventSource.STATES) {
        let condition: Condition = new Condition(jsonToTriggerClause(obj.condition));
        let triggersWhen = (<any>TriggersWhen)[obj.triggersWhen];
        return new StatePredicate(condition, triggersWhen);
    } else if (obj.eventSource == EventSource.SCHEDULE) {
        let schedule = obj.schedule;
        return new SchedulePredicate(schedule);
    } else if (obj.eventSource == EventSource.SCHEDULE_ONCE) {
        let scheduleAt = obj.scheduleAt;
        return new ScheduleOncePredicate(scheduleAt);
    }
    return null;
}

export function predicateToJson(predicate: Predicate): Object {
    if(isFunc(predicate.getEventSource)){
        if (predicate.getEventSource() === EventSource.STATES) {
            return {
                condition: triggerClauseToJson((<StatePredicate>predicate).condition.clause),
                eventSource: EventSource.STATES,
                triggersWhen: (<StatePredicate>predicate).triggersWhen
            };
        } else if (predicate.getEventSource() === EventSource.SCHEDULE) {
            return {
                schedule: (<SchedulePredicate>predicate).schedule,
                eventSource: EventSource.SCHEDULE
            };
        } else if (predicate.getEventSource() === EventSource.SCHEDULE_ONCE) {
            return {
                scheduleAt: (<ScheduleOncePredicate>predicate).scheduleAt,
                eventSource: EventSource.SCHEDULE_ONCE
            };
        }
    }
    return null;
}

export function serverCodeToJson(serverCode: ServerCode): Object {
    var json: any = { endpoint: serverCode.endpoint };
    if (!!serverCode.executorAccessToken) {
        json["executorAccessToken"] = serverCode.executorAccessToken;
    }
    if (!!serverCode.targetAppID) {
        json["targetAppID"] = serverCode.targetAppID;
    }
    if (!!serverCode.parameters) {
        json["parameters"] = serverCode.parameters;
    }
    return json;
}

export function jsonToServerCode(obj: any): ServerCode {
    if (!!obj.endpoint) {
        return new ServerCode(
            obj.endpoint,
            obj.executorAccessToken,
            obj.targetAppID,
            obj.parameters);
    }
    return null;
}

export function jsonToQueryClause(obj: any): QueryClause {
    if (obj.type == "eq") {
        return new EqualsClauseInQuery(
            obj.field,
            obj.value);
    } else if (obj.type == "not") {
        return new NotEqualsClauseInQuery(
            obj.clause.field,
            obj.clause.value);
    } else if (obj.type == "and") {
        let clauses: Array<QueryClause> = new Array<QueryClause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(jsonToQueryClause(json));
        }
        let and = new AndClauseInQuery();
        and.clauses = clauses;
        return and;
    } else if (obj.type == "or") {
        let clauses: Array<QueryClause> = new Array<QueryClause>();
        let array: Array<any> = obj.clauses;
        for (var json of array) {
            clauses.push(jsonToQueryClause(json));
        }
        let or = new OrClauseInQuery();
        or.clauses = clauses;
        return or;
    } else if (obj.type == "range") {
        let field = obj.field;
        let upperLimit = obj.upperLimit ? obj.upperLimit : null;
        let upperIncluded =
            (obj.upperIncluded != null && obj.upperIncluded != undefined) ?
                obj.upperIncluded : null;
        let lowerLimit = obj.lowerLimit ? obj.lowerLimit : null;
        let lowerIncluded =
            (obj.lowerIncluded != null && obj.lowerIncluded != undefined) ?
                obj.lowerIncluded : null;
        return new RangeClauseInQuery(field, upperLimit, upperIncluded, lowerLimit, lowerIncluded);
    } else if (obj.type == "all") {
        return new AllClause();
    }
    return null;
}

export function queryClauseToJson(clause: QueryClause): Object {
    if (clause instanceof EqualsClauseInQuery) {
        return {
            type: "eq",
            field: clause.field,
            value: clause.value
        };
    } else if (clause instanceof NotEqualsClauseInQuery) {
        let equalsJson = queryClauseToJson(
            new EqualsClauseInQuery(
                clause.field,
                clause.value));
        return {
            type: "not",
            clause: equalsJson
        };
    } else if (clause instanceof RangeClauseInQuery) {
        let json: any = {
            type: "range",
            field: clause.field
        };

        if (!!clause.upperLimit) {
            json["upperLimit"] = clause.upperLimit;
        }
        if (clause.upperIncluded != null && clause.upperIncluded != undefined) {
            json["upperIncluded"] = clause.upperIncluded;
        }
        if (!!clause.lowerLimit) {
            json["lowerLimit"] = clause.lowerLimit;
        }
        if (clause.lowerIncluded != null && clause.lowerIncluded != undefined) {
            json["lowerIncluded"] = clause.lowerIncluded;
        }
        return json;
    } else if (clause instanceof AndClauseInQuery) {
        let jsonArray = [];
        for (let subClause of clause.clauses) {
            let subJson = queryClauseToJson(subClause);
            if (!!subJson) {
                jsonArray.push(subJson);
            }
        }
        return {
            type: "and",
            clauses: jsonArray
        };
    } else if (clause instanceof OrClauseInQuery) {
        let jsonArray = [];
        for (let subClause of clause.clauses) {
            let subJson = queryClauseToJson(subClause);
            if (!!subJson) {
                jsonArray.push(subJson);
            }
        }
        return {
            type: "or",
            clauses: jsonArray
        };
    } else if (clause instanceof AllClause) {
        return {
            type: "all"
        };
    }
    return null;
}

export function jsonToHistoryState(json: any): HistoryState {
    let createdAt = new Date(json["_created"]);
    delete json["_created"];
    return new HistoryState(json, createdAt);
}

export function timeRangeToQueryJson(obj: TimeRange): Object {
    return {
        type: "withinTimeRange",
        lowerLimit: obj.from.getTime(),
        upperLimit: obj.to.getTime()
    }
}

export function groupedQueryToJson(obj: QueryGroupedHistoryStatesRequest): Object {
    let retJson: any = {};
    let queryJson: any = {
        grouped: true,
    };

    let clauseJson: any;
    if (!!obj.clause) {
        clauseJson = {
            type: "and",
            clauses: [
                queryClauseToJson(obj.clause),
                timeRangeToQueryJson(obj.range),
            ]
        }
    } else {
        clauseJson = timeRangeToQueryJson(obj.range)
    }
    queryJson["clause"] = clauseJson;

    retJson["query"] = queryJson;
    if (!!obj.firmwareVersion) {
        retJson["firmwareVersion"] = obj.firmwareVersion;
    }
    return retJson;
}

export function jsonToTimeRange(json: any): TimeRange {
    return new TimeRange(new Date(json["from"]), new Date(json["to"]));
}

export function jsonToGroupedHistoryStates(json: any): GroupedHistoryStates {
    let states: Array<HistoryState> = [];
    let stateJsons = json["objects"];
    for (let stateJson of stateJsons) {
        states.push(jsonToHistoryState(stateJson));
    }
    return new GroupedHistoryStates(jsonToTimeRange(json["range"]), states);
}

export function aggregationToJson(aggregation: Aggregation): Object {
    return {
        type: aggregation.type,
        field: aggregation.field,
        fieldType: aggregation.fieldType,
        putAggregationInto: aggregation.type.toLowerCase()
    };
}

export function jsonToAggregatedResults(json: any): AggregatedResults {
    let range = jsonToTimeRange(json.range);
    if(json.aggregations.length === 0) {
        return new AggregatedResults(range)
    }
    let arJson = json.aggregations[0];
    let aggregateStates;
    if(!!arJson.object) {
        aggregateStates = [];
        aggregateStates.push(jsonToHistoryState(arJson.object));
    }
    return new AggregatedResults(range, arJson.value, aggregateStates);
}