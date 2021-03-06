/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import { Promise as P } from 'es6-promise'
import TestApp from '../TestApp'
import { expect } from 'chai';
import { Response } from '../../../src/ops/Response'
import ThingOps from '../../../src/ops/ThingOps'
import { APIAuthor } from '../../../src/APIAuthor'
import { Errors, HttpRequestError, ThingIFError } from '../../../src/ThingIFError'

import * as nock from 'nock'
let scope: nock.Scope;
let testApp = new TestApp();
let au = new APIAuthor("dummy-token", testApp.app);
let thingID = "th.7b3f20b00022-414b-6e11-0374-03ab0cf8";
let thingOp = new ThingOps(au, thingID);
describe('Test ThingOps#getFirmwareVersion', function () {
    let path = `/thing-if/apps/${testApp.appID}/things/${thingID}/firmware-version`;
    let reqHeaders = {
        "Authorrization": `Bearer ${au.token}`
    };
    let expectedFwVersion = "v2";

    beforeEach(function () {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(testApp.site, <any>reqHeaders)
            .get(path)
            .reply(
            200,
            { "firmwareVersion":  expectedFwVersion},
            { "Content-Type": "application/vnd.kii.ThingTypeRetrievalResponse+json" }
            );

        thingOp.getFirmwareVersion().then((fwVersion) => {
            expect(fwVersion).to.equal(expectedFwVersion);
            done();
        }).catch((err) => {
            done(err);
        })
    });

    it("handle 404 error response of THING_NOT_FOUND, promise should reject", function (done) {
        let errResponse = {
            "errorCode": "THING_NOT_FOUND",
            "message": `Thing with thingID ${thingID} was not found`,
            "value": thingID,
            "field": "thingID",
            "appID": testApp.appID
        };

        scope = nock(testApp.site, <any>reqHeaders)
            .get(path)
            .reply(
            404,
            errResponse,
            { "Content-Type": "application/vnd.kii.ThingNotFoundException+json" }
            );

        thingOp.getFirmwareVersion().then(() => {
            done("should fail");
        }).catch((err: HttpRequestError) => {
            expect(err).not.be.null;
            expect(err.status).to.equal(404);
            expect(err.name).to.equal(Errors.HttpError);
            expect(JSON.parse(err.body.rawData)).to.deep.equal(errResponse);
            expect(err.body.errorCode).to.be.equal(errResponse.errorCode);
            expect(err.body.message).to.be.equal(errResponse.message);
            done();
        }).catch((err: Error) => {
            done(err);
        });
    });
    it("handle 404 error response of THING_WITHOUT_FIRMWARE_VERSION, promise should reject", function (done) {
        let errResponse = {
            "errorCode": "THING_WITHOUT_FIRMWARE_VERSION",
            "message": `The thing does not have thing type associated`,
        };

        scope = nock(testApp.site, <any>reqHeaders)
            .get(path)
            .reply(
            404,
            errResponse,
            { "Content-Type": "application/vnd.kii.ThingWithoutFirmwareVersionException+json" }
            );

        thingOp.getFirmwareVersion().then((fwVersion) => {
            expect(fwVersion).null;
            done();
        }).catch((err) => {
            done("should not faild: " + err);
        });
    });
});