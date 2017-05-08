import { Errors, HttpRequestError } from '../../../src/ThingIFError';
import { AllClause } from '../../../src/QueryClause';
import TestApp from '../TestApp';
import { APIAuthor } from '../../../src/APIAuthor';
import { TypedID, Types } from '../../../src/TypedID';
import { QueryOps } from '../../../src/ops/QueryOps';
import { QueryGroupedHistoryStatesRequest, QueryHistoryStatesRequest } from '../../../src/RequestObjects';
import { expect } from 'chai';
import { Promise as P } from 'es6-promise'
import * as nock from 'nock'
import { QueryResult } from '../../../src/QueryResult';
import { HistoryState, GroupedHistoryStates } from '../../../src/HistoryState';
import { TimeRange } from '../../../src/TimeRange';

let scope: nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let targetID = new TypedID(Types.Thing, "dummyid");
let queryOps = new QueryOps(au, targetID);
describe("Test QueryOps#groupedQuery", () => {
    describe("validate parameter", () => {
        class TestCase {
            constructor(
                public alias: any,
                public range: any,
                public expectedError: string
            ) { }
        }
        let testCases = [
            new TestCase(null, new TimeRange(new Date(10), new Date(100)), Errors.ArgumentError),
            new TestCase(2, new TimeRange(new Date(10), new Date(100)), Errors.ArgumentError),
            new TestCase("", new TimeRange(new Date(10), new Date(100)), Errors.ArgumentError),
            new TestCase("alias", null, Errors.ArgumentError),
            new TestCase("alias", "clause", Errors.ArgumentError),
            new TestCase(null, null, Errors.ArgumentError)
        ]
        testCases.forEach((testCase) => {
            it(`when alias is ${testCase.alias}, range is ${JSON.stringify(testCase.range)},` +
                `${testCase.expectedError} error should be returned`, (done) => {
                    queryOps.groupedQuery(new QueryGroupedHistoryStatesRequest(testCase.alias, testCase.range))
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
                    let requestObj = new QueryGroupedHistoryStatesRequest("alias1", new TimeRange(new Date(10), new Date(100)));
                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .post(`${path}/aliases/${requestObj.alias}/query`, {
                            query: {
                                grouped: true,
                                clause: {
                                    type: "withinTimeRange",
                                    lowerLimit: 10,
                                    upperLimit: 100
                                }
                            }
                        })
                        .reply(
                        200,
                        {
                            groupedResults: [
                                {
                                    range: { from: 11, to: 20 },
                                    objects: [
                                        { power: true, _created: 12 },
                                        { power: true, currentTemperature: 23, _created: 13 }
                                    ]
                                },
                                {
                                    range: { from: 21, to: 30 },
                                    objects: [
                                        { power: false, _created: 22 }
                                    ]
                                }
                            ]
                        },
                        { "Content-Type": "application/json" });

                    queryOps.groupedQuery(requestObj).then((result: Array<GroupedHistoryStates>) => {
                        expect(result).length(2);
                        expect(result[0]).deep.equal(new GroupedHistoryStates(
                            new TimeRange(new Date(11), new Date(20)),
                            [
                                new HistoryState({ power: true }, new Date(12)),
                                new HistoryState({ power: true, currentTemperature: 23 }, new Date(13))
                            ]))
                        expect(result[1]).deep.equal(new GroupedHistoryStates(
                            new TimeRange(new Date(21), new Date(30)),
                            [new HistoryState({ power: false }, new Date(22))]
                        ))
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                })
                it("when return empty result, query result should be expected", (done) => {
                    let requestObj = new QueryGroupedHistoryStatesRequest("alias1", new TimeRange(new Date(10), new Date(100)));
                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .post(`${path}/aliases/${requestObj.alias}/query`, {
                            query: {
                                grouped: true,
                                clause: {
                                    type: "withinTimeRange",
                                    lowerLimit: 10,
                                    upperLimit: 100
                                }
                            }
                        })
                        .reply(
                        200,
                        {
                            groupedResults: []
                        },
                        { "Content-Type": "application/json" });

                    queryOps.groupedQuery(requestObj).then((result: Array<GroupedHistoryStates>) => {
                        expect(result).length(0);
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                })
            })
        })

        describe("handle err response", () => {
            let defaultRequestObj = new QueryGroupedHistoryStatesRequest("alias", new TimeRange(new Date(10), new Date(100)));
            it("handle 404 respones", (done) => {
                let date = new Date();
                let errResponse: any = {
                    "errorCode": "TARGET_NOT_FOUND",
                    "message": `Target ${targetID.toString()} not found`
                }

                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .post(`${path}/aliases/${defaultRequestObj.alias}/query`, {
                        query: {
                            grouped: true,
                            clause: {
                                type: "withinTimeRange",
                                lowerLimit: 10,
                                upperLimit: 100
                            }
                        }
                    })
                    .reply(
                    404,
                    errResponse,
                    { "Content-Type": "application/json" }
                    );
                queryOps.groupedQuery(defaultRequestObj).then(() => {
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
                    .post(`${path}/aliases/${defaultRequestObj.alias}/query`, {
                        query: {
                            grouped: true,
                            clause: {
                                type: "withinTimeRange",
                                lowerLimit: 10,
                                upperLimit: 100
                            }
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
                queryOps.groupedQuery(defaultRequestObj).then((result: Array<GroupedHistoryStates>) => {
                    expect(result).length(0);
                    done();
                }).catch((err) => {
                    done(err);
                })

            })
        })
    })
})