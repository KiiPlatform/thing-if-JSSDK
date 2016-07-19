/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {Response} from './Response'
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import {Trigger, TriggersWhat} from '../Trigger'
import {QueryResult} from '../QueryResult'
import {CommandTriggerRequest, ServerCodeTriggerRequest} from '../RequestObjects'
import {ThingIFError, HttpRequestError, Errors} from '../ThingIFError'

export default class TriggerOps extends BaseOp {
    constructor(
        public au: APIAuthor,
        public target: string
    ){
        super(au);
    }

    postCommandTrigger(requestObject: CommandTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            var resuestBody = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat[TriggersWhat.COMMAND],
                // command: new Command().toJson()
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
                triggersWhat: TriggersWhat[TriggersWhat.SERVER_CODE],
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target}/triggers`;
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target}/triggers/${triggerID}`;
        return new Promise<Trigger>((resolve, reject)=>{
            var headers: Object = this.getHeaders();
            var req = {
                method: "GET",
                headers: headers,
                url: url
            };
            request(req).then((res: Response)=>{
                // TODO
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
                triggersWhat: TriggersWhat[TriggersWhat.COMMAND],
                // command: new Command().toJson()
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
                triggersWhat: TriggersWhat[TriggersWhat.SERVER_CODE],
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target}/triggers/${triggerID}`;
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target}/triggers/${triggerID}}/${operation}`;
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target}/triggers/${triggerID}`;
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

    listTriggers(listOptions?: Object): Promise<QueryResult<Trigger>> {
        //TODO: implment me
        return new Promise<QueryResult<Trigger>>((resolve, reject)=>{
            resolve(null);
        })
    }

    listServerCodeResults(
        triggerID: string,
        listOptions?: Object): Promise<Object> {
        //TODO: implment me
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        })
    }
}