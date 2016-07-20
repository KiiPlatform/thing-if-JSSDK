/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {Response} from './Response'
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import {Trigger, TriggersWhat} from '../Trigger'
import {QueryResult} from '../QueryResult'
import {CommandTriggerRequest, ServerCodeTriggerRequest, ListQueryOptions} from '../RequestObjects'
import {ThingIFError, HttpRequestError, Errors} from '../ThingIFError'
import {TypedID} from '../TypedID'
import {Command} from '../Command'
import {ServerCodeResult} from '../ServerCodeResult'

export default class TriggerOps extends BaseOp {
    constructor(
        public au: APIAuthor,
        public target: TypedID
    ){
        super(au);
    }

    postCommandTrigger(requestObject: CommandTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            var resuestBody = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat.COMMAND,
                command: Command.newCommand(this.target, requestObject.issuerID, requestObject.schemaName, requestObject.schemaVersion, requestObject.actions).toJson()
            }
            this.postTriggger(resuestBody).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    postServerCodeTriggger(requestObject: ServerCodeTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            var resuestBody = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat.SERVER_CODE,
                serverCode: requestObject.serverCode.toJson()
            }
            this.postTriggger(resuestBody).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            });
        });
    }
    private postTriggger(requestBody: Object): Promise<Trigger> {
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers`;
        return new Promise<Trigger>((resolve, reject)=>{
            var headers: Object = this.addHeader("Content-Type", "application/json");
            var req = {
                method: "POST",
                headers: headers,
                url: url,
                body: requestBody
            };
            request(req).then((res: Response)=>{
                this.getTrigger((<any>res).body.triggerID).then((trigger:Trigger)=>{
                    resolve(trigger);
                }).catch((err:ThingIFError)=>{
                    reject(err);
                })
            }).catch((err)=>{
                reject(err);
            });
        })
    }

    getTrigger(triggerID: string): Promise<Trigger> {
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}`;
        return new Promise<Trigger>((resolve, reject)=>{
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
        requestObject: CommandTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            var resuestBody = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat.COMMAND,
                command: Command.newCommand(this.target, requestObject.issuerID, requestObject.schemaName, requestObject.schemaVersion, requestObject.actions)
            }
            this.patchTriggger(triggerID, resuestBody).then((result)=>{
                resolve(result);
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    patchServerCodeTrigger(
        triggerID: string,
        requestObject: ServerCodeTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            var resuestBody = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat.SERVER_CODE,
                serverCode: requestObject.serverCode.toJson()
            }
            this.patchTriggger(triggerID, resuestBody).then((result)=>{
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
                this.getTrigger((<any>res).body.triggerID).then((trigger:Trigger)=>{
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}}/${operation}`;
        return new Promise<Trigger>((resolve, reject) => {
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers`;
        var queryParams:string = "";
        if (listOptions) {
            if (listOptions.paginationKey) {
                queryParams = "?paginationKey=" + listOptions.paginationKey;
            }
            if (listOptions.bestEffortLimit) {
                if (queryParams) {
                    queryParams = "?bestEffortLimit=" + listOptions.bestEffortLimit;
                } else {
                    queryParams += "&bestEffortLimit=" + listOptions.bestEffortLimit;
                }
            }
        }
        url += queryParams;
        return new Promise<QueryResult<Trigger>>((resolve, reject)=>{
            var headers: Object = this.getHeaders();
            var req = {
                method: "GET",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                var triggers: Array<Trigger> = [];
                var paginationKey = (<any>res).body.nextPaginationKey;
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target.toString()}/triggers/${triggerID}/results/server-code`;
        var queryParams:string = "";
        if (listOptions) {
            if (listOptions.paginationKey) {
                queryParams = "?paginationKey=" + listOptions.paginationKey;
            }
            if (listOptions.bestEffortLimit) {
                if (queryParams) {
                    queryParams = "?bestEffortLimit=" + listOptions.bestEffortLimit;
                } else {
                    queryParams += "&bestEffortLimit=" + listOptions.bestEffortLimit;
                }
            }
        }
        url += queryParams;
        return new Promise<QueryResult<ServerCodeResult>>((resolve, reject)=>{
            var headers: Object = this.getHeaders();
            var req = {
                method: "GET",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                var results: Array<ServerCodeResult> = [];
                var paginationKey = (<any>res).body.nextPaginationKey;
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