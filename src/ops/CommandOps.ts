/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import {PostCommandRequest, ListQueryOptions} from '../RequestObjects'
import {Command, CommandState} from '../Command'
import {ThingIFError, HttpRequestError, Errors} from '../ThingIFError'
import * as KiiUtil from '../internal/KiiUtilities'
import {TypedID} from '../TypedID'
import {QueryResult} from '../QueryResult'

export default class CommandOps extends BaseOp {
    private baseUrl: string;
    constructor(
        public au: APIAuthor,
        public targetID: TypedID
    ){
        super(au);
        this.baseUrl = `${this.au.app.getThingIFBaseUrl()}/targets/${this.targetID.toString()}/commands`;
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
            var req = {
                method: "POST",
                headers: headers,
                url: this.baseUrl,
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

    listCommands(listOptions?: ListQueryOptions): Promise<QueryResult<Command>> {
        return new Promise<QueryResult<Command>>((resolve, reject)=>{
            var url = this.baseUrl;
            if(!!listOptions){
                var queryString = ListQueryOptions.getQueryString(listOptions);
                if(queryString){
                    url = `${url}?${queryString}`;
                }
            }
            var headers = this.addHeader("Content-Type", "application/json");
            var req = {
                method: "GET",
                headers: headers,
                url: url
            };
            request(req).then((res)=>{
                var rawCmds = (<any>res.body)["commands"];
                var commands = new Array<Command>();
                for (var i in rawCmds){
                    var rawCmd = rawCmds[i];
                    var command = Command.fromJson(rawCmd);
                    commands.push(command);
                }
                var paginationKey = (<any>res.body)["nextPaginationKey"];
                var result = new QueryResult<Command>(commands, paginationKey);
                resolve(<any>result);
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    getCommand(commandID: string): Promise<Command> {
        return new Promise<Command>((resolve, reject)=>{
            // validate parameters
            if(!commandID){
                reject(new ThingIFError(Errors.ArgumentError, "commandID is null or empty"));
                return;
            }else if(!KiiUtil.isString(commandID)){
                reject(new ThingIFError(Errors.ArgumentError, "commandID is not string"));
                return;
            }

            var headers = this.addHeader("Content-Type", "application/json");
            var req = {
                method: "GET",
                headers: headers,
                url: `${this.baseUrl}/${commandID}`
            };
            request(req).then((res)=>{
                resolve(Command.fromJson(res.body));
            }).catch((err)=>{
                reject(err);
            });
        });
    }
}