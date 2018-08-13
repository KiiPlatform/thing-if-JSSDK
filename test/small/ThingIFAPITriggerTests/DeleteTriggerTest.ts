/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../../node_modules/@types/simple-mock/index.d.ts" />

import {Promise as P} from 'es6-promise'
import {expect} from 'chai';
import TestApp from '../TestApp'
import {ThingIFAPI} from '../../../src/ThingIFAPI';
import {TypedID} from '../../../src/TypedID';
import {Types} from '../../../src/TypedID';
import TriggerOps from '../../../src/ops/TriggerOps'
import {ThingIFError, HttpRequestError, Errors} from '../../../src/ThingIFError';
import * as simple from 'simple-mock';

let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
let triggerID = "dummy-trigger-id";
describe("Small Test ThingIFAPI#deleteTrigger", function() {
    describe("handle IllegalStateError", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app);
        it("when targe is null, IllegalStateError should be returned(promise)",
            function (done) {
            thingIFAPI.deleteTrigger(triggerID)
            .then((triggerID: string)=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })

    describe("handle http response", function() {
        let thingIFAPI = new ThingIFAPI(owner, ownerToken, testApp.app, target);
        let expectedTriggerID = triggerID;
        describe("hanle success response", function(){

            beforeEach(function() {
                simple.mock(TriggerOps.prototype, 'deleteTrigger').returnWith(
                    new P<string>((resolve, reject)=>{
                        resolve(expectedTriggerID);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.deleteTrigger(triggerID)
                .then((triggerID)=>{
                    expect(triggerID).to.be.deep.equal(expectedTriggerID);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.deleteTrigger(triggerID,(err, triggerID)=>{
                    try{
                        expect(err).to.null;
                        expect(triggerID).to.be.deep.equal(expectedTriggerID);
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
                simple.mock(TriggerOps.prototype, 'deleteTrigger').returnWith(
                    new P<string>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.deleteTrigger(triggerID)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.deleteTrigger(triggerID,(err, cmd)=>{
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