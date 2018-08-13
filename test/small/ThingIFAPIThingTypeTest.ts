/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />

import { Promise as P } from 'es6-promise'
import TestApp from './TestApp'
import { expect } from 'chai';
import { ThingIFAPI } from '../../src/ThingIFAPI'
import { TypedID, Types } from '../../src/TypedID'
import { Errors, HttpRequestError } from '../../src/ThingIFError'
import * as simple from 'simple-mock';
import ThingOps from '../../src/ops/ThingOps'

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");
let target = new TypedID(Types.Thing, "dummy-thing-id");

describe("Test ThingIFAPI#getThingType", function () {

    describe("handle illegalStateError", function () {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app);
        it("when targe is null, IllegalStateError should be returned",
            function (done) {
                thingIFAPI.getThingType()
                    .then(() => {
                        done("should fail");
                    }).catch((err) => {
                        expect(err.name).to.equal(Errors.IlllegalStateError);
                        done();
                    })
            })
    })
    describe("handle succeeded reponse", function () {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target)
        let expectedThingType = "myThingType"

        beforeEach(function () {
            simple.mock(ThingOps.prototype, 'getThingType').returnWith(
                new P<string>((resolve, reject) => {
                    resolve(expectedThingType);
                })
            );
        })
        afterEach(function () {
            simple.restore();
        })
        it("test promise", function (done) {
            thingIFAPI.getThingType()
                .then((thingType) => {
                    expect(thingType).equals(expectedThingType);
                    done();
                }).catch((err) => {
                    done(err);
                })
        })
        it("test callback", function (done) {
            thingIFAPI.getThingType((err, thingType) => {
                try {
                    expect(err).to.null;
                    expect(thingType).equals(expectedThingType);
                    done();
                } catch (err) {
                    done(err);
                }
            })
        })
    })

    describe("handle err reponse", function () {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target)
        let expectedError = new HttpRequestError(404, Errors.HttpError, {
            "errorCode": "THING_NOT_FOUND",
            "message": `Thing with thingID ${target.id} was not found`,
            "value": target.id,
            "field": "thingID",
            "appID": testApp.appID
        });

        beforeEach(function () {
            simple.mock(ThingOps.prototype, 'getThingType').returnWith(
                new P<string>((resolve, reject) => {
                    reject(expectedError);
                })
            );
        })
        afterEach(function () {
            simple.restore();
        })
        it("test promise", function (done) {
            thingIFAPI.getThingType()
                .then(() => {
                    done("should fail");
                }).catch((err: HttpRequestError) => {
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
        })
        it("test callback", function (done) {
            thingIFAPI.getThingType((err, thingType) => {
                try {
                    expect(err).to.be.deep.equal(expectedError);
                    expect(thingType).to.null;
                    done();
                } catch (err) {
                    done(err);
                }
            })
        })
    })
})

describe("Test ThingIFAPI#updateThingType", function () {
    let thingType = "myThingType";

    describe("handle illegalStateError", function () {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app);
        it("when targe is null, IllegalStateError should be returned",
            function (done) {
                thingIFAPI.updateThingType(thingType)
                    .then(() => {
                        done("should fail");
                    }).catch((err) => {
                        expect(err.name).to.equal(Errors.IlllegalStateError);
                        done();
                    })
            })
    })
    describe("handle succeeded reponse", function () {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target)

        beforeEach(function () {
            simple.mock(ThingOps.prototype, 'updateThingType').returnWith(
                new P<void>((resolve, reject) => {
                    resolve();
                })
            );
        })
        afterEach(function () {
            simple.restore();
        })
        it("test promise", function (done) {
            thingIFAPI.updateThingType(thingType)
                .then(() => {
                    done();
                }).catch((err) => {
                    done(err);
                })
        })
        it("test callback", function (done) {
            thingIFAPI.updateThingType(thingType, (err) => {
                try {
                    expect(err).to.null;
                    done();
                } catch (err) {
                    done(err);
                }
            })
        })
    })

    describe("handle err reponse", function () {
        let thingIFAPI = new ThingIFAPI(owner, "dummy-token", testApp.app, target)
        let expectedError = new HttpRequestError(404, Errors.HttpError, {
            "errorCode": "THING_NOT_FOUND",
            "message": `Thing with thingID ${target.id} was not found`,
            "value": target.id,
            "field": "thingID",
            "appID": testApp.appID
        });

        beforeEach(function () {
            simple.mock(ThingOps.prototype, 'updateThingType').returnWith(
                new P<void>((resolve, reject) => {
                    reject(expectedError);
                })
            );
        })
        afterEach(function () {
            simple.restore();
        })
        it("test promise", function (done) {
            thingIFAPI.updateThingType(thingType)
                .then((cmd) => {
                    done("should fail");
                }).catch((err: HttpRequestError) => {
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                })
        })
        it("test callback", function (done) {
            thingIFAPI.updateThingType(thingType, (err) => {
                try {
                    expect(err).to.be.deep.equal(expectedError);
                    done();
                } catch (err) {
                    done(err);
                }
            })
        })
    })
})