import { Promise } from 'es6-promise';
import { TypedID } from '../TypedID';
import { APIAuthor } from '../APIAuthor';
import BaseOp from './BaseOp';
import { QueryResult } from '../QueryResult';
import { HistoryState, GroupedHistoryStates } from '../HistoryState';
import { QueryHistoryStatesRequest, QueryGroupedHistoryStatesRequest, AggregateGroupedHistoryStatesRequest } from '../RequestObjects';
import { ThingIFError, Errors, HttpRequestError } from '../ThingIFError';
import * as KiiUtil from '../internal/KiiUtilities'
import * as JsonUtil from '../internal/JsonUtilities'
import request from './Request';
import { AggregatedResults } from '../AggregatedResult';
import { Aggregation, FunctionType, FieldType } from '../Aggregation';
import { isString } from '../internal/KiiUtilities';

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
    private getUrlOfAlias(alias: string): string {
        return `${this.baseUrl}/aliases/${alias}/query`;
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
                let requestBody: any = {};
                if (!!requestObject.bestEffortLimit) {
                    requestBody["bestEffortLimit"] = requestObject.bestEffortLimit;
                }
                if (!!requestObject.firmwareVersion) {
                    requestBody["firmwareVersion"] = requestObject.firmwareVersion;
                }
                if (!!requestObject.paginationKey) {
                    requestBody["paginationKey"] = requestObject.paginationKey;
                }

                let queryObj: any = {};
                queryObj["clause"] = JsonUtil.queryClauseToJson(requestObject.clause);
                requestBody["query"] = queryObj;

                var req = {
                    method: "POST",
                    headers: this.getHeaders(),
                    url: this.getUrlOfAlias(requestObject.alias),
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
                            return;
                        }
                    }
                    reject(err);
                })
            }
        });
    }

    groupedQuery(requestObject: QueryGroupedHistoryStatesRequest): Promise<Array<GroupedHistoryStates>> {
        return new Promise<Array<GroupedHistoryStates>>((resolve, reject) => {
            if (!requestObject.alias) {
                reject(new ThingIFError(Errors.ArgumentError, "alias is null or empty"));
            } else if (!KiiUtil.isString(requestObject.alias)) {
                reject(new ThingIFError(Errors.ArgumentError, "alias is not string"));
            } else if (!requestObject.range) {
                reject(new ThingIFError(Errors.ArgumentError, "range is null"));
            } else if (!KiiUtil.isObject(requestObject.range)) {
                reject(new ThingIFError(Errors.ArgumentError, "range is not object"));
            } else {
                let requestBody = JsonUtil.groupedQueryToJson(requestObject);
                var req = {
                    method: "POST",
                    headers: this.getHeaders(),
                    url: this.getUrlOfAlias(requestObject.alias),
                    body: requestBody,
                };
                request(req).then((res) => {
                    let jsonResults = (<any>res.body)["groupedResults"];
                    let groupedResults: Array<GroupedHistoryStates> = [];

                    for (let groupedStates of jsonResults) {
                        groupedResults.push(JsonUtil.jsonToGroupedHistoryStates(groupedStates));
                    }
                    resolve(groupedResults);
                }).catch((err) => {
                    if (err instanceof HttpRequestError) {
                        if (err.status === 409 && err.body.errorCode === "STATE_HISTORY_NOT_AVAILABLE") {
                            resolve([]);
                            return;
                        }
                    }
                    reject(err);
                })
            }
        });
    }

    private validateGroupedQuery(groupedQuery: QueryGroupedHistoryStatesRequest): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!groupedQuery) {
                reject(new ThingIFError(Errors.ArgumentError, "QueryGroupedHistoryStatesRequest instance is null"));
            } else if (!groupedQuery.alias) {
                reject(new ThingIFError(Errors.ArgumentError, "alias is null or empty"));
            } else if (!KiiUtil.isString(groupedQuery.alias)) {
                reject(new ThingIFError(Errors.ArgumentError, "alias is not string"));
            } else if (!groupedQuery.range) {
                reject(new ThingIFError(Errors.ArgumentError, "range is null"));
            } else if (!KiiUtil.isObject(groupedQuery.range)) {
                reject(new ThingIFError(Errors.ArgumentError, "range is not object"));
            } else {
                resolve();
            }
        });
    }

    private validateAggregation(aggregation: Aggregation): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (!aggregation) {
                reject(new ThingIFError(Errors.ArgumentError, "Aggregation instance is null"));
            } else if (!aggregation.field) {
                reject(new ThingIFError(Errors.ArgumentError, "field of aggregation is null or empty"));
            } else if (!KiiUtil.isString(aggregation.field)) {
                reject(new ThingIFError(Errors.ArgumentError, "field of aggregation is not string"));
            } else if (!aggregation.fieldType) {
                reject(new ThingIFError(Errors.ArgumentError, "fieldType of aggregation is null or empty"));
            } else if (!KiiUtil.isString(aggregation.fieldType)) {
                reject(new ThingIFError(Errors.ArgumentError, "fieldType of aggregation is not string"));
            } else if (!aggregation.type) {
                reject(new ThingIFError(Errors.ArgumentError, "type of aggregation is null or empty"));
            } else if (!KiiUtil.isString(aggregation.type)) {
                reject(new ThingIFError(Errors.ArgumentError, "type of aggregation is not string"));
            } else {
                if (aggregation.type === FunctionType.MAX ||
                    aggregation.type === FunctionType.MEAN ||
                    aggregation.type === FunctionType.MIN ||
                    aggregation.type === FunctionType.SUM) {
                    if (aggregation.fieldType !== FieldType.DECIMAL &&
                        aggregation.fieldType !== FieldType.INTEGER) {
                        reject(new ThingIFError(Errors.ArgumentError, `unsupported field type ${aggregation.fieldType} for ${aggregation.type} aggregation`));
                        return;
                    }
                }
                resolve();
            }
        });
    }

    aggregateQuery(requestObject: AggregateGroupedHistoryStatesRequest): Promise<Array<AggregatedResults>> {
        return new Promise<Array<AggregatedResults>>((resolve, reject) => {
            this.validateGroupedQuery(requestObject.groupedQuery).then(() => {
                return this.validateAggregation(requestObject.aggregation);
            }).then(() => {
                let requestBody: any = JsonUtil.groupedQueryToJson(requestObject.groupedQuery);
                requestBody.query.aggregations = [JsonUtil.aggregationToJson(requestObject.aggregation)];
                var req = {
                    method: "POST",
                    headers: this.getHeaders(),
                    url: this.getUrlOfAlias(requestObject.groupedQuery.alias),
                    body: requestBody,
                };
                request(req).then((res) => {
                    let jsonResults = (<any>res.body)["groupedResults"];
                    let aggregatedResults = [];
                    for (let jsonResult of jsonResults) {
                        aggregatedResults.push(JsonUtil.jsonToAggregatedResults(jsonResult));
                    }
                    resolve(aggregatedResults);
                }).catch((err) => {
                    if (err instanceof HttpRequestError) {
                        if (err.status === 409 && err.body.errorCode === "STATE_HISTORY_NOT_AVAILABLE") {
                            resolve([]);
                            return;
                        }
                    }
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        });
    }
}