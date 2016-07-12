/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />
import TestBase from './TestBase'
import {expect} from 'chai';
import {Response} from '../../src/ops/Response'
import * as PushOps from '../../src/ops/PushOps'
import {default as request} from '../../src/ops/Request'
import {APIAuthor} from '../../src/APIAuthor'
import MqttInstallationResult from '../../src/MqttInstallationResult'

import * as nock from 'nock'
let scope : nock.Scope;
let testApp = new TestBase();
let au = new APIAuthor("dummy-token", testApp.app);

describe('Test installFCM', function () {
    let path = `/api/apps/${testApp.appID}/installations`;
    let reqHeaders = {
        "Content-Type": "application/vnd.kii.InstallationCreationRequest+json",
        "Authorrization": `Bearer ${au.token}`
    };
    let expectedInstallationID = "69lp6jr0evcirfcfk2mmwiow5";

    beforeEach(function() {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                installationRegistrationID: expectedInstallationID,
                deviceType: "ANDROID",
                development: true
            })
            .reply(
                201,
                {installationID: expectedInstallationID},
                {"Content-Type": "application/vnd.kii.InstallationCreationResponse+json"}
            );

        PushOps.installFCM(au, expectedInstallationID, true).then((installID)=>{
            expect(installID).to.equal(expectedInstallationID);
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    it("handle 400 error response", function (done) {
        let errResponse = {
            "errorCode": "INVALID_INPUT_DATA",
            "message": "There are validation errors: installationRegistrationID - Must not be null or empty.",
            "invalidFields": {
                "installationRegistrationID": "Must not be null or empty"
            }
        };
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                installationRegistrationID: expectedInstallationID,
                deviceType: "ANDROID",
                development: true
            })
            .reply(
                400,
                errResponse,
                {"Content-Type": "application/vnd.kii.ValidationException+json"}
            );

        PushOps.installFCM(au, expectedInstallationID, true).then((installID)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(400);
            expect(err.message).deep.equal(errResponse);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });

    it("handle 403 error response", function (done) {
        let errResponse = {
            "errorCode": "WRONG_TOKEN",
            "message": "The provided token is not valid",
            "appID": testApp.appID,
            "accessToken": au.token
        };
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                installationRegistrationID: expectedInstallationID,
                deviceType: "ANDROID",
                development: true
            })
            .reply(
                403,
                errResponse,
                {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
            );

        PushOps.installFCM(au, expectedInstallationID, true).then((installID)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(403);
            expect(err.message).deep.equal(errResponse);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});

describe('Test installMQTT', function () {
    let path = `/api/apps/${testApp.appID}/installations`;
    let reqHeaders = {
        "Content-Type": "application/vnd.kii.InstallationCreationRequest+json",
        "Authorrization": `Bearer ${au.token}`
    };
    let expectedInstallationID = "69lp6jr0evcirfcfk2mmwiow5";
    let expectedInstallationRegistrationID = "b79dbf4d-c4fc-4bde-9c08-2860f3a4c389";

    beforeEach(function() {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                deviceType: "MQTT",
                development: true
            })
            .reply(
                201,
                {installationID: expectedInstallationID, installationRegistrationID: expectedInstallationRegistrationID},
                {"Content-Type": "application/vnd.kii.InstallationCreationResponse+json"}
            );

        PushOps.installMqtt(au, true).then((result)=>{
            expect(result.installationID).to.equal(expectedInstallationID);
            expect(result.installationRegistrationID).to.equal(expectedInstallationRegistrationID);
            done();
        }).catch((err)=>{
            done(err);
        })
    });

    it("handle 403 error response", function (done) {
        let errResponse = {
            "errorCode": "WRONG_TOKEN",
            "message": "The provided token is not valid",
            "appID": testApp.appID,
            "accessToken": au.token
        };
        scope = nock(testApp.site, <any>reqHeaders)
            .post(path,{
                deviceType: "MQTT",
                development: true
            })
            .reply(
                403,
                errResponse,
                {"Content-Type": "application/vnd.kii.WrongTokenException+json"}
            );

        PushOps.installMqtt(au, true).then((result)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(403);
            expect(err.message).deep.equal(errResponse);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});