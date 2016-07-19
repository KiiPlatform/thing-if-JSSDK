/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import {PostCommandRequest} from '../RequestObjects'
import {Command, CommandState} from '../Command'
import {ThingIFError, HttpRequestError, Errors} from '../ThingIFError'
import * as KiiUtil from '../internal/KiiUtilities'
import {TypedID} from '../TypedID'

export default class CommandOps extends BaseOp {
    constructor(
        public au: APIAuthor,
        public targetID: TypedID
    ){
        super(au);
    }

    postNewCommand(requestObject: PostCommandRequest): Promise<Command> {
        return new Promise<Command>((resolve, reject)=>{
            // validate parameters
            if(!requestObject.schema){
                reject(new ThingIFError(Errors.ArgumentError, "schema is null or empty"));
                return;
            }else if(!KiiUtil.isString(requestObject.schema)){
                reject(new ThingIFError(Errors.ArgumentError, "schema is not string"));
                return;
            }
            if(!requestObject.schemaVersion){
                reject(new ThingIFError(Errors.ArgumentError, "schemaVersion is null or empty"));
                return;
            }else if(!KiiUtil.isNumber(requestObject.schemaVersion)){
                reject(new ThingIFError(Errors.ArgumentError, "schemaVersion is not number"));
                return;
            }
            if(!requestObject.actions){
                reject(new ThingIFError(Errors.ArgumentError, "actions is null or empty"));
                return;
            }else if(!KiiUtil.isArray(requestObject.actions)){
                reject(new ThingIFError(Errors.ArgumentError, "actions is not array"));
                return;
            }
            if(!requestObject.issuer){
                reject(new ThingIFError(Errors.ArgumentError, "issuer is null or empty"));
                return;
            }else if(!KiiUtil.isString(requestObject.issuer)){
                reject(new ThingIFError(Errors.ArgumentError, "issuer is not string"));
                return;
            }

            var headers = this.addHeader("Content-Type", "application/json");
            var url = `${this.au.app.getThingIFBaseUrl()}/targets/${this.targetID.toString()}/commands`;
            var req = {
                method: "POST",
                headers: headers,
                url: url,
                body: requestObject,
            };

            request(req).then((res)=>{
                var newCommand = new Command(
                        (<any>res.body).commandID,
                        this.targetID,
                        TypedID.fromString(requestObject.issuer),
                        requestObject.schema,
                        requestObject.schemaVersion,
                        requestObject.actions);
                resolve(newCommand);
            }).catch((err)=>{
                reject(err);
            })
        });
    }

    listCommands(listOptions?: Object): Promise<Object> {
        //TODO: implement me
        this.addHeaders({});// add necessary headers
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        });
    }

    getCommand(commandID: string): Promise<Object> {
        //TODO: implement me
        this.addHeaders({});// add necessary headers
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        });
    }
}