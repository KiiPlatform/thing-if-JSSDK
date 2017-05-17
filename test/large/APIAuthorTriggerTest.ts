/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import { TestInfo } from './utils/TestInfo';
import { EqualsClauseInTrigger } from '../../src/TriggerClause';
import { AliasAction } from '../../src/AliasAction';

import {
    TypedID,
    Types,
    PostCommandTriggerRequest,
    OnboardWithVendorThingIDRequest,
    Condition,
    StatePredicate,
    TriggersWhen,
    APIAuthor,
    Trigger,
    PatchCommandTriggerRequest,
    PostServerCodeTriggerRequest,
    PatchServerCodeTriggerRequest,
    TriggerCommandObject
} from '../../src/ThingIFSDK'

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');
describe("Large Tests for APIAuthor Trigger APIs:", function () {
    let user: KiiUser;
    let au: APIAuthor;
    let adminToken: string;
    let targetThingID: string;

    beforeEach(function(done) {
        // 1. create KiiUser
        // 2. get AdminToken
        // 3. onboard thing
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            au = new thingIFSDK.APIAuthor(newUser.token, testApp);
            return apiHelper.getAdminToken();
        }).then((token: string) => {
            adminToken = token;
            var vendorThingID = "vendor-" + new Date().getTime();
            var password = "password";
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                vendorThingID,
                password,
                owner,
                TestInfo.DefaultThingType,
                TestInfo.DefaultFirmwareVersion);
            return au.onboardWithVendorThingID(request);
        }).then((result:any) => {
            targetThingID = result.thingID;
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    afterEach(function(done) {
        apiHelper.deleteKiiUser(user).then(()=>{
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    describe("Command Trigger", function () {
        it("all operations", function (done) {
            var triggerID1: string;
            var triggerID2: string;
            var actions = [
                new thingIFSDK.AliasAction(TestInfo.AirConditionerAlias, [
                    new thingIFSDK.Action("turnPower", true)
                ])
            ];
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, targetThingID);

            var condition = new thingIFSDK.Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", false));
            var statePredicate = new thingIFSDK.StatePredicate(condition, thingIFSDK.TriggersWhen.CONDITION_CHANGED);
            var commandRequest = new TriggerCommandObject(actions, targetID, issuerID);
            var request = new PostCommandTriggerRequest(commandRequest, statePredicate);

            // 1. create command trigger with StatePredicate
            au.postCommandTrigger(targetID, request).then((trigger:any)=>{
                triggerID1 = trigger.triggerID;
                expect(triggerID1).to.be.not.null;
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.getEventSource()).to.equal("STATES");
                expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                expect(trigger.predicate.condition).to.deep.equal(condition);
                expect(trigger.command.aliasActions).to.deep.equal(actions);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);
                expect(trigger.serverCode).undefined;

                // 2. create command trigger with SchedulePredicate
                var schedulePredicate = new thingIFSDK.SchedulePredicate("0 12 1 * *");
                request = new PostCommandTriggerRequest(new TriggerCommandObject(actions, targetID, issuerID), schedulePredicate);
                // Admin token is needed when allowCreateTaskByPrincipal=false
                (<any>au)._token = adminToken;
                return au.postCommandTrigger(targetID, request);
            }).then((trigger:any)=>{
                triggerID2 = trigger.triggerID;
                expect(triggerID2).to.be.not.null;
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.schedule).to.equal("0 12 1 * *");
                expect(trigger.command.aliasActions).to.deep.equal(actions);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);
                expect(trigger.serverCode).undefined;

                // 3. disable trigger
                return au.enableTrigger(targetID, triggerID2, false);
            }).then((trigger:any)=>{
                expect(trigger.triggerID).to.equal(triggerID2);
                expect(trigger.disabled).to.be.true;
                expect(trigger.predicate.schedule).to.equal("0 12 1 * *");
                expect(trigger.command.aliasActions).to.deep.equal(actions);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);
                expect(trigger.serverCode).undefined;

                // 4. list triggers
                (<any>au)._token = user.token;
                return au.listTriggers(targetID, new thingIFSDK.ListQueryOptions());
            }).then((queryResult:any)=>{
                expect(queryResult.results.length).to.equal(2);
                expect(queryResult.paginationKey).to.be.null;
                expect(queryResult.hasNext).to.be.false;
                var trigger1 = queryResult.results[0];
                for (var trigger of queryResult.results) {
                    if (trigger.triggerID == triggerID1) {
                        expect(trigger.disabled).to.be.false;
                        expect(trigger.predicate.getEventSource()).to.equal("STATES");
                        expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                        expect(trigger.predicate.condition).to.deep.equal(condition);
                        expect(trigger.command.aliasActions).to.deep.equal(actions);
                        expect(trigger.command.targetID).to.deep.equal(targetID);
                        expect(trigger.command.issuerID).to.deep.equal(issuerID);
                        expect(trigger.serverCode).undefined;
                    } else if (trigger.triggerID == triggerID2) {
                        expect(trigger.disabled).to.be.true;
                        expect(trigger.predicate.schedule).to.equal("0 12 1 * *");
                        expect(trigger.command.aliasActions).to.deep.equal(actions);
                        expect(trigger.command.targetID).to.deep.equal(targetID);
                        expect(trigger.command.issuerID).to.deep.equal(issuerID);
                        expect(trigger.serverCode).undefined;
                    } else {
                        done("Unexpected TriggerID");
                    }
                }
                // 5. update trigger
                var commandRequest = new TriggerCommandObject([
                        new thingIFSDK.AliasAction(TestInfo.HumidityAlias, [
                            new thingIFSDK.Action("setPresetHumidity", 45)
                        ])
                    ], targetID, issuerID);
                request = new PatchCommandTriggerRequest(commandRequest, statePredicate);
                return au.patchCommandTrigger(targetID, triggerID1, request);
            }).then((trigger:any)=>{
                expect(trigger.triggerID).to.equal(triggerID1);
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.getEventSource()).to.equal("STATES");
                expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                expect(trigger.predicate.condition).to.deep.equal(condition);
                expect(trigger.command.aliasActions).to.deep.equal([
                    new thingIFSDK.AliasAction(TestInfo.HumidityAlias, [
                        new thingIFSDK.Action("setPresetHumidity", 45)
                    ])
                ]);
                expect(trigger.command.targetID).to.deep.equal(targetID);
                expect(trigger.command.issuerID).to.deep.equal(issuerID);
                expect(trigger.serverCode).undefined;
                // 6. delete trigger
                (<any>au)._token = adminToken;
                return au.deleteTrigger(targetID, triggerID2);
            }).then((deletedTriggerID:string)=>{
                expect(deletedTriggerID).to.equal(triggerID2);
                // 7. list triggers
                return au.listTriggers(targetID, new thingIFSDK.ListQueryOptions());
            }).then((queryResult:any)=>{
                expect(queryResult.results.length).to.equal(1);
                expect(queryResult.paginationKey).to.be.null;
                expect(queryResult.hasNext).to.be.false;
                expect(queryResult.results[0].triggerID).to.equal(triggerID1);
                expect(queryResult.results[0].disabled).to.be.false;
                expect(queryResult.results[0].predicate.getEventSource()).to.equal("STATES");
                expect(queryResult.results[0].predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                expect(queryResult.results[0].predicate.condition).to.deep.equal(condition);
                expect(queryResult.results[0].command.aliasActions).to.deep.equal([
                    new thingIFSDK.AliasAction(TestInfo.HumidityAlias, [
                        new thingIFSDK.Action("setPresetHumidity", 45)
                    ])
                ]);
                expect(queryResult.results[0].command.targetID).to.deep.equal(targetID);
                expect(queryResult.results[0].command.issuerID).to.deep.equal(issuerID);
                expect(queryResult.results[0].serverCode).undefined;
                done();
            }).catch((err:Error)=>{
                done(err);
            });

        });

        describe("Post cross thing command trigger", function(){
            let commandTargetID: string;
            beforeEach(function(done) {
                var vendorThingID = "vendor-" + new Date().getTime();
                var password = "password";
                var owner = new TypedID(Types.User, user.userID);
                var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                    vendorThingID,
                    password,
                    owner,
                    TestInfo.DefaultThingType,
                    TestInfo.DefaultFirmwareVersion
                );
                au.onboardWithVendorThingID(request
                ).then((result:any) => {
                    commandTargetID = result.thingID;
                    done();
                }).catch((err)=>{
                    done(err);
                })
            });
            it("should succeeded", function (done) {
                var triggerID1: string;
                var actions = [
                    new thingIFSDK.AliasAction(TestInfo.AirConditionerAlias, [
                        new thingIFSDK.Action("turnPower", true)
                    ])
                ];
                var issuerID = new TypedID(Types.User, user.userID);
                var targetID = new TypedID(Types.Thing, targetThingID);
                var commandTarget = new TypedID(Types.Thing, commandTargetID);

                var condition = new Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", false));
                var statePredicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
                var commandRequest = new TriggerCommandObject(actions, commandTarget, issuerID);
                var request = new PostCommandTriggerRequest(commandRequest, statePredicate);

                // 1. create command trigger with StatePredicate
                au.postCommandTrigger(targetID, request).then((trigger:any)=>{
                    triggerID1 = trigger.triggerID;
                    expect(triggerID1).to.be.not.null;
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(trigger.predicate.condition).to.deep.equal(condition);
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(commandTarget);
                    expect(trigger.command.issuerID).to.deep.equal(issuerID);
                    expect(trigger.serverCode).undefined;
                    done();
                }).catch((err:Error)=>{
                    done(err);
                });
            });
        });
        describe("Patch cross thing command trigger", function(){
            let commandTargetID: string;
            beforeEach(function(done) {
                var vendorThingID = "vendor-" + new Date().getTime();
                var password = "password";
                var owner = new TypedID(Types.User, user.userID);
                var request = new thingIFSDK.OnboardWithVendorThingIDRequest(
                    vendorThingID,
                    password,
                    owner,
                    TestInfo.DefaultThingType,
                    TestInfo.DefaultFirmwareVersion
                );
                au.onboardWithVendorThingID(request
                ).then((result:any) => {
                    commandTargetID = result.thingID;
                    done();
                }).catch((err)=>{
                    done(err);
                })
            });
            it("should succeeded", function (done) {
                var triggerID1: string;
                var actions = [
                    new thingIFSDK.AliasAction(TestInfo.AirConditionerAlias, [
                        new thingIFSDK.Action("turnPower", true)
                    ])
                ];
                var issuerID = new TypedID(Types.User, user.userID);
                var targetID = new TypedID(Types.Thing, targetThingID);
                let commandTarget = new TypedID(Types.Thing, commandTargetID);

                var condition = new Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", false));
                var statePredicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
                var commandRequest = new TriggerCommandObject(actions, targetID, issuerID);
                var request = new PostCommandTriggerRequest(commandRequest, statePredicate);

                // 1. create command trigger with StatePredicate
                au.postCommandTrigger(targetID, request).then((trigger:any)=>{
                    triggerID1 = trigger.triggerID;
                    expect(triggerID1).to.be.not.null;
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(trigger.predicate.condition).to.deep.equal(condition);
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(targetID);
                    expect(trigger.command.issuerID).to.deep.equal(issuerID);
                    expect(trigger.serverCode).undefined;
                    // 2. patch command trigger as cross thing trigger
                    var commandRequest = new TriggerCommandObject([
                        new thingIFSDK.AliasAction(TestInfo.HumidityAlias, [
                            new thingIFSDK.Action("setPresetHumidity", 45)
                        ])
                    ], commandTarget, issuerID);
                    request = new PatchCommandTriggerRequest(commandRequest, statePredicate);
                    return au.patchCommandTrigger(targetID, triggerID1, request);
                }).then((updatedTrigger: Trigger) =>{
                    let newTarget = new TypedID(Types.Thing, commandTargetID);
                    expect(updatedTrigger.triggerID).to.be.equal(triggerID1);
                    expect(updatedTrigger.disabled).to.be.false;
                    var statePredicate = <StatePredicate>updatedTrigger.predicate;
                    expect(statePredicate.getEventSource()).to.equal("STATES");
                    expect(statePredicate.triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(JSON.stringify(statePredicate.condition)).to.deep.equal(JSON.stringify(condition));
                    expect(updatedTrigger.command.aliasActions).to.deep.equal([
                            new thingIFSDK.AliasAction(TestInfo.HumidityAlias, [
                            new thingIFSDK.Action("setPresetHumidity", 45)
                        ])
                    ]);
                    expect(updatedTrigger.command.targetID.toString()).to.deep.equal(commandTarget.toString());
                    expect(updatedTrigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(updatedTrigger.serverCode).undefined;
                    done();
                })
                .catch((err:Error)=>{
                    done(err);
                });
            });
        });
    });
    describe("ServerCode Trigger", function () {
        beforeEach(function(done) {
            let script =
                "function server_code_for_trigger_1(params, context){\n" +
                "    return 100;\n" +
                "}\n" +
                "function server_code_for_trigger_2(params, context){\n" +
                "    return 200;\n" +
                "}\n";
                apiHelper.deployServerCode(script).then(()=>{
                    done();
                });
        });
        it("all operations", function (done) {
            var triggerID: string;
            var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
            var targetID = new thingIFSDK.TypedID(thingIFSDK.Types.Thing, targetThingID);
            var serverCode = new thingIFSDK.ServerCode("server_code_for_trigger_1", adminToken, testApp.appID, {param1: "hoge"});
            var scheduleAt = new Date().getTime() + (1000 * 60 * 60);
            var scheduleOncePredicate = new thingIFSDK.ScheduleOncePredicate(scheduleAt);
            var condition = new thingIFSDK.Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", true));
            var statePredicate = new thingIFSDK.StatePredicate(condition, thingIFSDK.TriggersWhen.CONDITION_TRUE);
            var request = new PostServerCodeTriggerRequest(serverCode, scheduleOncePredicate);
            // 1. create server code trigger with ScheduleOncePredicate
            (<any>au)._token = adminToken;
            au.postServerCodeTrigger(targetID, request).then((trigger:any)=>{
                triggerID = trigger.triggerID;
                expect(triggerID).to.be.not.null;
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                expect(trigger.predicate.scheduleAt).to.equal(scheduleAt);
                expect(trigger.command).undefined;
                expect(trigger.serverCode.endpoint).to.equal("server_code_for_trigger_1");
                expect(trigger.serverCode.executorAccessToken).to.equal(adminToken);
                expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                expect(trigger.serverCode.parameters).to.deep.equal({param1: "hoge"});
                // 2. update server code trigger
                serverCode = new thingIFSDK.ServerCode("server_code_for_trigger_2", adminToken, testApp.appID, {param2: "hage"});
                request = new PatchServerCodeTriggerRequest(serverCode, statePredicate);
                return au.patchServerCodeTrigger(targetID, triggerID, request);
            }).then((trigger:any)=>{
                expect(trigger.triggerID).to.equals(triggerID);
                expect(trigger.disabled).to.be.false;
                expect(trigger.predicate.getEventSource()).to.equal("STATES");
                expect(trigger.predicate.triggersWhen).to.equal("CONDITION_TRUE");
                expect(trigger.predicate.condition).to.deep.equal(condition);
                expect(trigger.command).undefined;
                expect(trigger.serverCode.endpoint).to.equal("server_code_for_trigger_2");
                expect(trigger.serverCode.executorAccessToken).to.equal(adminToken);
                expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                expect(trigger.serverCode.parameters).to.deep.equal({param2: "hage"});
                // 3. register thing state
                return apiHelper.updateThingState(targetID.toString(), {"AirConditionerAlias": {power: false}});
            }).then(()=>{
                // 4. update thing state in order to trigger the server code
                return apiHelper.updateThingState(targetID.toString(), {"AirConditionerAlias": {power: true}});
            }).then(()=>{
                // 5. wait for a server code is finished
                return apiHelper.sleep(3000);
            }).then(()=>{
                // 6. get server code results
                return au.listServerCodeExecutionResults(targetID, triggerID);
            }).then((queryResult:any)=>{
                expect(queryResult.results.length).to.equal(1);
                expect(queryResult.paginationKey).to.be.null;
                expect(queryResult.hasNext).to.be.false;
                expect(queryResult.results[0].succeeded).to.be.true;
                expect(queryResult.results[0].returnedValue).to.equal(200);
                expect(queryResult.results[0].executedAt).to.be.not.null;
                expect(queryResult.results[0].endpoint).to.equal("server_code_for_trigger_2");
                expect(queryResult.results[0].error).to.be.null;
                done();
            }).catch((err:Error)=>{
                done(err);
            });
        });
    });
});
