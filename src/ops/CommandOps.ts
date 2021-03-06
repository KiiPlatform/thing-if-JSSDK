
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
import * as JsonUtil from '../internal/JsonUtilities'

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
            if(!requestObject.aliasActions){
                reject(new ThingIFError(Errors.ArgumentError, "aliasActions is null or empty"));
                return;
            }else if(!KiiUtil.isArray(requestObject.aliasActions)){
                reject(new ThingIFError(Errors.ArgumentError, "aliasActions is not array"));
                return;
            }
            if(!requestObject.issuer){
                reject(new ThingIFError(Errors.ArgumentError, "issuer is null or empty"));
                return;
            }else if(!KiiUtil.isString(requestObject.issuer)){
                reject(new ThingIFError(Errors.ArgumentError, "issuer is not string"));
                return;
            }

            // delete aliasActions key, and
            let requestBody = JSON.parse(JSON.stringify(requestObject));
            delete requestBody["aliasActions"];
            requestBody["actions"] = JsonUtil.aliasActonArrayToJsons(requestObject.aliasActions);

            var headers = this.addHeader("Content-Type", "application/vnd.kii.CommandCreationRequest+json");
            var req = {
                method: "POST",
                headers: headers,
                url: this.baseUrl,
                body: requestBody,
            };

            request(req).then((res)=>{
                var newCommand = new Command(
                        this.targetID,
                        TypedID.fromString(requestObject.issuer),
                        requestObject.aliasActions);
                newCommand.commandID = (<any>res.body).commandID;
                if(!!requestObject.title){
                    newCommand.title = requestObject.title;
                }
                if(!!requestObject.description){
                    newCommand.description = requestObject.description;
                }
                if(!!requestObject.metadata){
                    newCommand.metadata = requestObject.metadata;
                }
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
                    var command = JsonUtil.jsonToCommand(rawCmd);
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
                resolve(JsonUtil.jsonToCommand(res.body));
            }).catch((err)=>{
                reject(err);
            });
        });
    }
}