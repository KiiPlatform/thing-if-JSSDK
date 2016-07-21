/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise'
import TestApp from './TestApp'
import {expect} from 'chai';
import {ThingIFAPI} from '../../src/ThingIFAPI'
import {TypedID, Types} from '../../src/TypedID'
import {Errors, HttpRequestError} from '../../src/ThingIFError'
import * as Options from '../../src/RequestObjects'
import StateOps from '../../src/ops/StateOps'
import * as simple from 'simple-mock';

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");
let target = new TypedID(Types.Thing, "dummy-thing-id");


describe("Test ThingIFAPI#getState", function() {
    describe("Return IllegalStateError", function() {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app);
        it("when targe is null, IllegalStateError should be returned(promise)",
            function (done) {
            thingIFAPI.getState()
            .then(()=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })

    describe("handle succeeded reponse", function() {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);
        let expectedState = {power: true};

        beforeEach(function() {
            simple.mock(StateOps.prototype, 'getState').returnWith(
                new P<Object>((resolve, reject)=>{
                    resolve(expectedState);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            thingIFAPI.getState()
            .then((state)=>{
                expect(state).to.be.deep.equal(expectedState);
                done();
            }).catch((err)=>{
                done(err);
            })
        })
        it("test callback", function (done) {
            thingIFAPI.getState((err, state)=>{
                try{
                    expect(err).to.null;
                    expect(state).to.be.deep.equal(expectedState);
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })

    describe("handle err reponse", function() {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target);
        let expectedError = new HttpRequestError(404, Errors.HttpError, {
            "errorCode": "TARGET_NOT_FOUND",
            "message": `Target thing:${target.id} not found`
        });

        beforeEach(function() {
            simple.mock(StateOps.prototype, 'getState').returnWith(
                new P<Object>((resolve, reject)=>{
                    reject(expectedError);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            thingIFAPI.getState()
            .then((state)=>{
                done("should fail");
            }).catch((err: HttpRequestError)=>{
                expect(err).to.be.deep.equal(expectedError);
                done();
            })
        })
        it("test callback", function (done) {
            thingIFAPI.getState((err, state)=>{
                try{
                    expect(err).to.be.deep.equal(expectedError);
                    expect(state).to.null;
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })
})