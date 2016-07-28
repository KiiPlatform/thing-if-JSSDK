/// <reference path="../../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../../typings/globals/chai/index.d.ts" />
/// <reference path="../../../typings/globals/simple-mock/index.d.ts" />
/// <reference path="../../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import {expect} from 'chai';
import TestApp from '../TestApp'
import {APIAuthor} from '../../../src/APIAuthor';
import {TypedID} from '../../../src/TypedID';
import {Types} from '../../../src/TypedID';
import {CommandTriggerRequest, ServerCodeTriggerRequest, ListQueryOptions} from '../../../src/RequestObjects';
import TriggerOps from '../../../src/ops/TriggerOps'
import {Trigger, TriggersWhen, TriggersWhat} from '../../../src/Trigger';
import {Command, CommandState} from '../../../src/Command';
import {Predicate, StatePredicate, SchedulePredicate, ScheduleOncePredicate, EventSource} from '../../../src/Predicate';
import {Condition} from '../../../src/Condition';
import {Clause, Equals, NotEquals, Range, And, Or} from '../../../src/Clause';
import {ThingIFError, HttpRequestError, Errors} from '../../../src/ThingIFError';
import {ServerCode} from '../../../src/ServerCode'
import * as simple from 'simple-mock';

let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
let schemaName = "LED";
let schemaVersion = 1;
let condition = new Condition(new Equals("power", "false"));
let actions = [{turnPower: {power:true}}, {setColor: {color: [255,0,255]}}];
let predicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
let serverCode = new ServerCode("server_function", ownerToken, testApp.appID, {brightness : 100, color : "#FFF"});
let triggerID = "dummy-trigger-id";
describe("Small Test APIAuthor#patchCommandTrigger", function() {
    let request = new CommandTriggerRequest(schemaName, schemaVersion, actions, predicate, owner);

    describe("handle http response", function() {
        let au = new APIAuthor(ownerToken, testApp.app);

        describe("hanle success response", function(){
            let command = new Command(
                target,
                owner,
                "LED",
                1,
                [{"turnPower": {"power": true}}]);
            command.commandID = "dummy-command-id";

            let expectedTrigger = new Trigger(predicate, command, null);
            expectedTrigger.triggerID = "dummy-trigger-id";
            expectedTrigger.disabled = false;

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'patchCommandTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        resolve(expectedTrigger);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.patchCommandTrigger(target, triggerID,request)
                .then((trigger)=>{
                    expect(trigger).to.be.deep.equal(expectedTrigger);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.patchCommandTrigger(target, triggerID,request,(err, trigger)=>{
                    try{
                        expect(err).to.null;
                        expect(trigger).to.be.deep.equal(expectedTrigger);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(400, Errors.HttpError, {
                "errorCode": "WRONG_TRIGGER",
                "message": "The provided trigger is not valid"
            })

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'patchCommandTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.patchCommandTrigger(target, triggerID,request)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.patchCommandTrigger(target, triggerID,request,(err, cmd)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(cmd).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })
})

describe("Small Test APIAuthor#patchServerCodeTrigger", function() {
    let request = new ServerCodeTriggerRequest(serverCode, predicate);

    describe("handle http response", function() {
        let au = new APIAuthor(ownerToken, testApp.app);

        describe("hanle success response", function(){

            let expectedTrigger = new Trigger(predicate, null, serverCode);
            expectedTrigger.triggerID = "dummy-trigger-id";
            expectedTrigger.disabled = false;

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'patchServerCodeTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        resolve(expectedTrigger);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.patchServerCodeTrigger(target, triggerID,request)
                .then((trigger)=>{
                    expect(trigger).to.be.deep.equal(expectedTrigger);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.patchServerCodeTrigger(target, triggerID,request,(err, trigger)=>{
                    try{
                        expect(err).to.null;
                        expect(trigger).to.be.deep.equal(expectedTrigger);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(400, Errors.HttpError, {
                "errorCode": "WRONG_TRIGGER",
                "message": "The provided trigger is not valid"
            })

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'patchServerCodeTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.patchServerCodeTrigger(target, triggerID,request)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.patchServerCodeTrigger(target, triggerID,request,(err, cmd)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(cmd).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })
})