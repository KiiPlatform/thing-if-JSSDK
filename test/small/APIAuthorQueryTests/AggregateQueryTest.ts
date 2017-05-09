import TestApp from '../TestApp';
import { TypedID, Types } from '../../../src/TypedID';
import { APIAuthor } from '../../../src/APIAuthor';
import * as simple from 'simple-mock';
import { QueryOps } from '../../../src/ops/QueryOps';
import { Promise as P } from 'es6-promise'
import { QueryResult } from '../../../src/QueryResult';
import { HistoryState, GroupedHistoryStates } from '../../../src/HistoryState';
import { QueryGroupedHistoryStatesRequest, AggregateGroupedHistoryStatesRequest } from '../../../src/RequestObjects';
import { AllClause } from '../../../src/QueryClause';
import { expect } from 'chai';
import { Errors, HttpRequestError } from '../../../src/ThingIFError';
import { TimeRange } from '../../../src/TimeRange';
import { FunctionType, FieldType, Aggregation } from '../../../src/Aggregation';
import { AggregatedResults } from '../../../src/AggregatedResult';

let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
describe("Small Test APIAuthor#aggregate", function () {
    let defaultRequest = new AggregateGroupedHistoryStatesRequest(
        new QueryGroupedHistoryStatesRequest(
            "alias1",
            new TimeRange(new Date(10), new Date(100)),
            "v1"
        ),
        new Aggregation(FunctionType.MAX, "field1", FieldType.DECIMAL)
    )
    let au = new APIAuthor(ownerToken, testApp.app);

    describe("hanle success response", function () {
        let expectedResults: Array<AggregatedResults> =
            [
                new AggregatedResults(
                    new TimeRange(new Date(11), new Date(20)),
                    13,
                    [
                        new HistoryState({ power: false }, new Date(13))
                    ],
                ),
                new AggregatedResults(
                    new TimeRange(new Date(21), new Date(30)),
                    30,
                    [
                        new HistoryState({ power: true, currentTemperature: 23 }, new Date(22))
                    ]
                )

            ];
        beforeEach(function () {
            simple.mock(QueryOps.prototype, 'aggregateQuery').returnWith(
                new P<Array<AggregatedResults>>((resolve, reject) => {
                    resolve(expectedResults);
                })
            );
        })
        afterEach(function () {
            simple.restore();
        })
        it("test promise", function (done) {
            au.aggregate(target, defaultRequest)
                .then((results: Array<AggregatedResults>) => {
                    expect(results).length(2);
                    expect(results).deep.equal(expectedResults);
                    done();
                }).catch((err) => {
                    done(err);
                })
        })
        it("test callback", function (done) {
            au.aggregate(target, defaultRequest, (err, results) => {
                try {
                    expect(err).to.null;
                    expect(results).length(2);
                    expect(results).deep.equal(expectedResults);
                    done();
                } catch (err) {
                    done(err);
                }
            })
        })
    })

    describe("handle err reponse", function () {
        let expectedError = new HttpRequestError(404, Errors.HttpError, {
            "errorCode": "TARGET_NOT_FOUND",
            "message": "The target is not found"
        })

        beforeEach(function () {
            simple.mock(QueryOps.prototype, 'aggregateQuery').returnWith(
                new P<Array<AggregatedResults>>((resolve, reject) => {
                    reject(expectedError);
                })
            );
        })
        afterEach(function () {
            simple.restore();
        })
        it("test promise", function (done) {
            au.aggregate(target, defaultRequest)
                .then((cmd) => {
                    done("should fail");
                }).catch((err: HttpRequestError) => {
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
        })
        it("test callback", function (done) {
            au.aggregate(target, defaultRequest, (err, cmd) => {
                try {
                    expect(err).to.be.deep.equal(expectedError);
                    expect(cmd).to.null;
                    done();
                } catch (err) {
                    done(err);
                }
            })
        })
    })

})
