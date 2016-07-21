/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />

import {expect} from 'chai';
import * as nock from 'nock'
import TestApp from './TestApp'
import {APIAuthor} from '../../src/APIAuthor';
import {TypedID} from '../../src/TypedID';
import {Types} from '../../src/TypedID';
import {CommandTriggerRequest, ServerCodeTriggerRequest, ListQueryOptions} from '../../src/RequestObjects';
import TriggerOps from '../../src/ops/TriggerOps'
import {Trigger, TriggersWhen, TriggersWhat} from '../../src/Trigger';
import {Command, CommandState} from '../../src/Command';
import {Predicate, StatePredicate, SchedulePredicate, ScheduleOncePredicate, EventSource} from '../../src/Predicate';
import {Condition} from '../../src/Condition';
import {Clause, Equals, NotEquals, Range, And, Or} from '../../src/Clause';
import {ServerCode} from '../../src/ServerCode';
import {ServerCodeResult} from '../../src/ServerCodeResult';
import {QueryResult} from '../../src/QueryResult';
import {ThingIFError, HttpRequestError, Errors} from '../../src/ThingIFError';
let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
let au = new APIAuthor(ownerToken, testApp.app);
let triggerOps = new TriggerOps(au, target);

describe('Test TriggerOps', function () {

    beforeEach(function() {
        nock.cleanAll();
    });

    let expectedTriggerID = "46bc25c0-4f12-11e6-ae54-22000ad9164c";
    let schemaName = "LED";
    let schemaVersion = 1;
    let actions = [{turnPower: {power:true}}, {setColor: {color: [255,0,255]}}];
    let condition = new Condition(new Equals("power", "false"));
    let statePredicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
    let schedulePredicate = new SchedulePredicate("0 12 1 * *");
    let scheduleOncePredicate = new ScheduleOncePredicate(1469089120402);
    let responseBody4CommandTriggerWithState = {
        "triggerID": expectedTriggerID,
        "predicate":{
            "triggersWhen":"CONDITION_CHANGED",
            "condition":{
                "type":"eq","field":"power","value":"false"
            },
            "eventSource":"STATES"
        },
        "triggersWhat":"COMMAND",
        "command":{
            "schema": schemaName,
            "schemaVersion": schemaVersion,
            "target": target.toString(),
            "issuer": owner.toString(),
            "actions": actions
        },
        "disabled":false
    }
    let responseBody4CommandTriggerWithSchedule = {
        "triggerID": expectedTriggerID,
        "predicate":{
            "schedule":"0 12 1 * *",
            "eventSource":"SCHEDULE"
        },
        "triggersWhat":"COMMAND",
        "command":{
            "schema": schemaName,
            "schemaVersion": schemaVersion,
            "target": target.toString(),
            "issuer": owner.toString(),
            "actions": actions
        },
        "disabled":false
    }
    let responseBody4CommandTriggerWithScheduleOnce = {
        "triggerID": expectedTriggerID,
        "predicate":{
            "scheduleAt": 1469089120402,
            "eventSource":"SCHEDULE_ONCE"
        },
        "triggersWhat":"COMMAND",
        "command":{
            "schema": schemaName,
            "schemaVersion": schemaVersion,
            "target": target.toString(),
            "issuer": owner.toString(),
            "actions": actions
        },
        "disabled":false
    }
    let endpoint = "server_function";
    let parameters = {brightness : 100, color : "#FFF"};
    let serverCode = new ServerCode(endpoint, ownerToken, testApp.appID, parameters);
    let responseBody4ServerCodeTriggerWithState = {
        "triggerID": expectedTriggerID,
        "predicate":{
            "triggersWhen":"CONDITION_CHANGED",
            "condition":{
                "type":"eq","field":"power","value":"false"
            },
            "eventSource":"STATES"
        },
        "triggersWhat":"SERVER_CODE",
        "serverCode" : {
            "endpoint" : endpoint,
            "parameters" : parameters,
            "executorAccessToken" : ownerToken,
            "targetAppID": testApp.appID
        },
        "disabled":false
    }
    let responseBody4ServerCodeTriggerWithSchedule = {
        "triggerID": expectedTriggerID,
        "predicate":{
            "schedule":"0 12 1 * *",
            "eventSource":"SCHEDULE"
        },
        "triggersWhat":"SERVER_CODE",
        "serverCode" : {
            "endpoint" : endpoint,
            "parameters" : parameters,
            "executorAccessToken" : ownerToken,
            "targetAppID": testApp.appID
        },
        "disabled":false
    }
    let responseBody4ServerCodeTriggerWithScheduleOnce = {
        "triggerID": expectedTriggerID,
        "predicate":{
            "scheduleAt": 1469089120402,
            "eventSource":"SCHEDULE_ONCE"
        },
        "triggersWhat":"SERVER_CODE",
        "serverCode" : {
            "endpoint" : endpoint,
            "parameters" : parameters,
            "executorAccessToken" : ownerToken,
            "targetAppID": testApp.appID
        },
        "disabled":false
    }

    describe('#postCommandTrigger() with promise', function () {
        // postCommandTrigger method sends request to server twice.
        // 1. POST `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`
        // 2. GET  `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        let postCommandTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`;
        let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).post(postCommandTriggerPath, {
                    "predicate":{
                        "triggersWhen":"CONDITION_CHANGED",
                        "condition":{
                            "type":"eq","field":"power","value":"false"
                        },
                        "eventSource":"STATES"
                    },
                    "triggersWhat":"COMMAND",
                    "command":{
                        "schema": schemaName,
                        "schemaVersion": schemaVersion,
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithState, {"Content-Type": "application/json"});
            
            let request = new CommandTriggerRequest(schemaName, schemaVersion, actions, statePredicate, owner);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with SchedulePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).post(postCommandTriggerPath, {
                    "predicate":{
                        "schedule":"0 12 1 * *",
                        "eventSource":"SCHEDULE"
                    },
                    "triggersWhat":"COMMAND",
                    "command":{
                        "schema": schemaName,
                        "schemaVersion": schemaVersion,
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithSchedule, {"Content-Type": "application/json"});
            
            let request = new CommandTriggerRequest(schemaName, schemaVersion, actions, schedulePredicate, owner);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).cronExpression).to.equal("0 12 1 * *");
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with ScheduleOncePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).post(postCommandTriggerPath, {
                    "predicate":{
                        "scheduleAt": 1469089120402,
                        "eventSource":"SCHEDULE_ONCE"
                    },
                    "triggersWhat":"COMMAND",
                    "command":{
                        "schema": schemaName,
                        "schemaVersion": schemaVersion,
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithScheduleOnce, {"Content-Type": "application/json"});
            
            let request = new CommandTriggerRequest(schemaName, schemaVersion, actions, scheduleOncePredicate, owner);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public request: CommandTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase(new CommandTriggerRequest(null, 1, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "schemaName is null or empty", "should handle error when schemaName is null"),
                new TestCase(new CommandTriggerRequest("", 1, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "schemaName is null or empty", "should handle error when schemaName is empty"),
                new TestCase(new CommandTriggerRequest("led", null, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "schemaVersion is null", "should handle error when schemaVersion is null"),
                new TestCase(new CommandTriggerRequest("led", 1, null, predicate), Errors.ArgumentError, "actions is null", "should handle error when actions is null"),
                new TestCase(new CommandTriggerRequest("led", 1, [{turnPower: {power:true}}], null), Errors.ArgumentError, "predicate is null", "should handle error when predicate is null"),
            ]
            tests.forEach(function(test) {
                it(test.description, function(done){
                    triggerOps.postCommandTrigger(test.request).then((result:Trigger)=>{
                        done("should fail");
                    }).catch((err:ThingIFError)=>{
                        try {
                            expect(err).be.not.null;
                            expect(err.name).to.equals(test.expectedError);
                            expect(err.message).to.equals(test.expectedErrorMsg);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('#postServerCodeTriggger() with promise', function () {
        // postServerCodeTrigger method sends request to server twice.
        // 1. POST `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`
        // 2. GET  `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        let postServerCodeTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`;
        let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).post(postServerCodeTriggerPath, {
                    "predicate":{
                        "triggersWhen":"CONDITION_CHANGED",
                        "condition":{
                            "type":"eq","field":"power","value":"false"
                        },
                        "eventSource":"STATES"
                    },
                    "triggersWhat":"SERVER_CODE",
                    "serverCode" : {
                        "endpoint" : endpoint,
                        "parameters" : parameters,
                        "executorAccessToken" : ownerToken,
                        "targetAppID": testApp.appID
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithState, {"Content-Type": "application/json"});
            
            let request = new ServerCodeTriggerRequest(serverCode, statePredicate);
            triggerOps.postServerCodeTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with SchedulePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).post(postServerCodeTriggerPath, {
                    "predicate":{
                        "schedule":"0 12 1 * *",
                        "eventSource":"SCHEDULE"
                    },
                    "triggersWhat":"SERVER_CODE",
                    "serverCode" : {
                        "endpoint" : endpoint,
                        "parameters" : parameters,
                        "executorAccessToken" : ownerToken,
                        "targetAppID": testApp.appID
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithSchedule, {"Content-Type": "application/json"});
            
            let request = new ServerCodeTriggerRequest(serverCode, schedulePredicate);
            triggerOps.postServerCodeTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).cronExpression).to.equal("0 12 1 * *");
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with ScheduleOncePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).post(postServerCodeTriggerPath, {
                    "predicate":{
                        "scheduleAt": 1469089120402,
                        "eventSource":"SCHEDULE_ONCE"
                    },
                    "triggersWhat":"SERVER_CODE",
                    "serverCode" : {
                        "endpoint" : endpoint,
                        "parameters" : parameters,
                        "executorAccessToken" : ownerToken,
                        "targetAppID": testApp.appID
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithScheduleOnce, {"Content-Type": "application/json"});
            
            let request = new ServerCodeTriggerRequest(serverCode, scheduleOncePredicate);
            triggerOps.postServerCodeTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public request: ServerCodeTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let serverCode = new ServerCode("servercode_func");
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase(new ServerCodeTriggerRequest(null, predicate), Errors.ArgumentError, "serverCode is null", "should handle error when serverCode is null"),
                new TestCase(new ServerCodeTriggerRequest(serverCode, null), Errors.ArgumentError, "predicate is null", "should handle error when predicate is null"),
            ]
            tests.forEach(function(test) {
                it(test.description, function(done){
                    triggerOps.postServerCodeTrigger(test.request).then((result:Trigger)=>{
                        done("should fail");
                    }).catch((err:ThingIFError)=>{
                        try {
                            expect(err).be.not.null;
                            expect(err.name).to.equals(test.expectedError);
                            expect(err.message).to.equals(test.expectedErrorMsg);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('#patchCommandTrigger() with promise', function () {
        // patchCommandTrigger method sends request to server twice.
        // 1. PATCH `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        // 2. GET  `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        let patchCommandTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).patch(patchCommandTriggerPath, {
                    "predicate":{
                        "triggersWhen":"CONDITION_CHANGED",
                        "condition":{
                            "type":"eq","field":"power","value":"false"
                        },
                        "eventSource":"STATES"
                    },
                    "triggersWhat":"COMMAND",
                    "command":{
                        "schema": schemaName,
                        "schemaVersion": schemaVersion,
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithState, {"Content-Type": "application/json"});
            
            let request = new CommandTriggerRequest(schemaName, schemaVersion, actions, statePredicate, owner);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with SchedulePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).patch(patchCommandTriggerPath, {
                    "predicate":{
                        "schedule":"0 12 1 * *",
                        "eventSource":"SCHEDULE"
                    },
                    "triggersWhat":"COMMAND",
                    "command":{
                        "schema": schemaName,
                        "schemaVersion": schemaVersion,
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithSchedule, {"Content-Type": "application/json"});
            
            let request = new CommandTriggerRequest(schemaName, schemaVersion, actions, schedulePredicate, owner);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).cronExpression).to.equal("0 12 1 * *");
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with ScheduleOncePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).patch(patchCommandTriggerPath, {
                    "predicate":{
                        "scheduleAt": 1469089120402,
                        "eventSource":"SCHEDULE_ONCE"
                    },
                    "triggersWhat":"COMMAND",
                    "command":{
                        "schema": schemaName,
                        "schemaVersion": schemaVersion,
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithScheduleOnce, {"Content-Type": "application/json"});
            
            let request = new CommandTriggerRequest(schemaName, schemaVersion, actions, scheduleOncePredicate, owner);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public triggerID: string,
                    public request: CommandTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, new CommandTriggerRequest("led", 1, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is null"),
                new TestCase("", new CommandTriggerRequest("led", 1, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is empty"),
                new TestCase("trigger-01234-abcd", null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase("trigger-01234-abcd", new CommandTriggerRequest(null, 1, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "schemaName is null or empty", "should handle error when schemaName is null"),
                new TestCase("trigger-01234-abcd", new CommandTriggerRequest("", 1, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "schemaName is null or empty", "should handle error when schemaName is empty"),
                new TestCase("trigger-01234-abcd", new CommandTriggerRequest("led", null, [{turnPower: {power:true}}], predicate), Errors.ArgumentError, "schemaVersion is null", "should handle error when schemaVersion is null"),
                new TestCase("trigger-01234-abcd", new CommandTriggerRequest("led", 1, null, null), Errors.ArgumentError, "must specify actions or predicate", "should handle error when actions and predicate are null"),
            ]
            tests.forEach(function(test) {
                it(test.description, function(done){
                    triggerOps.patchCommandTrigger(test.triggerID, test.request).then((result:Trigger)=>{
                        done("should fail");
                    }).catch((err:ThingIFError)=>{
                        try {
                            expect(err).be.not.null;
                            expect(err.name).to.equals(test.expectedError);
                            expect(err.message).to.equals(test.expectedErrorMsg);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('#patchServerCodeTrigger() with promise', function () {
        // patchServerCodeTrigger method sends request to server twice.
        // 1. PATCH `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        // 2. GET  `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        let patchServerCodeTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).patch(patchServerCodeTriggerPath, {
                    "predicate":{
                        "triggersWhen":"CONDITION_CHANGED",
                        "condition":{
                            "type":"eq","field":"power","value":"false"
                        },
                        "eventSource":"STATES"
                    },
                    "triggersWhat":"SERVER_CODE",
                    "serverCode" : {
                        "endpoint" : endpoint,
                        "parameters" : parameters,
                        "executorAccessToken" : ownerToken,
                        "targetAppID": testApp.appID
                    }
                })
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithState, {"Content-Type": "application/json"});
            
            let request = new ServerCodeTriggerRequest(serverCode, statePredicate);
            triggerOps.patchServerCodeTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with SchedulePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).patch(patchServerCodeTriggerPath, {
                    "predicate":{
                        "schedule":"0 12 1 * *",
                        "eventSource":"SCHEDULE"
                    },
                    "triggersWhat":"SERVER_CODE",
                    "serverCode" : {
                        "endpoint" : endpoint,
                        "parameters" : parameters,
                        "executorAccessToken" : ownerToken,
                        "targetAppID": testApp.appID
                    }
                })
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithSchedule, {"Content-Type": "application/json"});
            
            let request = new ServerCodeTriggerRequest(serverCode, schedulePredicate);
            triggerOps.patchServerCodeTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).cronExpression).to.equal("0 12 1 * *");
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with ScheduleOncePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).patch(patchServerCodeTriggerPath, {
                    "predicate":{
                        "scheduleAt": 1469089120402,
                        "eventSource":"SCHEDULE_ONCE"
                    },
                    "triggersWhat":"SERVER_CODE",
                    "serverCode" : {
                        "endpoint" : endpoint,
                        "parameters" : parameters,
                        "executorAccessToken" : ownerToken,
                        "targetAppID": testApp.appID
                    }
                })
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithScheduleOnce, {"Content-Type": "application/json"});
            
            let request = new ServerCodeTriggerRequest(serverCode, scheduleOncePredicate);
            triggerOps.patchServerCodeTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public triggerID: string,
                    public request: ServerCodeTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let serverCode = new ServerCode("servercode_func");
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, new ServerCodeTriggerRequest(null, predicate), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is null"),
                new TestCase("", new ServerCodeTriggerRequest(serverCode, null), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is empty"),
                new TestCase("trigger-01234-abcd", null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase("trigger-01234-abcd", new ServerCodeTriggerRequest(null, null), Errors.ArgumentError, "must specify serverCode or predicate", "should handle error when serverCode and predicate are null"),
            ]
            tests.forEach(function(test) {
                it(test.description, function(done){
                    triggerOps.patchServerCodeTrigger(test.triggerID, test.request).then((result:Trigger)=>{
                        done("should fail");
                    }).catch((err:ThingIFError)=>{
                        try {
                            expect(err).be.not.null;
                            expect(err.name).to.equals(test.expectedError);
                            expect(err.message).to.equals(test.expectedErrorMsg);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('#enableTrigger() with promise', function () {
        it("to enable", function (done) {
            // enableTrigger method sends request to server twice.
            // 1. PUT `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}/enable`
            // 2. GET  `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
            let enableTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}/enable`;
            let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).put(enableTriggerPath)
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithState, {"Content-Type": "application/json"});
            
            triggerOps.enableTrigger(expectedTriggerID, true).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("to disable", function (done) {
            // enableTrigger method sends request to server twice.
            // 1. PUT `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}/disable`
            // 2. GET  `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
            let disableTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}/disable`;
            let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).put(disableTriggerPath)
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithState, {"Content-Type": "application/json"});
            
            triggerOps.enableTrigger(expectedTriggerID, false).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public triggerID: string,
                    public enable: boolean,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let tests = [
                new TestCase(null, true, Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is null"),
                new TestCase("", true, Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is empty"),
                new TestCase("trigger-01234-abcd", null, Errors.ArgumentError, "enable is null", "should handle error when enable is null"),
            ]
            tests.forEach(function(test) {
                it(test.description, function(done){
                    triggerOps.enableTrigger(test.triggerID, test.enable).then((result:Trigger)=>{
                        done("should fail");
                    }).catch((err:ThingIFError)=>{
                        try {
                            expect(err).be.not.null;
                            expect(err.name).to.equals(test.expectedError);
                            expect(err.message).to.equals(test.expectedErrorMsg);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('#deleteTrigger() with promise', function () {
        it("should send a request to the thing-if server", function (done) {
            let deleteTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).delete(deleteTriggerPath)
                .reply(204, null);
            triggerOps.deleteTrigger(expectedTriggerID).then((deletedTriggerID:string)=>{
                try {
                    expect(deletedTriggerID).to.equal(expectedTriggerID);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public triggerID: string,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let tests = [
                new TestCase(null, Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is null"),
                new TestCase("", Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is empty"),
            ]
            tests.forEach(function(test) {
                it(test.description, function(done){
                    triggerOps.deleteTrigger(test.triggerID).then((result:string)=>{
                        done("should fail");
                    }).catch((err:ThingIFError)=>{
                        try {
                            expect(err).be.not.null;
                            expect(err.name).to.equals(test.expectedError);
                            expect(err.message).to.equals(test.expectedErrorMsg);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('#getTrigger() with promise', function () {
        it("should send a request to the thing-if server", function (done) {
            // getTrigger() method is used by other methods internally.
            // So we can skip small test for getTrigger() method.
            done();
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public triggerID: string,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let tests = [
                new TestCase(null, Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is null"),
                new TestCase("", Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is empty"),
            ]
            tests.forEach(function(test) {
                it(test.description, function(done){
                    triggerOps.getTrigger(test.triggerID).then((result:Trigger)=>{
                        done("should fail");
                    }).catch((err:ThingIFError)=>{
                        try {
                            expect(err).be.not.null;
                            expect(err.name).to.equals(test.expectedError);
                            expect(err.message).to.equals(test.expectedErrorMsg);
                            done();
                        } catch (err) {
                            done(err);
                        }
                    });
                });
            });
        });
    });
    describe('#listTriggers() with promise', function () {
        let paginationKey = "1/2"
        let responseBody4ListTriggers1 = {
            triggers: [
                responseBody4CommandTriggerWithState,
                responseBody4CommandTriggerWithSchedule,
                responseBody4CommandTriggerWithScheduleOnce
            ],
            nextPaginationKey: paginationKey
        }
        let responseBody4ListTriggers2 = {
            triggers: [
                responseBody4ServerCodeTriggerWithState,
                responseBody4ServerCodeTriggerWithSchedule,
                responseBody4ServerCodeTriggerWithScheduleOnce
            ]
        }
        let listTriggersPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`;
        it("with bestEffortLimit", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listTriggersPath + "?bestEffortLimit=10")
                .reply(200, responseBody4ListTriggers2, {"Content-Type": "application/json"});

            triggerOps.listTriggers(new ListQueryOptions(10)).then((result:QueryResult<Trigger>)=>{
                try {
                    expect(result.paginationKey).to.be.null;
                    expect(result.results.length).to.equal(3);

                    var trigger = result.results[0];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);

                    trigger = result.results[1];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).cronExpression).to.equal("0 12 1 * *");
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);

                    trigger = result.results[2];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                    done();
                } catch (err) {
                    done(err);
                }
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with pagination", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listTriggersPath)
                .reply(200, responseBody4ListTriggers1, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK": "0.1",
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listTriggersPath + `?paginationKey=${paginationKey}`)
                .reply(200, responseBody4ListTriggers2, {"Content-Type": "application/json"});
            
            triggerOps.listTriggers(null).then((result:QueryResult<Trigger>)=>{
                try {
                    expect(result.paginationKey).to.equal(paginationKey);
                    expect(result.results.length).to.equal(3);

                    var trigger = result.results[0];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;

                    trigger = result.results[1];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).cronExpression).to.equal("0 12 1 * *");
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;

                    trigger = result.results[2];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
                    expect(trigger.command.schemaName).to.equal(schemaName);
                    expect(trigger.command.schemaVersion).to.equal(schemaVersion);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;
                } catch (err) {
                    done(err);
                }
                return triggerOps.listTriggers(new ListQueryOptions(null, result.paginationKey));
            }).then((result:QueryResult<Trigger>)=>{
                try {
                    expect(result.paginationKey).to.be.null;
                    expect(result.results.length).to.equal(3);

                    var trigger = result.results[0];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);

                    trigger = result.results[1];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).cronExpression).to.equal("0 12 1 * *");
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);

                    trigger = result.results[2];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
                    expect(trigger.command).to.be.null;
                    expect(trigger.serverCode.endpoint).to.equal(endpoint);
                    expect(trigger.serverCode.executorAccessToken).to.equal(ownerToken);
                    expect(trigger.serverCode.targetAppID).to.equal(testApp.appID);
                    expect(trigger.serverCode.parameters).to.deep.equal(parameters);
                } catch (err) {
                    done(err);
                }
                done();
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
    });
    describe('#listServerCodeResults() with promise', function () {
        it("no pagination", function (done) {
            done();
        });
    });
});
