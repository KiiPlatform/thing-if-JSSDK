import { expect } from 'chai';
import { apiHelper, KiiUser, KiiThing } from './utils/APIHelper';
import { testApp } from './utils/TestApp';
import { TestInfo } from './utils/TestInfo';
import { QueryHistoryStatesRequest, QueryGroupedHistoryStatesRequest } from '../../src/RequestObjects';
import * as request from 'popsicle';
import { QueryResult } from '../../src/QueryResult';
import { HistoryState, GroupedHistoryStates } from '../../src/HistoryState';
import { NotEqualsClauseInQuery, AllClause } from '../../src/QueryClause';
import { RangeClauseInTrigger } from '../../src/TriggerClause';
import { TimeRange } from '../../src/TimeRange';
import { APIAuthor } from '../../src/APIAuthor';
import { TypedID } from '../../src/TypedID';


declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');
thingIFSDK.Logger.getInstance().setLogLevel("debug");

describe("Large Tests for APIAuthor#groupedQuery:", function () {

    let user: KiiUser;
    let au: APIAuthor;
    let thingID: string;
    let vendorThingID: string;
    let targetID: TypedID;

    beforeEach(function (done) {
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                vendorThingID,
                password,
                owner,
                TestInfo.DefaultThingType,
                TestInfo.DefaultFirmwareVersion);
            return au.onboardWithVendorThingID(request)
        }).then((result) => {
            expect(result.thingID).not.null;
            thingID = result.thingID;
            targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, thingID);
            done();
        }).catch((err) => {
            done(err);
        })
    });

    afterEach(function (done) {
        if(!!thingID) {
            apiHelper.deleteKiiThing(thingID).then(() => {
                return apiHelper.deleteKiiUser(user);
            }).then(() => {
                done();
            }).catch((err) => {
                done(err);
            })
        }else{
            done();
        }
    })

    describe("query when there is not history state", () => {
        it("empty result should return", (done) => {
            let request: QueryGroupedHistoryStatesRequest = new thingIFSDK.QueryGroupedHistoryStatesRequest(
                TestInfo.AirConditionerAlias,
                new thingIFSDK.TimeRange(new Date(), new Date()));

            au.groupedQuery(targetID, request).then((result: Array<GroupedHistoryStates>) => {
                expect(result).length(0);
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })

    describe("query when there already has history states", () => {
        let expectedStates = [];
        let rangeFrom: Date;
        let rangeTo: Date;
        // insert 3 states
        beforeEach((done) => {
            let state = { "currentTemperature": 11 };
            let aliasState: any = {};
            rangeFrom = new Date();
            expectedStates.push(state);
            aliasState[TestInfo.AirConditionerAlias] = state;
            apiHelper.updateThingState(targetID.toString(), aliasState).then(() => {
                setTimeout(() => {
                    state = { "currentTemperature": 12 };
                    expectedStates.push(state);
                    aliasState[TestInfo.AirConditionerAlias] = state;
                    apiHelper.updateThingState(targetID.toString(), aliasState).then(() => {
                        setTimeout(() => {
                            state = { "currentTemperature": 13 };
                            expectedStates.push(state);
                            aliasState[TestInfo.AirConditionerAlias] = state;
                            apiHelper.updateThingState(targetID.toString(), aliasState).then(() => {
                                rangeTo = new Date();
                                done();
                            });
                        }, 1100);
                    }).catch((err) => {
                        done(err);
                    });
                }, 1100);
            }).catch((err) => {
                done(err);
            });
        })
        it("grouped query, should return expected results", (done) => {
            let request: QueryGroupedHistoryStatesRequest = new thingIFSDK.QueryGroupedHistoryStatesRequest(
                TestInfo.AirConditionerAlias,
                new thingIFSDK.TimeRange(rangeFrom, rangeTo));

            // query only with range
            au.groupedQuery(targetID, request).then((result: Array<GroupedHistoryStates>) => {
                // get all results to a single array
                let actualStates = []
                for (let groupedResult of result) {
                    for (let historyState of groupedResult.states) {
                        actualStates.push(historyState.state);
                    }
                }
                expect(actualStates).deep.equal(expectedStates);
                return au.groupedQuery(targetID, new thingIFSDK.QueryGroupedHistoryStatesRequest(
                    TestInfo.AirConditionerAlias,
                    new thingIFSDK.TimeRange(rangeFrom, rangeTo),
                    thingIFSDK.RangeClauseInQuery.greaterThan("currentTemperature", 11),
                    "v1"));
                // query with clause
            }).then((result: Array<GroupedHistoryStates>) => {
                // get all results to a single array
                let actualStates = []
                for (let groupedResult of result) {
                    for (let historyState of groupedResult.states) {
                        actualStates.push(historyState.state);
                    }
                }
                expect(actualStates).deep.equal([expectedStates[1], expectedStates[2]]);
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })
})