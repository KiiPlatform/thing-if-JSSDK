/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/globals/simple-mock/index.d.ts" />

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

describe("Small test get/update firmwareVersion APIs of APIAuthor", function () {
    describe("Test APIAuthor#getFirmwareVersion", function () {
        describe("handle succeeded reponse", function () {
            let au = new APIAuthor("dummy-token", testApp.app)
            let expectedFirmwareVersion = "myFirmwareVersion"

            beforeEach(function () {
                simple.mock(ThingOps.prototype, 'getFirmwareVersion').returnWith(
                    new P<string>((resolve, reject) => {
                        resolve(expectedFirmwareVersion);
                    })
                );
            })
            afterEach(function () {
                simple.restore();
            })
            it("test promise", function (done) {
                au.getFirmwareVersion(target.id)
                    .then((firmwareVersion) => {
                        expect(firmwareVersion).to.be.deep.equal(expectedFirmwareVersion);
                        done();
                    }).catch((err) => {
                        done(err);
                    })
            })
            it("test callback", function (done) {
                au.getFirmwareVersion(target.id, (err, firmwareVersion) => {
                    try {
                        expect(err).to.null;
                        expect(firmwareVersion).equals(expectedFirmwareVersion);
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
                simple.mock(ThingOps.prototype, 'getFirmwareVersion').returnWith(
                    new P<string>((resolve, reject) => {
                        reject(expectedError);
                    })
                );
            })
            afterEach(function () {
                simple.restore();
            })
            it("test promise", function (done) {
                au.getFirmwareVersion(target.id)
                    .then((cmd) => {
                        done("should fail");
                    }).catch((err: HttpRequestError) => {
                        expect(err).to.be.deep.equal(expectedError);
                        done();
                    })
            })
            it("test callback", function (done) {
                au.getFirmwareVersion(target.id, (err, cmd) => {
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

    describe("Test APIAuthor#updateFirmwareVersion", function () {
        let firmwareVersion = "firmwareVersion";
        describe("handle succeeded reponse", function () {
            beforeEach(function () {
                simple.mock(ThingOps.prototype, 'updateFirmwareVersion').returnWith(
                    new P<void>((resolve, reject) => {
                        resolve();
                    })
                );
            })
            afterEach(function () {
                simple.restore();
            })
            it("test promise", function (done) {
                au.updateFirmwareVersion(target.id, firmwareVersion)
                    .then(() => {
                        done();
                    }).catch((err) => {
                        done(err);
                    })
            })
            it("test callback", function (done) {
                au.updateFirmwareVersion(target.id, firmwareVersion, (err) => {
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
                simple.mock(ThingOps.prototype, 'updateFirmwareVersion').returnWith(
                    new P<void>((resolve, reject) => {
                        reject(expectedError);
                    })
                );
            })
            afterEach(function () {
                simple.restore();
            })
            it("test promise", function (done) {
                au.updateFirmwareVersion(target.id, firmwareVersion)
                    .then(() => {
                        done("should fail");
                    }).catch((err: HttpRequestError) => {
                        expect(err).to.be.deep.equal(expectedError);
                        done();
                    })
            })
            it("test callback", function (done) {
                au.updateFirmwareVersion(target.id, firmwareVersion, (err) => {
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