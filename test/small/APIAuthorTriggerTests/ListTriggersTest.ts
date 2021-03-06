/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../../node_modules/@types/simple-mock/index.d.ts" />

import {Promise as P} from 'es6-promise'
import {expect} from 'chai';
import TestApp from '../TestApp'
import {APIAuthor} from '../../../src/APIAuthor';
import {TypedID} from '../../../src/TypedID';
import {Types} from '../../../src/TypedID';
import TriggerOps from '../../../src/ops/TriggerOps'
import {Trigger, TriggersWhen, TriggersWhat} from '../../../src/Trigger';
import {Command, CommandState} from '../../../src/Command';
import {Predicate, StatePredicate, SchedulePredicate, ScheduleOncePredicate, EventSource} from '../../../src/Predicate';
import {Condition} from '../../../src/Condition';
import {ThingIFError, HttpRequestError, Errors} from '../../../src/ThingIFError';
import {ServerCode} from '../../../src/ServerCode'
import {QueryResult} from '../../../src/QueryResult'
import * as simple from 'simple-mock';
import { EqualsClauseInTrigger } from '../../../src/TriggerClause';
import { AliasAction, Action } from '../../../src/AliasAction';

let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
let condition = new Condition(new EqualsClauseInTrigger("alias1", "power", "false"));
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
describe("Small Test APIAuthor#listTriggers", function() {

    describe("handle http response", function() {
        let au = new APIAuthor(ownerToken, testApp.app);

        describe("hanle success response", function(){
            let command = new Command(
                target,
                owner,
                actions);
            command.commandID = "dummy-command-id";

            let serverCode = new ServerCode(
                "server_function",
                 ownerToken,
                 testApp.appID,
                 {brightness : 100, color : "#FFF"});

            let trigger1 = new Trigger("trigger-1", predicate, false, command, null);
            let trigger2 = new Trigger("trigger-2", predicate, true, null, serverCode);
            let trigger3 = new Trigger("trigger-3", predicate, false, command, null);

            let expectedResults = new QueryResult<Trigger>([trigger1, trigger2, trigger3], "200/1")
            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'listTriggers').returnWith(
                    new P<QueryResult<Trigger>>((resolve, reject)=>{
                        resolve(expectedResults);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.listTriggers(target)
                .then((results: QueryResult<Trigger>)=>{
                    expect(results).to.be.deep.equal(expectedResults);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                au.listTriggers(target, null, (err, results)=>{
                    try{
                        expect(err).to.null;
                        expect(results).to.be.deep.equal(expectedResults);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(401, Errors.HttpError, {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid"
            })

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'listTriggers').returnWith(
                    new P<QueryResult<Trigger>>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                au.listTriggers(target)
                .then((results)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                au.listTriggers(target,null, (err, results)=>{
                    try{
                        expect(err).to.be.deep.equal(expectedError);
                        expect(results).to.null;
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })
    })
})