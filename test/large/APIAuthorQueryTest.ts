import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import { TestInfo } from './utils/TestInfo';
import { QueryHistoryStatesRequest } from '../../src/RequestObjects';
import * as request from 'popsicle';
import { QueryResult } from '../../src/QueryResult';
import { HistoryState } from '../../src/HistoryState';
import { NotEqualsClauseInQuery, AllClause } from '../../src/QueryClause';
import { RangeClauseInTrigger } from '../../src/TriggerClause';
import { APIAuthor } from '../../src/APIAuthor';

declare var require: any
let thingIFSDK = require('../../../dist/thing-if-sdk.js');
thingIFSDK.Logger.getInstance().setLogLevel("debug");

describe("Large Tests for ThingIFAPI#query:", function () {

    let user: KiiUser;
    let au: APIAuthor;
    let thingID: string;
    let vendorThingID: string;

    beforeEach(function(done) {
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
        }).then((result)=>{
            expect(result.thingID).not.null;
            thingID = result.thingID;
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    afterEach(function(done) {
        apiHelper.deleteKiiThing(thingID).then(()=>{
            return apiHelper.deleteKiiUser(user);
        }).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    describe("query when there is not history state", () => {
     it("empty result should return", (done) => {
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, thingID);
            let request:QueryHistoryStatesRequest = new thingIFSDK.QueryHistoryStatesRequest(
                TestInfo.AirConditionerAlias,
                new thingIFSDK.AllClause());

            au.query(targetID, request).then((result: QueryResult<HistoryState>) => {
                expect(result.hasNext).false;
                expect(result.results.length).equal(0);
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })

    describe("query when there already has history states", () => {
        let expectedStates = [];

        // insert 3 states
        beforeEach((done) => {
                var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, thingID);
                let state = {"currentTemperature": 11};
                let aliasState:any = {};
                expectedStates.push(state);
                aliasState[TestInfo.AirConditionerAlias] = state;
                apiHelper.updateThingState(targetID.toString(), aliasState).then(() => {
                    setTimeout(()=>{
                        state = {"currentTemperature": 12};
                        expectedStates.push(state);
                        aliasState[TestInfo.AirConditionerAlias] = state;
                        apiHelper.updateThingState(targetID.toString(), aliasState).then(() => {
                            setTimeout(()=>{
                                state = {"currentTemperature": 13};
                                expectedStates.push(state);
                                aliasState[TestInfo.AirConditionerAlias] = state;
                                apiHelper.updateThingState(targetID.toString(), aliasState).then(() => {
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
    it("ungrouped query, should return expected results", (done) => {
        var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, thingID);
        let request:QueryHistoryStatesRequest = new thingIFSDK.QueryHistoryStatesRequest(
            TestInfo.AirConditionerAlias,
            new thingIFSDK.AllClause());

        // all query
        au.query(targetID, request).then((result: QueryResult<HistoryState>) => {
            expect(result.hasNext).false;
            expect(result.results.length).equal(3);
            expect(result.results[0].state).deep.equal(expectedStates[0]);
            expect(result.results[1].state).deep.equal(expectedStates[1]);
            expect(result.results[2].state).deep.equal(expectedStates[2]);
            return au.query(targetID, new thingIFSDK.QueryHistoryStatesRequest(
                TestInfo.AirConditionerAlias,
                thingIFSDK.RangeClauseInQuery.greaterThan("currentTemperature", 11)));
        // query with clause
        }).then((result: QueryResult<HistoryState>) => {
            expect(result.hasNext).false;
            expect(result.results.length).equal(2);
            expect(result.results[0].state).deep.equal(expectedStates[1]);
            expect(result.results[1].state).deep.equal(expectedStates[2]);
            return au.query(targetID, new QueryHistoryStatesRequest(
                TestInfo.AirConditionerAlias,
                new thingIFSDK.AllClause(),
                "v1",
                2
            ));
        // query with bestEfforLimit
        }).then((result: QueryResult<HistoryState>) => {
            expect(result.hasNext).true;
            expect(result.results.length).equal(2);
            expect(result.results[0].state).deep.equal(expectedStates[0]);
            expect(result.results[1].state).deep.equal(expectedStates[1]);
            return au.query(targetID, new QueryHistoryStatesRequest(
                TestInfo.AirConditionerAlias,
                new thingIFSDK.AllClause(),
                "v1",
                2,
                result.paginationKey
            ));
        // query with paginationKey
        }).then((result: QueryResult<HistoryState>) => {
            expect(result.hasNext).false;
            expect(result.results.length).equal(1);
            expect(result.results[0].state).deep.equal(expectedStates[2]);
            done();
        }).catch((err) => {
            done(err);
        })
    })
    })
})