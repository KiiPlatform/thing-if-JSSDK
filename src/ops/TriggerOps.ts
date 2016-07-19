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
            // TODO:command
            var resuest = {
                predicate: requestObject.predicate.toJson(),
                triggersWhat: TriggersWhat[TriggersWhat.COMMAND],
            }
            // requestBody.put("predicate", JsonUtils.newJson(GsonRepository.gson(schema).toJson(predicate)));
            // requestBody.put("triggersWhat", TriggersWhat.COMMAND.name());
            // requestBody.put("command", JsonUtils.newJson(GsonRepository.gson(schema).toJson(command)));
            resolve(null);
        })
    }
    postServerCodeTriggger(requestObject: ServerCodeTriggerRequest): Promise<Trigger> {
        return new Promise<Trigger>((resolve, reject)=>{
            resolve(null);
        })
    }
    private postTriggger(): Promise<Trigger> {
        return null;
    }

    getTrigger(triggerID: string): Promise<Trigger> {
        //TODO: implment me
        return new Promise<Trigger>((resolve, reject)=>{
            resolve(null);
        })
    }

    patchTrigger(
        triggerID: string,
        requestObject: Object): Promise<Trigger> {
        //TODO: implment me
        return new Promise<Trigger>((resolve, reject)=>{
            resolve(null);
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
        let url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.target}/triggers/${triggerID}}`;
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