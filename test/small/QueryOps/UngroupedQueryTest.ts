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
import { HistoryState } from '../../../src/HistoryState';

let scope: nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let targetID = new TypedID(Types.Thing, "dummyid");
let queryOps = new QueryOps(au, targetID);
describe("Test QueryOps#ungroupedQuery", () => {
    describe("validate parameter", () => {
        class TestCase {
            constructor(
                public alias: any,
                public clause: any,
                public expectedError: string
            ) { }
        }
        let testCases = [
            new TestCase(null, new AllClause(), Errors.ArgumentError),
            new TestCase(2, new AllClause(), Errors.ArgumentError),
            new TestCase("", new AllClause(), Errors.ArgumentError),
            new TestCase("alias", null, Errors.ArgumentError),
            new TestCase("alias", "clause", Errors.ArgumentError),
            new TestCase(null, null, Errors.ArgumentError)
        ]
        testCases.forEach((testCase) => {
            it(`when alias is ${testCase.alias}, clause is ${testCase.clause},` +
                `${testCase.expectedError} error should be returned`, (done) => {
                    queryOps.ungroupedQuery(new QueryHistoryStatesRequest(testCase.alias, testCase.clause))
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
            describe("provide required parameters", () => {
                it("when return empty result, query result should be rexpected", (done) => {
                    let requestObj = new QueryHistoryStatesRequest("alias1", new AllClause());
                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .post(`${path}/aliases/${requestObj.alias}/query`, {
                            query: {
                                clause: {
                                    type: "all"
                                }
                            }
                        })
                        .reply(
                        201,
                        {
                            results: []
                        },
                        { "Content-Type": "application/json" });

                    queryOps.ungroupedQuery(requestObj).then((result: QueryResult<HistoryState>) => {
                        expect(result.hasNext).false;
                        expect(result.results.length).to.equal(0);
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                })
                it("when return non empty result, query result should be expected", (done) => {
                    let requestObj = new QueryHistoryStatesRequest("alias1", new AllClause());
                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .post(`${path}/aliases/${requestObj.alias}/query`, {
                            query: {
                                clause: {
                                    type: "all"
                                }
                            }
                        })
                        .reply(
                        201,
                        {
                            results: [
                                {
                                    power: false,
                                    _created: 1
                                },
                                {
                                    power: true,
                                    _created: 2
                                }
                            ]
                        },
                        { "Content-Type": "application/json" });

                    queryOps.ungroupedQuery(requestObj).then((result: QueryResult<HistoryState>) => {
                        expect(result.hasNext).false;
                        expect(result.results.length).to.equal(2);
                        expect(result.results[0]).to.deep.equal(new HistoryState({ power: false }, new Date(1)));
                        expect(result.results[1]).to.deep.equal(new HistoryState({ power: true }, new Date(2)));
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                })
                it("when return paginationKey, query result should be expected", (done) => {
                    let requestObj = new QueryHistoryStatesRequest("alias1", new AllClause());
                    scope = nock(testApp.site, <any>expectedReqHeaders)
                        .post(`${path}/aliases/${requestObj.alias}/query`, {
                            query: {
                                clause: {
                                    type: "all"
                                }
                            }
                        })
                        .reply(
                        201,
                        {
                            results: [
                                {
                                    power: false,
                                    _created: 1
                                },
                                {
                                    power: true,
                                    _created: 2
                                }
                            ],
                            nextPaginationKey: "2/1"
                        },
                        { "Content-Type": "application/json" });

                    queryOps.ungroupedQuery(requestObj).then((result: QueryResult<HistoryState>) => {
                        expect(result.hasNext).true;
                        expect(result.results.length).to.equal(2);
                        expect(result.results[0]).to.deep.equal(new HistoryState({ power: false }, new Date(1)));
                        expect(result.results[1]).to.deep.equal(new HistoryState({ power: true }, new Date(2)));
                        expect(result.paginationKey).equal("2/1");
                        done();
                    }).catch((err) => {
                        done(err);
                    })
                })
            })
            describe("provide optional parameters", () => {
                class TestCase {
                    constructor(
                        public bestEffortLimit: number | undefined,
                        public paginationKey: string | undefined,
                        public firmwareVersion: string | undefined
                    ) { }
                }
                let testCases: Array<TestCase> = [
                    new TestCase(3, "200/1", "v1"),
                    new TestCase(3, undefined, undefined),
                    new TestCase(undefined, "200/1", undefined),
                    new TestCase(undefined, undefined, "v1")
                ];
                testCases.forEach((testCase) => {
                    it(`provide bestEffortLimit=${testCase.bestEffortLimit}, ` +
                        `paginationKey=${testCase.paginationKey}, ` +
                        `firmwareVersion=${testCase.firmwareVersion}, request body should be expected`, (done) => {
                            let requestObj = new QueryHistoryStatesRequest(
                                "alias1",
                                new AllClause(),
                                testCase.firmwareVersion,
                                testCase.bestEffortLimit,
                                testCase.paginationKey)
                            scope = nock(testApp.site, <any>expectedReqHeaders)
                                .post(`${path}/aliases/${requestObj.alias}/query`, function (body) {
                                    return body.bestEffortLimit === testCase.bestEffortLimit &&
                                        body.paginationKey === testCase.paginationKey &&
                                        body.firmwareVersion === testCase.firmwareVersion;
                                }).reply(201, { results: [] }, { "Content-Type": "application/json" });

                            queryOps.ungroupedQuery(requestObj).then((result: QueryResult<HistoryState>) => {
                                expect(result.hasNext).false;
                                expect(result.results.length).to.equal(0);
                                done();
                            }).catch((err) => {
                                done(err);
                            })
                        })
                })
            })
        })

        describe("handle err response", () => {
            let defaultRequestObj = new QueryHistoryStatesRequest("alias", new AllClause());
            it("handle 404 respones", (done) => {
                let date = new Date();
                let errResponse: any = {
                    "errorCode": "TARGET_NOT_FOUND",
                    "message": `Target ${targetID.toString()} not found`
                }

                scope = nock(testApp.site, <any>expectedReqHeaders)
                    .post(`${path}/aliases/${defaultRequestObj.alias}/query`, {
                        query: {
                            clause: {
                                type: "all"
                            }
                        }
                    })
                    .reply(
                    404,
                    errResponse,
                    { "Content-Type": "application/json" }
                    );
                queryOps.ungroupedQuery(defaultRequestObj).then(() => {
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
                            clause: {
                                type: "all"
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
                queryOps.ungroupedQuery(defaultRequestObj).then((result: QueryResult<HistoryState>) => {
                    expect(result.hasNext).false;
                    expect(result.results.length).to.equal(0);
                    done();
                }).catch((err) => {
                    done(err);
                })

            })
        })
    })
})