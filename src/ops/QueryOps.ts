import { Promise } from 'es6-promise';
import { TypedID } from '../TypedID';
import { APIAuthor } from '../APIAuthor';
import BaseOp from './BaseOp';
import { QueryResult } from '../QueryResult';
import { HistoryState } from '../HistoryState';
import { QueryHistoryStatesRequest } from '../RequestObjects';
import { ThingIFError, Errors, HttpRequestError } from '../ThingIFError';
import * as KiiUtil from '../internal/KiiUtilities'
import * as JsonUtil from '../internal/JsonUtilities'
import request from './Request';

export class QueryOps extends BaseOp {
    private baseUrl: string
    constructor(
        public au: APIAuthor,
        public targetID: TypedID
    ) {
        super(au);
        this.baseUrl = `${this.au.app.getThingIFBaseUrl()}/targets/${this.targetID.toString()}/states`;
        this.addHeader("Content-Type", "application/vnd.kii.TraitStateQueryRequest+json");
    }

    ungroupedQuery(requestObject: QueryHistoryStatesRequest): Promise<QueryResult<HistoryState>> {
        return new Promise<QueryResult<HistoryState>>((resolve, reject) => {
            if (!requestObject.alias) {
                reject(new ThingIFError(Errors.ArgumentError, "alias is null or empty"));
            } else if (!KiiUtil.isString(requestObject.alias)) {
                reject(new ThingIFError(Errors.ArgumentError, "alias is not string"));
            } else if (!requestObject.clause) {
                reject(new ThingIFError(Errors.ArgumentError, "clause is null"));
            } else if (!KiiUtil.isObject(requestObject.clause)) {
                reject(new ThingIFError(Errors.ArgumentError, "clause is not object"));
            } else {
                let url = `${this.baseUrl}/aliases/${requestObject.alias}/query`
                let requestBody:any = {};
                if (!!requestObject.bestEffortLimit) {
                    requestBody["bestEffortLimit"] = requestObject.bestEffortLimit;
                }
                if (!!requestObject.firmwareVersion) {
                    requestBody["firmwareVersion"] = requestObject.firmwareVersion;
                }
                if (!!requestObject.paginationKey) {
                    requestBody["paginationKey"] = requestObject.paginationKey;
                }

                let queryObj:any = {};
                queryObj["clause"] = JsonUtil.queryClauseToJson(requestObject.clause);
                requestBody["query"] = queryObj;

                var req = {
                    method: "POST",
                    headers: this.getHeaders(),
                    url: url,
                    body: requestBody,
                };
                request(req).then((res) => {
                    let paginationKey = (<any>res.body)["nextPaginationKey"];

                    let results = (<any>res.body)["results"];
                    let historyStates = new Array<HistoryState>();
                    for (let hsJson of results) {
                        historyStates.push(JsonUtil.jsonToHistoryState(hsJson));
                    }
                    resolve(new QueryResult<HistoryState>(historyStates, paginationKey));
                }).catch((err) => {
                    if (err instanceof HttpRequestError) {
                        if (err.status === 409 && err.body.errorCode === "STATE_HISTORY_NOT_AVAILABLE") {
                            resolve(new QueryResult<HistoryState>([]));
                        }
                    }
                    reject(err);
                })
            }
        });
    }
}