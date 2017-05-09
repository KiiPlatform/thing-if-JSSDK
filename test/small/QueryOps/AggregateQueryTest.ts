import { Errors, HttpRequestError } from '../../../src/ThingIFError';
import { AllClause, EqualsClauseInQuery } from '../../../src/QueryClause';
import TestApp from '../TestApp';
import { APIAuthor } from '../../../src/APIAuthor';
import { TypedID, Types } from '../../../src/TypedID';
import { QueryOps } from '../../../src/ops/QueryOps';
import { QueryGroupedHistoryStatesRequest, QueryHistoryStatesRequest, AggregateGroupedHistoryStatesRequest } from '../../../src/RequestObjects';
import { expect } from 'chai';
import { Promise as P } from 'es6-promise'
import * as nock from 'nock'
import { QueryResult } from '../../../src/QueryResult';
import { HistoryState, GroupedHistoryStates } from '../../../src/HistoryState';
import { TimeRange } from '../../../src/TimeRange';
import { Aggregation, FieldType, FunctionType } from '../../../src/Aggregation';
import { AggregatedResults } from '../../../src/AggregatedResult';

let scope: nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let targetID = new TypedID(Types.Thing, "dummyid");
let queryOps = new QueryOps(au, targetID);
let validAggregation = new Aggregation(
    FunctionType.COUNT,
    "field1",
    FieldType.ARRAY);
let validGroupedQuery = new QueryGroupedHistoryStatesRequest(
    "alias1",
    new TimeRange(new Date(10), new Date(100)),
    new AllClause(), "v1");
describe("Test QueryOps#aggregateQuery", () => {
    describe("validate parameter", () => {
        class TestCase {
            constructor(
                public groupedQuery: QueryGroupedHistoryStatesRequest | null,
                public aggregation: Aggregation | null,
                public expectedError: string
            ) { }
        }
        let testCases = [
            // null validate
            new TestCase(null, null, Errors.ArgumentError),
            new TestCase(null, validAggregation, Errors.ArgumentError),
            new TestCase(validGroupedQuery, null, Errors.ArgumentError),
            // invalid groupedQuery
            new TestCase(
                new QueryGroupedHistoryStatesRequest(
                    null,
                    new TimeRange(new Date(), new Date())
                ),
                validAggregation,
                Errors.ArgumentError),
            new TestCase(
                new QueryGroupedHistoryStatesRequest(
                    "",
                    new TimeRange(new Date(), new Date())
                ),
                validAggregation,
                Errors.ArgumentError),
            new TestCase(
                new QueryGroupedHistoryStatesRequest(
                    "alias1",
                    null
                ),
                validAggregation,
                Errors.ArgumentError),
            new TestCase(
                new QueryGroupedHistoryStatesRequest(
                    "alias1",
                    <any>"from 10 to 100"
                ),
                validAggregation,
                Errors.ArgumentError),
            // invalid aggregation
            new TestCase(
                validGroupedQuery,
                new Aggregation(null, "field1", FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation("", "field1", FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.COUNT, null, FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.COUNT, "", FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.COUNT, "field1", ""),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.COUNT, "field1", null),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MAX, "field1", FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MAX, "field1", FieldType.BOOLEAN),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MAX, "field1", FieldType.OBJECT),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MEAN, "field1", FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MEAN, "field1", FieldType.BOOLEAN),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MEAN, "field1", FieldType.OBJECT),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MIN, "field1", FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MIN, "field1", FieldType.BOOLEAN),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.MIN, "field1", FieldType.OBJECT),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.SUM, "field1", FieldType.ARRAY),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.SUM, "field1", FieldType.BOOLEAN),
                Errors.ArgumentError
            ),
            new TestCase(
                validGroupedQuery,
                new Aggregation(FunctionType.SUM, "field1", FieldType.OBJECT),
                Errors.ArgumentError
            ),
        ]
        testCases.forEach((testCase) => {
            it(`when groupedQuery is ${JSON.stringify(testCase.groupedQuery)},`+
            `aggregation is ${JSON.stringify(testCase.aggregation)},` +
                `${testCase.expectedError} error should be returned`, (done) => {
                    queryOps.aggregateQuery(new AggregateGroupedHistoryStatesRequest(testCase.groupedQuery, testCase.aggregation))
                        .then(() => {
                            expect.fail("should not succeeded");
                            done();
                        })
                        .catch((err) => {
                            expect(err.name).to.equal(testCase.expectedError);
                            done();
                        });

                })
        })
    })

    describe("handle http response", () => {

        let path = `/thing-if/apps/${testApp.appID}/targets/${targetID.toString()}/states`;
        let expectedReqHeaders = {
            "Content-Type": "application/vnd.kii.TraitStateQueryRequest+json",
            "Authorrization": `Bearer ${au.token}`
        };

        beforeEach(() => {
            nock.cleanAll();
        });

        describe("handle success response", () => {
            describe("provide valid parameters", () => {
                it("when return not empty result, query result should be rexpected", (done) => {
                    let requestObj =
                        new AggregateGroupedHistoryStatesRequest(
                            new QueryGroupedHistoryStatesRequest(
                                "alias1",
                                new TimeRange(new Date(10), new Date(100)),
                                new EqualsClauseInQuery("field1", 23),
                                "v1"
                            ),
                            new Aggregation(FunctionType.MAX, "field1", FieldType.INTEGER)
                        );
                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .post(`${path}/aliases/${requestObj.groupedQuery.alias}/query`, {
                            query: {
                                grouped: true,
                                clause: {
                                    type: "and",
                                    clauses: [
                                        {
                                            type: "eq",
                                            field: "field1",
                                            value: 23
                                        },
                                        {
                                            type: "withinTimeRange",
                                            lowerLimit: 10,
                                            upperLimit: 100
                                        },
                                    ]
                                },
                                aggregations: [
                                    {
                                        type: "MAX",
                                        field: "field1",
                                        fieldType: "INTEGER",
                                        putAggregationInto: "max"
                                    }
                                ]
                            }
                        })
                        .reply(
                        200,
                        {
                            groupedResults: [
                                {
                                    range: { from: 11, to: 20 },
                                    aggregations: [
                                        {
                                            value: 24,
                                            name: "max",
                                            object: {
                                                power: true,
                                                currentTemperature: 24,
                                                _created: 13
                                            }
                                        }
                                    ]
                                },
                                {
                                    range: { from: 21, to: 30 },
                                    aggregations: []
                                }
                            ]
                        },
                        { "Content-Type": "application/json" });

                    queryOps.aggregateQuery(requestObj).then((result: Array<AggregatedResults>) => {
                        expect(result).length(2);
                        expect(result[0]).deep.equal(new AggregatedResults(
                            new TimeRange(new Date(11), new Date(20)),
                            24,
                            [
                                new HistoryState({ power: true, currentTemperature: 24 }, new Date(13))
                            ]))
                        expect(result[1]).deep.equal(new AggregatedResults(
                            new TimeRange(new Date(21), new Date(30)),
                            undefined,
                            undefined
                        ))
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                })
                it("when return empty result, query result should be expected", (done) => {
                    let requestObj =
                        new AggregateGroupedHistoryStatesRequest(
                            new QueryGroupedHistoryStatesRequest(
                                "alias1",
                                new TimeRange(new Date(10), new Date(100))
                            ),
                            new Aggregation(FunctionType.MAX, "field1", FieldType.INTEGER)
                        );
                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .post(`${path}/aliases/${requestObj.groupedQuery.alias}/query`, {
                            query: {
                                grouped: true,
                                clause: {
                                    type: "withinTimeRange",
                                    lowerLimit: 10,
                                    upperLimit: 100
                                },
                                aggregations: [
                                    {
                                        type: "MAX",
                                        field: "field1",
                                        fieldType: "INTEGER",
                                        putAggregationInto: "max"
                                    }
                                ]
                            }
                        })
                        .reply(
                        200,
                        {
                            groupedResults: [
                                {
                                    range: { from: 10, to: 100 },
                                    aggregations: []
                                }
                            ]
                        },
                        { "Content-Type": "application/json" });

                    queryOps.aggregateQuery(requestObj).then((result: Array<AggregatedResults>) => {
                        expect(result).length(1);
                        expect(result[0]).deep.equal(new AggregatedResults(
                            new TimeRange(new Date(10), new Date(100)),
                            undefined,
                            undefined
                        ))
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                })
            })
        })

        describe("handle err response", () => {
            let defaultRequestObj =
                new AggregateGroupedHistoryStatesRequest(
                    new QueryGroupedHistoryStatesRequest(
                        "alias1",
                        new TimeRange(new Date(10), new Date(100))
                    ),
                    new Aggregation(FunctionType.MAX, "field1", FieldType.INTEGER)
                );
            it("handle 404 respones", (done) => {
                let date = new Date();
                let errResponse: any = {
                    "errorCode": "TARGET_NOT_FOUND",
                    "message": `Target ${targetID.toString()} not found`
                }

                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .post(`${path}/aliases/${defaultRequestObj.groupedQuery.alias}/query`, {
                        query: {
                            grouped: true,
                            clause: {
                                type: "withinTimeRange",
                                lowerLimit: 10,
                                upperLimit: 100
                            },
                            aggregations: [
                                {
                                    type: "MAX",
                                    field: "field1",
                                    fieldType: "INTEGER",
                                    putAggregationInto: "max"
                                }
                            ]
                        }
                    })
                    .reply(
                    404,
                    errResponse,
                    { "Content-Type": "application/json" }
                    );
                queryOps.aggregateQuery(defaultRequestObj).then(() => {
                    done("should fail");
                }).catch((err: HttpRequestError) => {
                    expect(err.status).to.be.equal(404);
                    expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                    expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                    expect(err.body.message).to.be.equal(errResponse.message);
                    done();
                }).catch((err) => {
                    done(err);
                })
            })
            it("when not data in server, 409 reponse, should not treat as error", (done) => {
                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .post(`${path}/aliases/${defaultRequestObj.groupedQuery.alias}/query`, {
                        query: {
                            grouped: true,
                            clause: {
                                type: "withinTimeRange",
                                lowerLimit: 10,
                                upperLimit: 100
                            },
                            aggregations: [
                                {
                                    type: "MAX",
                                    field: "field1",
                                    fieldType: "INTEGER",
                                    putAggregationInto: "max"
                                }
                            ]
                        }
                    })
                    .reply(
                    409,
                    {
                        errorCode: "STATE_HISTORY_NOT_AVAILABLE",
                        message: "Time series bucket does not exist"
                    },
                    { "Content-Type": "application/json" }
                    );
                queryOps.aggregateQuery(defaultRequestObj).then((result: Array<GroupedHistoryStates>) => {
                    expect(result).length(0);
                    done();
                }).catch((err) => {
                    done(err);
                })

            })
        })
    })
})