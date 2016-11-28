/// <reference path="../../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../../typings/globals/chai/index.d.ts" />
/// <reference path="../../../typings/globals/simple-mock/index.d.ts" />
/// <reference path="../../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import {expect} from 'chai';
import TestApp from '../TestApp'
import {ThingIFAPI} from '../../../src/ThingIFAPI';
import {TypedID} from '../../../src/TypedID';
import {Types} from '../../../src/TypedID';
import {PostCommandTriggerRequest, PostServerCodeTriggerRequest, ListQueryOptions, TriggerCommandObject} from '../../../src/RequestObjects';
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
let powerAlias = "PowerAlias";
let colorAlias = "ColorAlias";
let condition = new Condition(new Equals("power", "false", powerAlias));
let actions = [{powerAlias: [{turnPower: true}]}, {colorAlias: [{setColor: [255,0,255]}]}];
let predicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
let serverCode = new ServerCode("server_function", ownerToken, testApp.appID, {brightness : 100, color : "#FFF"});

describe("Small Test ThingIFAPI#postCommandTrigger", function() {
    let request = new PostCommandTriggerRequest(new TriggerCommandObject(actions, target, owner), predicate);
    describe("handle IllegalStateError", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app);
        it("when targe is null, IllegalStateError should be returned(promise)",
            function (done) {
            let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app);
            thingIFAPI.postCommandTrigger(request)
            .then((trigger: Trigger)=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
        it("when owner is null, IllegalStateError should be returned(promise)",
            function (done) {
            let thingIFAPI = new ThingIFAPI(null, ownerToken, testApp.app, target);
            thingIFAPI.postCommandTrigger(request)
            .then((trigger: Trigger)=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })

    describe("handle http response", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app, target);

        describe("hanle success response", function(){
            let command = new Command(
                target,
                owner,
                [{powerAlias: [{"turnPower": true}]}]);
            command.commandID = "dummy-command-id";

            let expectedTrigger = new Trigger(predicate, command, null);
            expectedTrigger.triggerID = "dummy-trigger-id";
            expectedTrigger.disabled = false;

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'postCommandTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        resolve(expectedTrigger);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.postCommandTrigger(request)
                .then((trigger)=>{
                    expect(trigger).to.be.deep.equal(expectedTrigger);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.postCommandTrigger(request,(err, trigger)=>{
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
                simple.mock(TriggerOps.prototype, 'postCommandTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.postCommandTrigger(request)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.postCommandTrigger(request,(err, cmd)=>{
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

describe("Small Test ThingIFAPI#postServerCodeTrigger", function() {
    let request = new PostServerCodeTriggerRequest(serverCode, predicate);
    describe("handle IllegalStateError", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app);
        it("when targe is null, IllegalStateError should be returned(promise)",
            function (done) {
            thingIFAPI.postServerCodeTrigger(request)
            .then((trigger: Trigger)=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })

    describe("handle http response", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app, target);

        describe("hanle success response", function(){

            let expectedTrigger = new Trigger(predicate, null, serverCode);
            expectedTrigger.triggerID = "dummy-trigger-id";
            expectedTrigger.disabled = false;

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'postServerCodeTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        resolve(expectedTrigger);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.postServerCodeTrigger(request)
                .then((trigger)=>{
                    expect(trigger).to.be.deep.equal(expectedTrigger);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.postServerCodeTrigger(request,(err, trigger)=>{
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
                simple.mock(TriggerOps.prototype, 'postServerCodeTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.postServerCodeTrigger(request)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.postServerCodeTrigger(request,(err, cmd)=>{
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
