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
import OnboardingOps from '../../src/ops/OnboardingOps'
import {OnboardingResult, MqttEndpoint} from '../../src/OnboardingResult'
import * as simple from 'simple-mock';

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");
let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app);

describe("Small Test onboarding APIs of ThingIFAPI", function() {
    describe("Test ThingIFAPI#onboardWithThingID", function() {
        let request = new Options.OnboardWithThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", owner);

        describe("handle succeeded reponse", function() {
            let expectedResult = new OnboardingResult(
                "dummy-id",
                "dummy-token",
                new MqttEndpoint(
                    "roiczg4byahl2xji1fp2r1vk2",
                    "jp-mqtt-13915c439c5e.kii.com",
                    "obEHMF5Y3qeuAltpXjvSLnx",
                    "163fa051-p6QcV3cP5oFJjdEAZO6d2uC",
                    "jzgbQibmANOzaLLFkmnNCICbgHFYNyUBVlMREKHDbaHvmmWcmAGQlVYuoxQZAsQG",
                    8883,
                    1883)
                );

            beforeEach(function() {
                simple.mock(OnboardingOps.prototype, 'onboardWithThingID').returnWith(
                    new P<OnboardingResult>((resolve, reject)=>{
                        resolve(expectedResult);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.onboardWithThingID(request)
                .then((result)=>{
                    expect(result).to.be.deep.equal(expectedResult);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.onboardWithThingID(request,(err, result)=>{
                    try{
                        expect(err).to.null;
                        expect(result).to.be.deep.equal(expectedResult);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(403, Errors.HttpError, {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid",
                "appID": testApp.appID,
                "accessToken": "dummy-token"
            });

            beforeEach(function() {
                simple.mock(OnboardingOps.prototype, 'onboardWithThingID').returnWith(
                    new P<OnboardingResult>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.onboardWithThingID(request)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.onboardWithThingID(request,(err, cmd)=>{
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

    describe("Test ThingIFAPI#onboardWithVendorThingID", function() {
        let request = new Options.OnboardWithVendorThingIDRequest("th.7b3f20b00022-414b-6e11-0374-03ab0ce5", "password", owner);

        describe("handle succeeded reponse", function() {
            let expectedResult = new OnboardingResult(
                "dummy-id",
                "dummy-token",
                new MqttEndpoint(
                    "roiczg4byahl2xji1fp2r1vk2",
                    "jp-mqtt-13915c439c5e.kii.com",
                    "obEHMF5Y3qeuAltpXjvSLnx",
                    "163fa051-p6QcV3cP5oFJjdEAZO6d2uC",
                    "jzgbQibmANOzaLLFkmnNCICbgHFYNyUBVlMREKHDbaHvmmWcmAGQlVYuoxQZAsQG",
                    8883,
                    1883)
                );

            beforeEach(function() {
                simple.mock(OnboardingOps.prototype, 'onboardWithVendorThingID').returnWith(
                    new P<OnboardingResult>((resolve, reject)=>{
                        resolve(expectedResult);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.onboardWithVendorThingID(request)
                .then((result)=>{
                    expect(result).to.be.deep.equal(expectedResult);
                    done();
                }).catch((err)=>{
                    done(err);
                })
            })
            it("test callback", function (done) {
                thingIFAPI.onboardWithVendorThingID(request,(err, result)=>{
                    try{
                        expect(err).to.null;
                        expect(result).to.be.deep.equal(expectedResult);
                        done();
                    }catch(err){
                        done(err);
                    }
                })
            })
        })

        describe("handle err reponse", function() {
            let expectedError = new HttpRequestError(403, Errors.HttpError, {
                "errorCode": "WRONG_TOKEN",
                "message": "The provided token is not valid",
                "appID": testApp.appID,
                "accessToken": "dummy-token"
            });

            beforeEach(function() {
                simple.mock(OnboardingOps.prototype, 'onboardWithVendorThingID').returnWith(
                    new P<OnboardingResult>((resolve, reject)=>{
                        reject(expectedError);
                    })
                );
            })
            afterEach(function() {
                simple.restore();
            })
            it("test promise", function (done) {
                thingIFAPI.onboardWithVendorThingID(request)
                .then((cmd)=>{
                    done("should fail");
                }).catch((err: HttpRequestError)=>{
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
            })
            it("test callback", function (done) {
                thingIFAPI.onboardWithVendorThingID(request,(err, cmd)=>{
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

