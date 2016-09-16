/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {Response} from './Response'
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import {Trigger, TriggersWhat} from '../Trigger'
import {QueryResult} from '../QueryResult'
import {
        PostCommandTriggerRequest,
        PostServerCodeTriggerRequest,
        ListQueryOptions,
        PatchCommandTriggerRequest,
        PatchServerCodeTriggerRequest
    } from '../RequestObjects'
import {ThingIFError, HttpRequestError, Errors} from '../ThingIFError'
import {TypedID} from '../TypedID'
import {Command} from '../Command'
import {ServerCodeResult} from '../ServerCodeResult'
import * as KiiUtil from '../internal/KiiUtilities'

export default class TriggerOps extends BaseOp {
    constructor(
        public au: APIAuthor,
        public target: TypedID
    ){
        super(au);
    }

    postCommandTrigger(requestObject: PostCommandTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            if (!requestObject) {
                reject(new ThingIFError(Errors.ArgumentError, "requestObject is null"));
                return;
            }
            if(!requestObject.command){
                reject(new ThingIFError(Errors.ArgumentError, "command is null"));
                return;
            }
            var commandRequest = requestObject.command;
            if (!commandRequest.schema) {
                reject(new ThingIFError(Errors.ArgumentError, "schema of command is null or empty"));
                return;
            } else if (!KiiUtil.isString(commandRequest.schema)) {
                reject(new ThingIFError(Errors.ArgumentError, "schema of command is not string"));
                return;
            }
            if (commandRequest.schemaVersion === null || commandRequest.schemaVersion === undefined) {
                reject(new ThingIFError(Errors.ArgumentError, "schemaVersion of command is null"));
                return;
            }
            if (!commandRequest.actions) {
                reject(new ThingIFError(Errors.ArgumentError, "actions of command is null"));
                return;
            }
            if (!commandRequest.targetID) {
                reject(new ThingIFError(Errors.ArgumentError, "targetID of command is null"));
                return;
            }
            if (!requestObject.predicate) {
                reject(new ThingIFError(Errors.ArgumentError, "predicate is null"));
                return;
            }

            if (!commandRequest.issuerID) {
                reject(new ThingIFError(Errors.ArgumentError, "issuerID of command is null"));
                return;
            }

            var command = new Command(
                commandRequest.targetID,
                commandRequest.issuerID,
                commandRequest.schema,
                commandRequest.schemaVersion,
                commandRequest.actions);
            command.title = commandRequest.title;
            command.description = commandRequest.description;
            command.metadata = commandRequest.metadata;

            var requestBody: any = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat.COMMAND,
                command: command.toJson()
            }

            if(!!requestObject.title){
                requestBody["title"]= requestObject.title;
            }

            if(!!requestObject.description){
                requestBody["description"] = requestObject.description;
            }

            if(!!requestObject.metadata){
                requestBody["metadata"] = requestObject.metadata;
            }

            this.postTrigger(requestBody).then((res:Response)=>{
                var trigger = new Trigger(requestObject.predicate, command, null);
                trigger.triggerID = (<any>res).body.triggerID;
                trigger.disabled = false;
                trigger.title = requestObject.title;
                trigger.description = requestObject.description;
                trigger.metadata = requestObject.metadata;
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    postServerCodeTrigger(requestObject: PostServerCodeTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            if (!requestObject) {
                reject(new ThingIFError(Errors.ArgumentError, "requestObject is null"));
                return;
            }
            if (!requestObject.serverCode) {
                reject(new ThingIFError(Errors.ArgumentError, "serverCode is null"));
                return;
            }
            if (!requestObject.predicate) {
                reject(new ThingIFError(Errors.ArgumentError, "predicate is null"));
                return;
            }
            var requestBody:any = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat.SERVER_CODE,
                serverCode: requestObject.serverCode.toJson()
            }
            if(!!requestObject.title){
                requestBody["title"]= requestObject.title;
            }

            if(!!requestObject.description){
                requestBody["description"] = requestObject.description;
            }

            if(!!requestObject.metadata){
                requestBody["metadata"] = requestObject.metadata;
            }
            this.postTrigger(requestBody).then((res:Response)=>{
                var trigger:Trigger = new Trigger(requestObject.predicate, null, requestObject.serverCode);
                trigger.triggerID = (<any>res).body.triggerID;
                trigger.disabled = false;
                trigger.title = requestObject.title;
                trigger.description = requestObject.description;
                trigger.metadata = requestObject.metadata;
                resolve(trigger);
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    private postTrigger(requestBody: Object): Promise<Response> {
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers`;
        return new Promise<Response>((resolve, reject)=>{
            var headers: Object = this.addHeader("Content-Type", "application/json");
            var req = {
                method: "POST",
                headers: headers,
                url: url,
                body: requestBody
            };
            request(req).then((res: Response)=>{
                resolve(res)
            }).catch((err)=>{
                reject(err);
            });
        })
    }

    getTrigger(triggerID: string): Promise<Trigger> {
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}`;
        return new Promise<Trigger>((resolve, reject)=>{
            if (!triggerID) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is null or empty"));
                return;
            } else if (!KiiUtil.isString(triggerID)) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is not string"));
                return;
            }
            var headers: Object = this.getHeaders();
            var req = {
                method: "GET",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                resolve(Trigger.fromJson((<any>res).body));
            }).catch((err)=>{
                reject(err);
            });
        })
    }

    patchCommandTrigger(
        triggerID: string,
        requestObject: PatchCommandTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            if (!triggerID) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is null or empty"));
                return;
            } else if (!KiiUtil.isString(triggerID)) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is not string"));
                return;
            }
            if (!requestObject) {
                reject(new ThingIFError(Errors.ArgumentError, "requestObject is null"));
                return;
            }
            let requestBody:any = {}
            if(!!requestObject.predicate){
                requestBody["predicate"] = requestObject.predicate.toJson();
            }

            if(!!requestObject.command){
                var commandRequest = requestObject.command;
                if (!commandRequest.schema) {
                    reject(new ThingIFError(Errors.ArgumentError, "schema of command is null or empty"));
                    return;
                } else if (!KiiUtil.isString(commandRequest.schema)) {
                    reject(new ThingIFError(Errors.ArgumentError, "schema of command is not string"));
                    return;
                }
                if (commandRequest.schemaVersion === null || commandRequest.schemaVersion === undefined) {
                    reject(new ThingIFError(Errors.ArgumentError, "schemaVersion of command is null"));
                    return;
                }
                if (!commandRequest.actions) {
                    reject(new ThingIFError(Errors.ArgumentError, "actions of command is null"));
                    return;
                }
                if (!commandRequest.targetID) {
                    reject(new ThingIFError(Errors.ArgumentError, "targetID of command is null"));
                    return;
                }
                if (!commandRequest.issuerID) {
                    reject(new ThingIFError(Errors.ArgumentError, "issuerID is null"));
                    return;
                }
                var command = new Command(
                    commandRequest.targetID,
                    commandRequest.issuerID,
                    commandRequest.schema,
                    commandRequest.schemaVersion,
                    commandRequest.actions);
                command.title = commandRequest.title;
                command.description = commandRequest.description;
                command.metadata = commandRequest.metadata;
                requestBody["command"] = command.toJson();
                requestBody["triggersWhat"] = "COMMAND";
            }
            if(!!requestObject.title){
                requestBody["title"]= requestObject.title;
            }

            if(!!requestObject.description){
                requestBody["description"] = requestObject.description;
            }

            if(!!requestObject.metadata){
                requestBody["metadata"] = requestObject.metadata;
            }
            this.patchTriggger(triggerID, requestBody).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    patchServerCodeTrigger(
        triggerID: string,
        requestObject: PatchServerCodeTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            if (!triggerID) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is null or empty"));
                return;
            } else if (!KiiUtil.isString(triggerID)) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is not string"));
                return;
            }
            if (!requestObject) {
                reject(new ThingIFError(Errors.ArgumentError, "requestObject is null"));
                return;
            }
            if (!requestObject.serverCode && !requestObject.predicate) {
                reject(new ThingIFError(Errors.ArgumentError, "must specify serverCode or predicate"));
                return;
            }
            var requestBody: any = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat.SERVER_CODE,
                serverCode: requestObject.serverCode.toJson()
            }
            if(!!requestObject.title){
                requestBody["title"]= requestObject.title;
            }

            if(!!requestObject.description){
                requestBody["description"] = requestObject.description;
            }

            if(!!requestObject.metadata){
                requestBody["metadata"] = requestObject.metadata;
            }
            this.patchTriggger(triggerID, requestBody).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    private patchTriggger(triggerID: string, requestBody: Object): Promise<Trigger> {
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}`;
        return new Promise<Trigger>((resolve, reject)=>{
            var headers: Object = this.addHeader("Content-Type", "application/json");
            var req = {
                method: "PATCH",
                headers: headers,
                url: url,
                body: requestBody
            };
            request(req).then((res: Response)=>{
                this.getTrigger(triggerID).then((trigger:Trigger)=>{
                    resolve(trigger);
                }).catch((err:ThingIFError)=>{
                    reject(err);
                })
            }).catch((err)=>{
                reject(err);
            });
        })
    }
    enableTrigger(
        triggerID: string,
        enable: boolean): Promise<Trigger> {
        var operation = (enable? "enable" : "disable");
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}/${operation}`;
        return new Promise<Trigger>((resolve, reject) => {
            if (!triggerID) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is null or empty"));
                return;
            } else if (!KiiUtil.isString(triggerID)) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is not string"));
                return;
            }
            if (enable === null || enable === undefined) {
                reject(new ThingIFError(Errors.ArgumentError, "enable is null"));
                return;
            } else if (!KiiUtil.isBoolean(enable)) {
                reject(new ThingIFError(Errors.ArgumentError, "enable is not boolean"));
                return;
            }
            var headers: Object = this.getHeaders();
            var req = {
                method: "PUT",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                this.getTrigger(triggerID).then((trigger:Trigger)=>{
                    resolve(trigger);
                }).catch((err:ThingIFError)=>{
                    reject(err);
                })
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    deleteTrigger(triggerID: string): Promise<string> {
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}`;
        return new Promise<string>((resolve, reject) => {
            if (!triggerID) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is null or empty"));
                return;
            } else if (!KiiUtil.isString(triggerID)) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is not string"));
                return;
            }
            var headers: Object = this.getHeaders();
            var req = {
                method: "DELETE",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                resolve(triggerID);
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    listTriggers(listOptions?: ListQueryOptions): Promise<QueryResult<Trigger>> {
        var url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers`;
        if(!!listOptions){
            var queryString = ListQueryOptions.getQueryString(listOptions);
            if(queryString){
                url = `${url}?${queryString}`;
            }
        }
        return new Promise<QueryResult<Trigger>>((resolve, reject)=>{
            var headers: Object = this.getHeaders();
            var req = {
                method: "GET",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                var triggers: Array<Trigger> = [];
                var paginationKey = (<any>res).body.nextPaginationKey ? (<any>res).body.nextPaginationKey : null;
                for (var json of (<any>res).body.triggers) {
                    triggers.push(Trigger.fromJson(json));
                }
                resolve(new QueryResult(triggers, paginationKey))
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    listServerCodeResults(
        triggerID: string,
        listOptions?: ListQueryOptions): Promise<QueryResult<ServerCodeResult>> {
        var url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}/results/server-code`;
        if(!!listOptions){
            var queryString = ListQueryOptions.getQueryString(listOptions);
            if(queryString){
                url = `${url}?${queryString}`;
            }
        }
        return new Promise<QueryResult<ServerCodeResult>>((resolve, reject)=>{
            if (!triggerID) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is null or empty"));
                return;
            } else if (!KiiUtil.isString(triggerID)) {
                reject(new ThingIFError(Errors.ArgumentError, "triggerID is not string"));
                return;
            }
            var headers: Object = this.getHeaders();
            var req = {
                method: "GET",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                var results: Array<ServerCodeResult> = [];
                var paginationKey = (<any>res).body.nextPaginationKey ? (<any>res).body.nextPaginationKey : null;
                for (var json of (<any>res).body.triggerServerCodeResults) {
                    results.push(ServerCodeResult.fromJson(json));
                }
                resolve(new QueryResult(results, paginationKey))
            }).catch((err)=>{
                reject(err);
            });
        });
    }
}