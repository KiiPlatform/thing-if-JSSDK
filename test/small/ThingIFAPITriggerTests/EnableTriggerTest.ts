/// <reference path="../../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../../typings/globals/chai/index.d.ts" />
/// <reference path="../../../typings/globals/simple-mock/index.d.ts" />

import {Promise as P} from 'es6-promise'
import {expect} from 'chai';
import TestApp from '../TestApp'
import {ThingIFAPI} from '../../../src/ThingIFAPI';
import {TypedID} from '../../../src/TypedID';
import {Types} from '../../../src/TypedID';
import TriggerOps from '../../../src/ops/TriggerOps'
import {Trigger, TriggersWhen, TriggersWhat} from '../../../src/Trigger';
import {Command, CommandState} from '../../../src/Command';
import {Predicate, StatePredicate, SchedulePredicate, ScheduleOncePredicate, EventSource} from '../../../src/Predicate';
import {Condition} from '../../../src/Condition';
import {ThingIFError, HttpRequestError, Errors} from '../../../src/ThingIFError';
import {ServerCode} from '../../../src/ServerCode'
import * as simple from 'simple-mock';
import { EqualsClauseInTrigger } from '../../../src/TriggerClause';
import { AliasAction, Action } from '../../../src/AliasAction';

let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
let condition = new Condition(new EqualsClauseInTrigger("alias", "power", "false"));
let actions = [
    new AliasAction("alias1", [
        new Action("turnPower", true),
        new Action("setPresetTemp", 23)
    ]),
    new AliasAction("alias2", [
        new Action("setPresetHum", 45)
    ])
];
let predicate = new StatePredicate(condition, TriggersWhen.CONDITION_CHANGED);
let serverCode = new ServerCode("server_function", ownerToken, testApp.appID, {brightness : 100, color : "#FFF"});
let triggerID = "dummy-trigger-id";
describe("Small Test ThingIFAPI#enableTrigger", function() {
    describe("handle IllegalStateError", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app);
        it("when targe is null, IllegalStateError should be returned(promise)",
            function (done) {
            thingIFAPI.enableTrigger(triggerID, true)
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
                actions);
            command.commandID = "dummy-command-id";

            let expectedTrigger = new Trigger("trigger-1",predicate, false, command, null);

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'enableTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        resolve(expectedTrigger);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.enableTrigger(triggerID, true)
                .then((trigger)=>{
                    expect(trigger).to.be.deep.equal(expectedTrigger);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.enableTrigger(triggerID, true,(err, trigger)=>{
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
            let expectedError = new HttpRequestError(404, Errors.HttpError, {
                "errorCode": "TRIGGER_NOT_FOUND",
                "message": "The trigger is not found"
            })

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'enableTrigger').returnWith(
                    new P<Trigger>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.enableTrigger(triggerID, true)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.enableTrigger(triggerID, true,(err, cmd)=>{
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