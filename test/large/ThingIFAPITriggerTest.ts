/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import {apiHelper, KiiUser, KiiThing} from './utils/APIHelper';
import {testApp} from './utils/TestApp';
import { TestInfo } from './utils/TestInfo';
import {
    TypedID,
    Types,
    PostCommandTriggerRequest,
    PatchCommandTriggerRequest,
    OnboardWithVendorThingIDRequest,
    Condition,
    SchedulePredicate,
    StatePredicate,
    TriggersWhen,
    Trigger,
    TriggerCommandObject,
    PostServerCodeTriggerRequest,
    PatchServerCodeTriggerRequest,
    ScheduleOncePredicate,
    QueryResult,
    AliasAction,
    Action,
    EqualsClauseInTrigger
} from '../../src/ThingIFSDK'

declare var require: any
let thingIFSDK = require('../../../dist/thing-if.js');

describe("Large Tests for APIAuthor Trigger APIs(ThingIFAPI):", function () {

    let user: KiiUser;
    let api: any;
    let adminToken: string;
    let targetThingID: string;

    beforeEach(function(done) {
        // 1. create KiiUser
        // 2. get AdminToken
        // 3. onboard thing
        apiHelper.createKiiUser().then((newUser: KiiUser) => {
            user = newUser;
            var owner = new thingIFSDK.TypedID(thingIFSDK.Types.User, newUser.userID);
            api = new thingIFSDK.ThingIFAPI(owner, newUser.token, testApp);
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
            return api.onboardWithVendorThingID(request);
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
        describe("Test all operations", function(){
            it("should succeeded", function (done) {
                var triggerID1: string;
                var triggerID2: string;
                var actions = [
                    new thingIFSDK.AliasAction(TestInfo.AirConditionerAlias, [
                        new thingIFSDK.Action("turnPower", true)
                    ])
                ];
                var issuerID = new thingIFSDK.TypedID(thingIFSDK.Types.User, user.userID);
                var targetID = api.target;
                var commandTitle = "command title";
                var commandDescription = "command description";
                var commandMetadata = {
                    "power": "true for power on, false for power off"
                }
                var triggerTitle = "trigger title";
                var triggerDescription = "trigger description";
                var triggerMetadata = {
                    "power": "true for power on, false for power off"
                };
                var commandRequest = new TriggerCommandObject(actions, targetID, null, commandTitle, commandDescription, commandMetadata);

                var condition = new thingIFSDK.Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", false));
                var statePredicate = new thingIFSDK.StatePredicate(condition, thingIFSDK.TriggersWhen.CONDITION_CHANGED);
                var request = new PostCommandTriggerRequest(commandRequest, statePredicate, triggerTitle, triggerDescription, triggerMetadata);

                // 1. create command trigger with StatePredicate
                api.postCommandTrigger(request).then((trigger:Trigger)=>{

                    triggerID1 = trigger.triggerID;
                    expect(triggerID1).to.be.not.null;
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(targetID);
                    expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(trigger.command.title).to.equal(commandTitle);
                    expect(trigger.command.description).to.be.equal(commandDescription);
                    expect(trigger.command.metadata).to.deep.equal(commandMetadata);
                    expect(trigger.serverCode).undefined;
                    expect(trigger.title).to.be.equal(triggerTitle);
                    expect(trigger.description).to.be.equal(triggerDescription);
                    expect(trigger.metadata).to.deep.equal(triggerMetadata);

                    // 2. create command trigger with SchedulePredicate
                    var schedulePredicate = new thingIFSDK.SchedulePredicate("0 12 1 * *");
                    request = new PostCommandTriggerRequest(
                        new TriggerCommandObject(actions, targetID), schedulePredicate);
                    // Admin token is needed when allowCreateTaskByPrincipal=false
                    api._au._token = adminToken;
                    return api.postCommandTrigger(request);
                }).then((trigger:Trigger)=>{
                    triggerID2 = trigger.triggerID;
                    expect(triggerID2).to.be.not.null;
                    expect(trigger.disabled).to.be.false;
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(targetID);
                    expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(trigger.serverCode).undefined;

                    // 3. disable trigger
                    return api.enableTrigger(triggerID2, false);
                }).then((trigger:Trigger)=>{
                    expect(trigger.triggerID).to.equal(triggerID2);
                    expect(trigger.disabled).to.be.true;
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(targetID);
                    expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(trigger.serverCode).undefined;

                    // 4. list triggers
                    api._au._token = user.token;
                    return api.listTriggers(new thingIFSDK.ListQueryOptions());
                }).then((queryResult:QueryResult<Trigger>)=>{
                    expect(queryResult.results.length).to.equal(2);
                    expect(queryResult.paginationKey).to.be.null;
                    expect(queryResult.hasNext).to.be.false;
                    var trigger1 = queryResult.results[0];
                    for (var trigger of queryResult.results) {
                        if (trigger.triggerID == triggerID1) {
                            expect(trigger.disabled).to.be.false;
                            expect(trigger.predicate).instanceof(thingIFSDK.StatePredicate);
                            let predicate = <StatePredicate>trigger.predicate;
                            expect(trigger.predicate.getEventSource()).to.equal("STATES");
                            expect(predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                            expect(predicate.condition).to.deep.equal(condition);
                            expect(trigger.command.aliasActions).to.deep.equal(actions);
                            expect(trigger.command.targetID).to.deep.equal(targetID);
                            expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                            expect(trigger.serverCode).undefined;
                        } else if (trigger.triggerID == triggerID2) {
                            expect(trigger.disabled).to.be.true;
                            expect(trigger.predicate).instanceof(thingIFSDK.SchedulePredicate);
                            expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
                            expect(trigger.command.aliasActions).to.deep.equal(actions);
                            expect(trigger.command.targetID).to.deep.equal(targetID);
                            expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                            expect(trigger.serverCode).undefined;
                        } else {
                            done("Unexpected TriggerID");
                        }
                    }
                    // 5. update trigger
                    let request2 = new PatchCommandTriggerRequest(
                        new TriggerCommandObject([
                            new AliasAction(TestInfo.HumidityAlias, [
                                new Action("setPresetHumidity", 45)
                            ])
                        ],targetID), statePredicate);
                    return api.patchCommandTrigger(triggerID1, request2);
                }).then((trigger:Trigger)=>{
                    expect(trigger.triggerID).to.equal(triggerID1);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect(trigger.predicate).instanceof(thingIFSDK.StatePredicate)
                    let predicate = <StatePredicate>trigger.predicate;
                    expect(predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(predicate.condition).to.deep.equal(condition);
                    expect(trigger.command.aliasActions).to.deep.equal([
                        new thingIFSDK.AliasAction(TestInfo.HumidityAlias, [
                            new thingIFSDK.Action("setPresetHumidity", 45)
                        ])
                    ]);
                    expect(trigger.command.targetID).to.deep.equal(targetID);
                    expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(trigger.serverCode).undefined;
                    // 6. delete trigger
                    api._au._token = adminToken;
                    return api.deleteTrigger(triggerID2);
                }).then((deletedTriggerID:string)=>{
                    expect(deletedTriggerID).to.equal(triggerID2);
                    // 7. list triggers
                    return api.listTriggers(new thingIFSDK.ListQueryOptions());
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
                    expect(queryResult.results[0].command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(queryResult.results[0].serverCode).undefined;
                    done();
                }).catch((err:Error)=>{
                    done(err);
                });

            });
        })
        describe("Post cross thing command trigger", function(){
            let commandTargetID: string;
            beforeEach(function(done) {
                var vendorThingID = "vendor-" + new Date().getTime();
                var password = "password";
                var owner = new TypedID(Types.User, user.userID);
                var request = new OnboardWithVendorThingIDRequest(
                    vendorThingID,
                    password,
                    owner,
                    TestInfo.DefaultThingType,
                    TestInfo.DefaultFirmwareVersion);
                api.onboardWithVendorThingID(request
                ).then((result:any) => {
                    commandTargetID = result.thingID;
                    done();
                }).catch((err:any)=>{
                    done(err);
                })
            });
            it("should succeeded", function (done) {
                var triggerID1: string;
                var schema = "led";
                var schemaVersion = 1;
                var actions = [
                    new thingIFSDK.AliasAction(TestInfo.AirConditionerAlias, [
                        new thingIFSDK.Action("turnPower", true)
                    ])
                ];
                var issuerID = new TypedID(Types.User, user.userID);
                var targetID = api.target;
                var commandTarget = new TypedID(Types.Thing, commandTargetID);
                var condition = new Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", false));
                var statePredicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
                var commandRequest = new TriggerCommandObject(actions, targetID);
                var request = new PostCommandTriggerRequest(commandRequest, statePredicate);

                // 1. create command trigger with StatePredicate
                api.postCommandTrigger(request).then((trigger:Trigger)=>{
                    triggerID1 = trigger.triggerID;
                    expect(triggerID1).to.be.not.null;
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    let predicate = <StatePredicate>trigger.predicate;
                    expect(predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(predicate.condition).to.deep.equal(condition);
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(trigger.command.targetID.toString()).to.deep.equal(commandTarget.toString());
                    expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(trigger.serverCode).undefined;
                    return api.getTrigger(triggerID1);
                }).then((trigger:Trigger)=>{
                    expect(trigger.triggerID).to.be.equal(triggerID1);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(JSON.stringify((<StatePredicate>trigger.predicate).condition)).to.equal(JSON.stringify(condition));
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(JSON.stringify(trigger.command.targetID)).to.deep.equal(JSON.stringify(commandTarget));
                    expect(JSON.stringify(trigger.command.issuerID.toString())).to.deep.equal(JSON.stringify(issuerID.toString()));
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
                var request = new OnboardWithVendorThingIDRequest(
                    vendorThingID,
                    password,
                    owner,
                    TestInfo.DefaultThingType,
                    TestInfo.DefaultFirmwareVersion);
                api.onboardWithVendorThingID(request
                ).then((result:any) => {
                    commandTargetID = result.thingID;
                    done();
                }).catch((err:any)=>{
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
                var targetID = api.target;
                var commandTarget = new TypedID(Types.Thing, commandTargetID);
                var condition = new Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", false));
                var statePredicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
                var commandRequest = new TriggerCommandObject(actions, targetID);
                var request = new PatchCommandTriggerRequest(commandRequest, statePredicate);

                // 1. create command trigger with StatePredicate
                api.postCommandTrigger(request).then((trigger:any)=>{
                    triggerID1 = trigger.triggerID;
                    expect(triggerID1).to.be.not.null;
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect(trigger.predicate.triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(trigger.predicate.condition).to.deep.equal(condition);
                    expect(trigger.command.aliasActions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(targetID);
                    expect(trigger.command.issuerID.toString()).to.deep.equal(issuerID.toString());
                    expect(trigger.serverCode).undefined;
                    let request2 = new PatchCommandTriggerRequest(
                        new TriggerCommandObject([
                            new AliasAction(TestInfo.HumidityAlias, [
                                new Action("setPresetHumidity", 45)
                            ])
                        ], commandTarget, issuerID), statePredicate);
                    return api.patchCommandTrigger(triggerID1, request2);
                }).then((trigger:Trigger)=>{
                    expect(trigger.triggerID).to.be.equal(triggerID1);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect(JSON.stringify((<StatePredicate>trigger.predicate).condition)).to.equal(JSON.stringify(condition));
                    expect(trigger.command.aliasActions).to.deep.equal([
                        new thingIFSDK.AliasAction(TestInfo.HumidityAlias, [
                            new thingIFSDK.Action("setPresetHumidity", 45)
                        ])
                    ]);
                    expect(JSON.stringify(trigger.command.targetID)).to.deep.equal(JSON.stringify(commandTarget));
                    expect(JSON.stringify(trigger.command.issuerID.toString())).to.deep.equal(JSON.stringify(issuerID.toString()));
                    expect(trigger.serverCode).undefined;
                    done();
                }).catch((err:Error)=>{
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
            var targetID = api.target;
            var serverCode = new thingIFSDK.ServerCode("server_code_for_trigger_1", adminToken, testApp.appID, {param1: "hoge"});
            var scheduleAt = new Date().getTime() + (1000 * 60 * 60);
            var scheduleOncePredicate = new ScheduleOncePredicate(scheduleAt);
            var condition = new thingIFSDK.Condition(new thingIFSDK.EqualsClauseInTrigger(TestInfo.AirConditionerAlias, "power", true));
            var statePredicate = new thingIFSDK.StatePredicate(condition, thingIFSDK.TriggersWhen.CONDITION_TRUE);
            var triggerTitle = "trigger title";
            var triggerDescription = "trigger description";
            var triggerMetadata = {
                "power": "true for power on, false for power off"
            };

            var request = new PostServerCodeTriggerRequest(serverCode, scheduleOncePredicate, triggerTitle, triggerDescription, triggerMetadata);
            // 1. create server code trigger with ScheduleOncePredicate
            api._au._token = adminToken;
            api.postServerCodeTrigger(request).then((trigger:any)=>{
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
                expect(trigger.title).to.be.equal(triggerTitle);
                expect(trigger.description).to.be.equal(triggerDescription);
                expect(trigger.metadata).to.deep.equal(triggerMetadata);

                // 2. update server code trigger
                serverCode = new thingIFSDK.ServerCode("server_code_for_trigger_2", adminToken, testApp.appID, {param2: "hage"});
                request = new PatchServerCodeTriggerRequest(serverCode, statePredicate, "new title", "new description", {"power": "power of led"});
                return api.patchServerCodeTrigger(triggerID, request);
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
                expect(trigger.title).to.be.equal("new title");
                expect(trigger.description).to.be.equal("new description");
                expect(trigger.metadata).to.deep.equal({"power": "power of led"});

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
                return api.listServerCodeExecutionResults(triggerID);
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