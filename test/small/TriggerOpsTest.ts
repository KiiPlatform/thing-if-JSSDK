/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />

import {expect} from 'chai';
import * as nock from 'nock'
import TestApp from './TestApp'
import {APIAuthor} from '../../src/APIAuthor';
import {TypedID} from '../../src/TypedID';
import {Types} from '../../src/TypedID';
import {
    PostCommandTriggerRequest,
    PatchCommandTriggerRequest,
    PostServerCodeTriggerRequest,
    PatchServerCodeTriggerRequest,
    ListQueryOptions,
    TriggerCommandObject
} from '../../src/RequestObjects';
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
import * as TestUtil from './utils/TestUtil'
let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
let au = new APIAuthor(ownerToken, testApp.app);
let triggerOps = new TriggerOps(au, target);
let commandTarget = new TypedID(Types.Thing, "th.2355-eftef");

describe('Test TriggerOps', function () {

    beforeEach(function() {
        nock.cleanAll();
    });

    let expectedTriggerID = "46bc25c0-4f12-11e6-ae54-22000ad9164c";
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
        let postCommandTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`;
        let commandRequest = new TriggerCommandObject(actions, target, owner);
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});
            let request = new PostCommandTriggerRequest(commandRequest, statePredicate);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});

            let request = new PostCommandTriggerRequest(commandRequest, schedulePredicate);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});

            let request = new PostCommandTriggerRequest(commandRequest, scheduleOncePredicate);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
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
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TRIGGER",
                "message": "The provided trigger is not valid"
            };
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(400, errResponse, {"Content-Type": "application/json"});

            let request = new PostCommandTriggerRequest(commandRequest, statePredicate);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(400);
                expect(err.name).to.equal(Errors.HttpError);
                done();
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public request: PostCommandTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase(new PostCommandTriggerRequest(new TriggerCommandObject(null, target, owner), predicate), Errors.ArgumentError, "actions of command is null", "should handle error when actions is null"),
                new TestCase(new PostCommandTriggerRequest(new TriggerCommandObject([{turnPower: {power:true}}], target, owner), null), Errors.ArgumentError, "predicate is null", "should handle error when predicate is null"),
                new TestCase(new PostCommandTriggerRequest(new TriggerCommandObject([{turnPower: {power:true}}], target, null), predicate), Errors.ArgumentError, "issuerID of command is null", "should handle error when issuerID is null"),
                new TestCase(new PostCommandTriggerRequest(null, predicate), Errors.ArgumentError, "command is null", "should handle error when command is null"),
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
    describe('#postCommandTrigger() with promise(cross thing command trigger)', function () {
        let postCommandTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`;
        let commandRequest = new TriggerCommandObject(actions, commandTarget, owner);

        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "target": commandTarget.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(201, {triggerID: expectedTriggerID}, {"Content-Type": "application/json"});

            let request = new PostCommandTriggerRequest(commandRequest, statePredicate);
            triggerOps.postCommandTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(commandTarget);
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
    });
    describe('#postServerCodeTriggger() with promise', function () {
        let postServerCodeTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers`;
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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

            let request = new PostServerCodeTriggerRequest(serverCode, statePredicate);
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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

            let request = new PostServerCodeTriggerRequest(serverCode, schedulePredicate);
            triggerOps.postServerCodeTrigger(request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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

            let request = new PostServerCodeTriggerRequest(serverCode, scheduleOncePredicate);
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
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TRIGGER",
                "message": "The provided trigger is not valid"
            };
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                .reply(400, errResponse, {"Content-Type": "application/json"});

            let request = new PostServerCodeTriggerRequest(serverCode, statePredicate);
            triggerOps.postServerCodeTrigger(request).then((trigger:Trigger)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(400);
                expect(err.name).to.equal(Errors.HttpError);
                done();
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public request: PostServerCodeTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let serverCode = new ServerCode("servercode_func");
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase(new PostServerCodeTriggerRequest(null, predicate), Errors.ArgumentError, "serverCode is null", "should handle error when serverCode is null"),
                new TestCase(new PostServerCodeTriggerRequest(serverCode, null), Errors.ArgumentError, "predicate is null", "should handle error when predicate is null"),
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
        let commandRequest = new TriggerCommandObject(actions, target, owner);
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithState, {"Content-Type": "application/json"});

            let request = new PatchCommandTriggerRequest(commandRequest, statePredicate);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithSchedule, {"Content-Type": "application/json"});

            let request = new PatchCommandTriggerRequest(commandRequest, schedulePredicate);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CommandTriggerWithScheduleOnce, {"Content-Type": "application/json"});

            let request = new PatchCommandTriggerRequest(commandRequest, scheduleOncePredicate);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
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
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TRIGGER",
                "message": "The provided trigger is not valid"
            };
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "target": target.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(400, errResponse, {"Content-Type": "application/json"});

            let request = new PatchCommandTriggerRequest(commandRequest, statePredicate);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(400);
                expect(err.name).to.equal(Errors.HttpError);
                done();
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public triggerID: string,
                    public request: PatchCommandTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, new PatchCommandTriggerRequest(new TriggerCommandObject([{turnPower: {power:true}}], target), predicate), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is null"),
                new TestCase("", new PatchCommandTriggerRequest(new TriggerCommandObject([{turnPower: {power:true}}], target), predicate), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is empty"),
                new TestCase("trigger-01234-abcd", null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase("trigger-01234-abcd", new PatchCommandTriggerRequest(new TriggerCommandObject(null, target), null), Errors.ArgumentError, "actions of command is null", "should handle error when actions and predicate are null"),
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

    describe('#patchCommandTrigger() with promise(cross thing command trigger)', function () {
        // patchCommandTrigger method sends request to server twice.
        // 1. PATCH `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        // 2. GET  `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`
        let patchCommandTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        let responseBody4CrossThingCommandTriggerWithState = {
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
            "target": commandTarget.toString(),
            "issuer": owner.toString(),
            "actions": actions
        },
        "disabled":false
    }
        it("with StatePredicate", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "target": commandTarget.toString(),
                        "issuer": owner.toString(),
                        "actions": actions
                    }
                })
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4CrossThingCommandTriggerWithState, {"Content-Type": "application/json"});

            let request = new PatchCommandTriggerRequest(new TriggerCommandObject(actions, commandTarget, owner), statePredicate);
            triggerOps.patchCommandTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(commandTarget);
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithState, {"Content-Type": "application/json"});

            let request = new PatchServerCodeTriggerRequest(serverCode, statePredicate);
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithSchedule, {"Content-Type": "application/json"});

            let request = new PatchServerCodeTriggerRequest(serverCode, schedulePredicate);
            triggerOps.patchServerCodeTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                try {
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(200, responseBody4ServerCodeTriggerWithScheduleOnce, {"Content-Type": "application/json"});

            let request = new PatchServerCodeTriggerRequest(serverCode, scheduleOncePredicate);
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
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TRIGGER",
                "message": "The provided trigger is not valid"
            };
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                .reply(400, errResponse, {"Content-Type": "application/json"});

            let request = new PatchServerCodeTriggerRequest(serverCode, statePredicate);
            triggerOps.patchServerCodeTrigger(expectedTriggerID, request).then((trigger:Trigger)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(400);
                expect(err.name).to.equal(Errors.HttpError);
                done();
            });
        });
        describe("Argument Test", function() {
            class TestCase {
                constructor(
                    public triggerID: string,
                    public request: PatchServerCodeTriggerRequest,
                    public expectedError: string,
                    public expectedErrorMsg: string,
                    public description: string
                ){}
            }
            let serverCode = new ServerCode("servercode_func");
            let predicate = new ScheduleOncePredicate(new Date().getTime());
            let tests = [
                new TestCase(null, new PatchServerCodeTriggerRequest(null, predicate), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is null"),
                new TestCase("", new PatchServerCodeTriggerRequest(serverCode, null), Errors.ArgumentError, "triggerID is null or empty", "should handle error when triggerID is empty"),
                new TestCase("trigger-01234-abcd", null, Errors.ArgumentError, "requestObject is null", "should handle error when requestObject is null"),
                new TestCase("trigger-01234-abcd", new PatchServerCodeTriggerRequest(null, null), Errors.ArgumentError, "must specify serverCode or predicate", "should handle error when serverCode and predicate are null"),
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).put(enableTriggerPath)
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).put(disableTriggerPath)
                .reply(204, null);
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "TRIGGER_NOT_FOUND",
                "message": "The trigger is not found"
            };
            let enableTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}/enable`;
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).put(enableTriggerPath)
                .reply(404, errResponse, {"Content-Type": "application/json"});

            triggerOps.enableTrigger(expectedTriggerID, true).then((trigger:Trigger)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(404);
                expect(err.name).to.equal(Errors.HttpError);
                done();
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "TRIGGER_NOT_FOUND",
                "message": "The trigger is not found"
            };
            let deleteTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                        "Content-Type": "application/json"
                    }
                }).delete(deleteTriggerPath)
                .reply(404, errResponse, {"Content-Type": "application/json"});
            triggerOps.deleteTrigger(expectedTriggerID).then((deletedTriggerID:string)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(404);
                expect(err.name).to.equal(Errors.HttpError);
                done();
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
        let getTriggerPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}`;
        it("should send a request to the thing-if server", function (done) {
            // getTrigger() method is used by other methods internally.
            // So we can skip small test for getTrigger() method.
            done();
        });
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "TRIGGER_NOT_FOUND",
                "message": "The trigger is not found"
            };
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(getTriggerPath)
                .reply(404, errResponse, {"Content-Type": "application/json"});

            triggerOps.getTrigger(expectedTriggerID).then((trigger:Trigger)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(404);
                expect(err.name).to.equal(Errors.HttpError);
                done();
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
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
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
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
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listTriggersPath)
                .reply(200, responseBody4ListTriggers1, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listTriggersPath + `?paginationKey=${paginationKey}`)
                .reply(200, responseBody4ListTriggers2, {"Content-Type": "application/json"});

            triggerOps.listTriggers().then((result:QueryResult<Trigger>)=>{
                try {
                    expect(result.paginationKey).to.equal(paginationKey);
                    expect(result.results.length).to.equal(3);

                    var trigger = result.results[0];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("STATES");
                    expect((<StatePredicate>trigger.predicate).triggersWhen).to.equal("CONDITION_CHANGED");
                    expect((<StatePredicate>trigger.predicate).condition).to.deep.equal(condition);
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;

                    trigger = result.results[1];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE");
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
                    expect(trigger.command.actions).to.deep.equal(actions);
                    expect(trigger.command.targetID).to.deep.equal(target);
                    expect(trigger.command.issuerID).to.deep.equal(owner);
                    expect(trigger.serverCode).to.be.null;

                    trigger = result.results[2];
                    expect(trigger.triggerID).to.equal(expectedTriggerID);
                    expect(trigger.disabled).to.be.false;
                    expect(trigger.predicate.getEventSource()).to.equal("SCHEDULE_ONCE");
                    expect((<ScheduleOncePredicate>trigger.predicate).scheduleAt).to.equal(1469089120402);
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
                    expect((<SchedulePredicate>trigger.predicate).schedule).to.equal("0 12 1 * *");
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
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid"
            };
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listTriggersPath + "?bestEffortLimit=10")
                .reply(401, errResponse, {"Content-Type": "application/json"});

            triggerOps.listTriggers(new ListQueryOptions(10)).then((result:QueryResult<Trigger>)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(401);
                expect(err.name).to.equal(Errors.HttpError);
                done();
            });
        });
    });
    describe('#listServerCodeResults() with promise', function () {
        let paginationKey = "1/2"
        let responseBody4ListServerCodeResults1 = {
            triggerServerCodeResults: [
                {
                    succeeded:true,
                    returnedValue:100,
                    executedAt:1469102511270,
                    endpoint: "server_function1"
                },
                {
                    succeeded:false,
                    executedAt:1469102511271,
                    endpoint: "server_function2",
                    error : {
                        errorMessage:"Error found while executing the developer-defined code",
                        details:{
                            errorCode : "RUNTIME_ERROR",
                            message : "adminContext is not defined"
                        }
                    }
                },
                {
                    succeeded:true,
                    returnedValue:"hoge",
                    executedAt:1469102511272,
                    endpoint: "server_function3"
                },
            ],
            nextPaginationKey: paginationKey
        }
        let responseBody4ListServerCodeResults2 = {
            triggerServerCodeResults: [
                {
                    succeeded:true,
                    returnedValue:true,
                    executedAt:1469102511273,
                    endpoint: "server_function4"
                },
                {
                    succeeded:true,
                    returnedValue:{score:1000, bonus:400},
                    executedAt:1469102511274,
                    endpoint: "server_function5"
                },
            ]
        }
        let listServerCodeResultsPath = `/thing-if/apps/${testApp.appID}/targets/${target.toString()}/triggers/${expectedTriggerID}/results/server-code`;
        it("with bestEffortLimit", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listServerCodeResultsPath + `?bestEffortLimit=10`)
                .reply(200, responseBody4ListServerCodeResults2, {"Content-Type": "application/json"});
            triggerOps.listServerCodeResults(expectedTriggerID, new ListQueryOptions(10)).then((result:QueryResult<ServerCodeResult>)=>{
                try {
                    expect(result.paginationKey).to.be.null;
                    expect(result.results.length).to.equal(2);

                    var serverCodeResults = result.results[0];
                    expect(serverCodeResults.succeeded).to.be.true;
                    expect(serverCodeResults.endpoint).to.equal("server_function4");
                    expect(serverCodeResults.executedAt).to.equal(1469102511273);
                    expect(serverCodeResults.returnedValue).to.be.true;
                    expect(serverCodeResults.error).to.be.null;

                    serverCodeResults = result.results[1];
                    expect(serverCodeResults.succeeded).to.be.true;
                    expect(serverCodeResults.endpoint).to.equal("server_function5");
                    expect(serverCodeResults.executedAt).to.equal(1469102511274);
                    expect(serverCodeResults.returnedValue).to.deep.equal({score:1000, bonus:400});
                    expect(serverCodeResults.error).to.be.null;
                } catch (err) {
                    done(err);
                }
                done();
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("with pagination", function (done) {
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listServerCodeResultsPath)
                .reply(200, responseBody4ListServerCodeResults1, {"Content-Type": "application/json"});
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listServerCodeResultsPath + `?paginationKey=${paginationKey}`)
                .reply(200, responseBody4ListServerCodeResults2, {"Content-Type": "application/json"});
            triggerOps.listServerCodeResults(expectedTriggerID).then((result:QueryResult<ServerCodeResult>)=>{
                try {
                    expect(result.paginationKey).to.equal(paginationKey);
                    expect(result.results.length).to.equal(3);

                    var serverCodeResults = result.results[0];
                    expect(serverCodeResults.succeeded).to.be.true;
                    expect(serverCodeResults.endpoint).to.equal("server_function1");
                    expect(serverCodeResults.executedAt).to.equal(1469102511270);
                    expect(serverCodeResults.returnedValue).to.equal(100);
                    expect(serverCodeResults.error).to.be.null;

                    serverCodeResults = result.results[1];
                    expect(serverCodeResults.succeeded).to.be.false;
                    expect(serverCodeResults.endpoint).to.equal("server_function2");
                    expect(serverCodeResults.executedAt).to.equal(1469102511271);
                    expect(serverCodeResults.returnedValue).to.be.null;
                    expect(serverCodeResults.error).to.be.not.null;
                    expect(serverCodeResults.error.errorMessage).to.equal("Error found while executing the developer-defined code");
                    expect(serverCodeResults.error.errorCode).to.equal("RUNTIME_ERROR");
                    expect(serverCodeResults.error.detailMessage).to.equal("adminContext is not defined");

                    serverCodeResults = result.results[2];
                    expect(serverCodeResults.succeeded).to.be.true;
                    expect(serverCodeResults.endpoint).to.equal("server_function3");
                    expect(serverCodeResults.executedAt).to.equal(1469102511272);
                    expect(serverCodeResults.returnedValue).to.equal("hoge");
                    expect(serverCodeResults.error).to.be.null;
                } catch (err) {
                    done(err);
                }
                return triggerOps.listServerCodeResults(expectedTriggerID, new ListQueryOptions(null, result.paginationKey));
            }).then((result:QueryResult<ServerCodeResult>)=>{
                try {
                    expect(result.paginationKey).to.be.null;
                    expect(result.results.length).to.equal(2);

                    var serverCodeResults = result.results[0];
                    expect(serverCodeResults.succeeded).to.be.true;
                    expect(serverCodeResults.endpoint).to.equal("server_function4");
                    expect(serverCodeResults.executedAt).to.equal(1469102511273);
                    expect(serverCodeResults.returnedValue).to.be.true;
                    expect(serverCodeResults.error).to.be.null;

                    serverCodeResults = result.results[1];
                    expect(serverCodeResults.succeeded).to.be.true;
                    expect(serverCodeResults.endpoint).to.equal("server_function5");
                    expect(serverCodeResults.executedAt).to.equal(1469102511274);
                    expect(serverCodeResults.returnedValue).to.deep.equal({score:1000, bonus:400});
                    expect(serverCodeResults.error).to.be.null;
                } catch (err) {
                    done(err);
                }
                done();
            }).catch((err:ThingIFError)=>{
                done(err);
            });
        });
        it("handle error response", function (done) {
            let errResponse = {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid"
            };
            nock(
                testApp.site,
                <any>{
                    reqheaders: {
                        "X-Kii-SDK":`sn=jsi;sv=${TestUtil.sdkVersion()}`,
                        "Authorization":"Bearer " + ownerToken,
                    }
                }).get(listServerCodeResultsPath + `?bestEffortLimit=10`)
                .reply(401, errResponse, {"Content-Type": "application/json"});
            triggerOps.listServerCodeResults(expectedTriggerID, new ListQueryOptions(10)).then((result:QueryResult<ServerCodeResult>)=>{
                done("should fail");
            }).catch((err:HttpRequestError)=>{
                expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
                expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
                expect(err.body.message).to.be.equal(errResponse.message);
                expect(err.status).to.equal(401);
                expect(err.name).to.equal(Errors.HttpError);
                done();
            });
        });
    });
});
