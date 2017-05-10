/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import { Promise as P } from 'es6-promise'
import TestApp from './TestApp'
import { expect } from 'chai';
import { APIAuthor } from '../../src/APIAuthor'
import { TypedID, Types } from '../../src/TypedID'
import { Errors, HttpRequestError } from '../../src/ThingIFError'
import * as simple from 'simple-mock';
import ThingOps from '../../src/ops/ThingOps'

let testApp = new TestApp();
let owner = new TypedID(Types.User, "dummy-user");
let target = new TypedID(Types.Thing, "dummy-thing-id");
let au = new APIAuthor("dummy-token", testApp.app)

describe("Small test get/update thingType APIs of APIAuthor", function () {
    describe("Test APIAuthor#getThingType", function () {
        describe("handle succeeded reponse", function () {
            let au = new APIAuthor("dummy-token", testApp.app)
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
                au.getThingType(target.id)
                    .then((thingType) => {
                        expect(thingType).to.be.deep.equal(expectedThingType);
                        done();
                    }).catch((err) => {
                        done(err);
                    })
            })
            it("test callback", function (done) {
                au.getThingType(target.id, (err, thingType) => {
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
                au.getThingType(target.id)
                    .then((cmd) => {
                        done("should fail");
                    }).catch((err: HttpRequestError) => {
                        expect(err).to.be.deep.equal(expectedError);
                        done();
                    })
            })
            it("test callback", function (done) {
                au.getThingType(target.id, (err, cmd) => {
                    try {
                        expect(err).to.be.deep.equal(expectedError);
                        expect(cmd).to.null;
                        done();
                    } catch (err) {
                        done(err);
                    }
                })
            })
        })
    })

    describe("Test APIAuthor#updateThingType", function () {
        let thingType = "thingType";
        describe("handle succeeded reponse", function () {
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
                au.updateThingType(target.id, thingType)
                    .then(() => {
                        done();
                    }).catch((err) => {
                        done(err);
                    })
            })
            it("test callback", function (done) {
                au.updateThingType(target.id, thingType, (err) => {
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
                au.updateThingType(target.id, thingType)
                    .then(() => {
                        done("should fail");
                    }).catch((err: HttpRequestError) => {
                        expect(err).to.be.deep.equal(expectedError);
                        done();
                    })
            })
            it("test callback", function (done) {
                au.updateThingType(target.id, thingType, (err) => {
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
})