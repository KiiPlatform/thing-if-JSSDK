/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import {TypedID} from '../TypedID'
import {QueryHistoryStatesRequest} from '../RequestObjects'
import {GroupedResults, HistoryStateResults} from '../HistoryStateResults'
import * as KiiUtil from '../internal/KiiUtilities'
import {ThingIFError, Errors} from '../ThingIFError'

export default class StateOps extends BaseOp {
    private baseUrl: string
    constructor(
        public au: APIAuthor,
        public targetID: TypedID
    ){
        super(au);
        this.baseUrl = `${this.au.app.getThingIFBaseUrl()}/targets/${this.targetID.toString()}/states`;
    }

    getState(alias?: string): Promise<Object> {
        return new Promise<Object>((resolve, reject)=>{
            var url = this.baseUrl;
            if(alias){
                url = url + `/aliases/${alias}`;
            }
            var req = {
                method: "GET",
                headers: this.getHeaders(),
                url: url
            };
            request(req).then((res)=>{
                resolve(res.body);
            }).catch((err)=>{
                reject(err);
            });
        })
    }

    queryStates(requestObject: QueryHistoryStatesRequest): Promise<HistoryStateResults> {
        return new Promise<HistoryStateResults>((resolve, reject)=>{
            var contentType: string;
            var url = this.baseUrl;
            var traitAlias = requestObject.traitAlias;
            if(traitAlias != null){
                if(!KiiUtil.isString(traitAlias)){
                    reject(new ThingIFError(Errors.ArgumentError, "traitAlias is not string"));
                    return;
                }else if(traitAlias.length == 0){
                    reject(new ThingIFError(Errors.ArgumentError, "traitAlias is empty string"));
                    return;
                }
                contentType = "application/vnd.kii.TraitStateQueryRequest+json";
                url = url + `/aliases/${traitAlias}/query`;
            }else{
                contentType = "application/json";
                url = url + "/query";
            }
            var headers = this.addHeader("Content-Type", contentType);
            var query = requestObject.clause.toJson();
            if(requestObject.grouped){
                query["grouped"] = requestObject.grouped;
            }
            var body = {"query": query};

            var req = {
                method: "POST",
                headers: headers,
                url: url,
                body: body,
            };
            request(req).then((res)=>{
                var responseBody = <any>res.body;
                var results: Array<Object> = null;
                var groupedResults: Array<GroupedResults> = null;
                if(requestObject.grouped){
                    groupedResults = [];
                    for(var i in responseBody.results){
                        var result = responseBody.results[i];
                        groupedResults.push(new GroupedResults(
                        new Date(result.range.from),
                        new Date(result.range.to),
                        result.objects));
                    }
                }else{
                    results = responseBody.results;
                }
                var historyStateResults = new HistoryStateResults(
                    responseBody.queryDescription,
                    requestObject.grouped,
                    results,
                    groupedResults);
                resolve(historyStateResults);
            }).catch((err)=>{
                reject(err);
            });
        })
    }
}
